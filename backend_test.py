#!/usr/bin/env python3
"""
Backend API Testing for Supreme Pet Clinic
Tests all endpoints: /api/blogs, /api/appointments, /api/messages, /api/admin/login
"""

import requests
import sys
import json
from datetime import datetime, timedelta

class PetClinicAPITester:
    def __init__(self, base_url="https://pet-clinic-savar.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health endpoint"""
        print("\n🔍 Testing Health Check...")
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login with correct password"""
        print("\n🔍 Testing Admin Login...")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"password": "supreme2024"}
        )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"✅ Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        print("\n🔍 Testing Admin Login with Wrong Password...")
        success, response = self.run_test(
            "Admin Login Wrong Password",
            "POST",
            "admin/login",
            401,
            data={"password": "wrongpassword"}
        )
        return success

    def get_auth_headers(self):
        """Get authorization headers"""
        if not self.admin_token:
            return {}
        return {"Authorization": f"Bearer {self.admin_token}"}

    def test_blogs_public(self):
        """Test public blog endpoints"""
        print("\n🔍 Testing Public Blog Endpoints...")
        
        # Test get all blogs (public)
        success, blogs = self.run_test(
            "Get Public Blogs",
            "GET",
            "blogs",
            200
        )
        
        if success and isinstance(blogs, list) and len(blogs) > 0:
            # Test get single blog
            blog_id = blogs[0]['id']
            success2, blog = self.run_test(
                "Get Single Blog",
                "GET",
                f"blogs/{blog_id}",
                200
            )
            return success and success2
        
        return success

    def test_appointments_public(self):
        """Test public appointment creation"""
        print("\n🔍 Testing Public Appointment Creation...")
        
        # Create test appointment
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        appointment_data = {
            "pet_name": "টেস্ট কুকুর",
            "pet_type": "কুকুর",
            "owner_name": "টেস্ট মালিক",
            "phone": "01700000000",
            "service": "সাধারণ চেকআপ",
            "preferred_date": tomorrow,
            "preferred_time": "সকাল ১০:০০ - ১১:০০",
            "notes": "টেস্ট এপয়েন্টমেন্ট"
        }
        
        success, response = self.run_test(
            "Create Appointment",
            "POST",
            "appointments",
            200,
            data=appointment_data
        )
        
        if success and 'id' in response:
            self.test_appointment_id = response['id']
            return True
        return False

    def test_messages_public(self):
        """Test public message submission"""
        print("\n🔍 Testing Public Message Submission...")
        
        message_data = {
            "name": "টেস্ট ব্যবহারকারী",
            "phone": "01700000000",
            "email": "test@example.com",
            "message": "এটি একটি টেস্ট মেসেজ।"
        }
        
        success, response = self.run_test(
            "Submit Message",
            "POST",
            "messages",
            200,
            data=message_data
        )
        
        if success and 'id' in response:
            self.test_message_id = response['id']
            return True
        return False

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        if not self.admin_token:
            print("❌ No admin token available for admin endpoint tests")
            return False

        print("\n🔍 Testing Admin Endpoints...")
        auth_headers = self.get_auth_headers()
        
        # Test admin stats
        success1, stats = self.run_test(
            "Admin Stats",
            "GET",
            "admin/stats",
            200,
            headers=auth_headers
        )
        
        # Test get all appointments (admin)
        success2, appointments = self.run_test(
            "Get All Appointments (Admin)",
            "GET",
            "appointments",
            200,
            headers=auth_headers
        )
        
        # Test get all blogs including drafts (admin)
        success3, all_blogs = self.run_test(
            "Get All Blogs (Admin)",
            "GET",
            "blogs/all",
            200,
            headers=auth_headers
        )
        
        # Test get all messages (admin)
        success4, messages = self.run_test(
            "Get All Messages (Admin)",
            "GET",
            "messages",
            200,
            headers=auth_headers
        )
        
        return success1 and success2 and success3 and success4

    def test_admin_verify(self):
        """Test admin session verification"""
        if not self.admin_token:
            return False
            
        print("\n🔍 Testing Admin Session Verification...")
        auth_headers = self.get_auth_headers()
        
        success, response = self.run_test(
            "Admin Session Verify",
            "GET",
            "admin/verify",
            200,
            headers=auth_headers
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access to admin endpoints"""
        print("\n🔍 Testing Unauthorized Access...")
        
        # Try to access admin stats without token
        success1, response = self.run_test(
            "Unauthorized Admin Stats",
            "GET",
            "admin/stats",
            401
        )
        
        # Try to access appointments without token
        success2, response = self.run_test(
            "Unauthorized Appointments",
            "GET",
            "appointments",
            401
        )
        
        return success1 and success2

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Supreme Pet Clinic API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Basic tests
        self.test_health_check()
        
        # Public endpoint tests
        self.test_blogs_public()
        self.test_appointments_public()
        self.test_messages_public()
        
        # Auth tests
        self.test_admin_login_wrong_password()
        self.test_admin_login()
        
        # Admin endpoint tests
        if self.admin_token:
            self.test_admin_verify()
            self.test_admin_endpoints()
        
        # Security tests
        self.test_unauthorized_access()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            return 1

def main():
    tester = PetClinicAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())