import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, FileText, MessageSquare, LogOut, 
  Home, Loader2, Plus, Trash2, Eye, Check, Menu, X,
  RefreshCw, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_1f657fef-67dc-4bd6-b745-98b3a70b1384/artifacts/v2gm9yua_image.png";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "পোষা প্রাণীর যত্ন"
  });
  const navigate = useNavigate();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("admin_token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const verifyAuth = useCallback(async () => {
    try {
      await axios.get(`${API}/admin/verify`, { headers: getAuthHeaders() });
      return true;
    } catch {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
      return false;
    }
  }, [getAuthHeaders, navigate]);

  const fetchData = useCallback(async () => {
    if (!await verifyAuth()) return;
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [statsRes, apptRes, blogRes, msgRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/appointments`, { headers }),
        axios.get(`${API}/blogs/all`, { headers }),
        axios.get(`${API}/messages`, { headers })
      ]);
      setStats(statsRes.data);
      setAppointments(apptRes.data);
      setBlogs(blogRes.data);
      setMessages(msgRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, navigate, verifyAuth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/admin/logout`, {}, { headers: getAuthHeaders() });
    } catch {
      // Ignore errors
    }
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/appointments/${id}?status=${status}`, {}, { headers: getAuthHeaders() });
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
      fetchData();
    } catch (error) {
      toast.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await axios.delete(`${API}/appointments/${id}`, { headers: getAuthHeaders() });
      toast.success("এপয়েন্টমেন্ট মুছে ফেলা হয়েছে");
      fetchData();
    } catch (error) {
      toast.error("মুছতে ব্যর্থ হয়েছে");
    }
  };

  const createBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/blogs`, blogForm, { headers: getAuthHeaders() });
      toast.success("ব্লগ পোস্ট তৈরি হয়েছে");
      setShowBlogDialog(false);
      setBlogForm({ title: "", excerpt: "", content: "", image_url: "", category: "পোষা প্রাণীর যত্ন" });
      fetchData();
    } catch (error) {
      toast.error("ব্লগ তৈরি ব্যর্থ হয়েছে");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await axios.delete(`${API}/blogs/${id}`, { headers: getAuthHeaders() });
      toast.success("ব্লগ পোস্ট মুছে ফেলা হয়েছে");
      fetchData();
    } catch (error) {
      toast.error("মুছতে ব্যর্থ হয়েছে");
    }
  };

  const markMessageRead = async (id) => {
    try {
      await axios.patch(`${API}/messages/${id}/read`, {}, { headers: getAuthHeaders() });
      fetchData();
    } catch (error) {
      console.error("Error marking message read:", error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত?")) return;
    try {
      await axios.delete(`${API}/messages/${id}`, { headers: getAuthHeaders() });
      toast.success("মেসেজ মুছে ফেলা হয়েছে");
      fetchData();
    } catch (error) {
      toast.error("মুছতে ব্যর্থ হয়েছে");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      completed: "status-completed",
      cancelled: "status-cancelled"
    };
    const labels = {
      pending: "অপেক্ষমান",
      confirmed: "নিশ্চিত",
      completed: "সম্পন্ন",
      cancelled: "বাতিল"
    };
    return <span className={badges[status] || badges.pending}>{labels[status] || status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('bn-BD', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Logo" className="h-8 w-auto bg-white rounded p-0.5" />
          <span className="font-semibold text-sm">অ্যাডমিন প্যানেল</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar fixed top-0 left-0 h-full w-64 flex flex-col z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 lg:p-6 border-b border-slate-700">
          <img src={LOGO_URL} alt="Logo" className="h-10 lg:h-12 w-auto bg-white rounded-lg p-1" />
          <p className="text-white font-semibold mt-2 text-sm lg:text-base">অ্যাডমিন প্যানেল</p>
        </div>

        <nav className="flex-1 p-3 lg:p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleTabChange("appointments")}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors ${
              activeTab === "appointments" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
            data-testid="tab-appointments"
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span>এপয়েন্টমেন্ট</span>
            {stats?.pending_appointments > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.pending_appointments}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange("blogs")}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors ${
              activeTab === "blogs" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
            data-testid="tab-blogs"
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span>ব্লগ পোস্ট</span>
          </button>

          <button
            onClick={() => handleTabChange("messages")}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors ${
              activeTab === "messages" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
            data-testid="tab-messages"
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span>মেসেজ</span>
            {stats?.unread_messages > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.unread_messages}
              </span>
            )}
          </button>
        </nav>

        <div className="p-3 lg:p-4 border-t border-slate-700 space-y-2">
          <a 
            href="/" 
            className="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors text-sm lg:text-base"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span>ওয়েবসাইট দেখুন</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm lg:text-base"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pt-0 lg:ml-64 p-4 lg:p-8 min-h-screen">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <div className="stats-card p-3 lg:p-6" data-testid="stat-appointments">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs lg:text-sm">মোট এপয়েন্টমেন্ট</p>
                  <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.total_appointments}</p>
                </div>
                <Calendar className="w-6 h-6 lg:w-10 lg:h-10 text-sky-500" />
              </div>
            </div>
            <div className="stats-card p-3 lg:p-6" data-testid="stat-pending">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs lg:text-sm">অপেক্ষমান</p>
                  <p className="text-xl lg:text-3xl font-bold text-yellow-600">{stats.pending_appointments}</p>
                </div>
                <AlertCircle className="w-6 h-6 lg:w-10 lg:h-10 text-yellow-500" />
              </div>
            </div>
            <div className="stats-card p-3 lg:p-6" data-testid="stat-blogs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs lg:text-sm">ব্লগ পোস্ট</p>
                  <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.total_blogs}</p>
                </div>
                <FileText className="w-6 h-6 lg:w-10 lg:h-10 text-teal-500" />
              </div>
            </div>
            <div className="stats-card p-3 lg:p-6" data-testid="stat-messages">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs lg:text-sm">অপঠিত মেসেজ</p>
                  <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.unread_messages}</p>
                </div>
                <MessageSquare className="w-6 h-6 lg:w-10 lg:h-10 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
            {activeTab === "appointments" && "এপয়েন্টমেন্ট ব্যবস্থাপনা"}
            {activeTab === "blogs" && "ব্লগ পোস্ট ব্যবস্থাপনা"}
            {activeTab === "messages" && "মেসেজ"}
          </h1>
          <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={fetchData}
              className="rounded-full flex-1 sm:flex-none text-sm"
              data-testid="refresh-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              রিফ্রেশ
            </Button>
            {activeTab === "blogs" && (
              <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-sky-600 hover:bg-sky-700 rounded-full flex-1 sm:flex-none text-sm" data-testid="add-blog-button">
                    <Plus className="w-4 h-4 mr-2" />
                    নতুন ব্লগ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] lg:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>নতুন ব্লগ পোস্ট</DialogTitle>
                    <DialogDescription>ব্লগ পোস্টের তথ্য দিন</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={createBlog} className="space-y-4 mt-4" data-testid="blog-form">
                    <div>
                      <Label htmlFor="blog_title">শিরোনাম *</Label>
                      <Input
                        id="blog_title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog_excerpt">সংক্ষিপ্ত বিবরণ *</Label>
                      <Textarea
                        id="blog_excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                        required
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog_content">বিস্তারিত *</Label>
                      <Textarea
                        id="blog_content"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        required
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="blog_image">ছবির URL (ঐচ্ছিক)</Label>
                        <Input
                          id="blog_image"
                          value={blogForm.image_url}
                          onChange={(e) => setBlogForm({...blogForm, image_url: e.target.value})}
                          placeholder="https://..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blog_category">ক্যাটাগরি</Label>
                        <Select
                          value={blogForm.category}
                          onValueChange={(value) => setBlogForm({...blogForm, category: value})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="পোষা প্রাণীর যত্ন">পোষা প্রাণীর যত্ন</SelectItem>
                            <SelectItem value="কুকুরের যত্ন">কুকুরের যত্ন</SelectItem>
                            <SelectItem value="বিড়ালের যত্ন">বিড়ালের যত্ন</SelectItem>
                            <SelectItem value="সাধারণ টিপস">সাধারণ টিপস</SelectItem>
                            <SelectItem value="স্বাস্থ্য">স্বাস্থ্য</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                      পোস্ট করুন
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="appointments-table">
            {appointments.length === 0 ? (
              <div className="p-8 lg:p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">কোনো এপয়েন্টমেন্ট নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 p-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{apt.pet_name}</p>
                          <p className="text-sm text-slate-500">{apt.pet_type}</p>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="text-sm space-y-1">
                        <p><span className="text-slate-500">মালিক:</span> {apt.owner_name}</p>
                        <p><span className="text-slate-500">ফোন:</span> {apt.phone}</p>
                        <p><span className="text-slate-500">সেবা:</span> {apt.service}</p>
                        <p><span className="text-slate-500">তারিখ:</span> {apt.preferred_date}</p>
                        <p><span className="text-slate-500">সময়:</span> {apt.preferred_time}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <Select
                          value={apt.status}
                          onValueChange={(value) => updateAppointmentStatus(apt.id, value)}
                        >
                          <SelectTrigger className="flex-1 h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">অপেক্ষমান</SelectItem>
                            <SelectItem value="confirmed">নিশ্চিত</SelectItem>
                            <SelectItem value="completed">সম্পন্ন</SelectItem>
                            <SelectItem value="cancelled">বাতিল</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAppointment(apt.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="admin-table hidden lg:table">
                  <thead>
                    <tr>
                      <th>তারিখ</th>
                      <th>পোষা প্রাণী</th>
                      <th>মালিক</th>
                      <th>সেবা</th>
                      <th>সময়</th>
                      <th>স্ট্যাটাস</th>
                      <th>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>{apt.preferred_date}</td>
                        <td>
                          <div>
                            <p className="font-medium">{apt.pet_name}</p>
                            <p className="text-sm text-slate-500">{apt.pet_type}</p>
                          </div>
                        </td>
                        <td>
                          <div>
                            <p className="font-medium">{apt.owner_name}</p>
                            <p className="text-sm text-slate-500">{apt.phone}</p>
                          </div>
                        </td>
                        <td>{apt.service}</td>
                        <td>{apt.preferred_time}</td>
                        <td>{getStatusBadge(apt.status)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Select
                              value={apt.status}
                              onValueChange={(value) => updateAppointmentStatus(apt.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">অপেক্ষমান</SelectItem>
                                <SelectItem value="confirmed">নিশ্চিত</SelectItem>
                                <SelectItem value="completed">সম্পন্ন</SelectItem>
                                <SelectItem value="cancelled">বাতিল</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAppointment(apt.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="blogs-table">
            {blogs.length === 0 ? (
              <div className="p-8 lg:p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">কোনো ব্লগ পোস্ট নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 p-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 line-clamp-2">{blog.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full">
                              {blog.category}
                            </span>
                            <span className="text-xs text-slate-500">{formatDate(blog.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBlog(blog.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="admin-table hidden lg:table">
                  <thead>
                    <tr>
                      <th>শিরোনাম</th>
                      <th>ক্যাটাগরি</th>
                      <th>তারিখ</th>
                      <th>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td>
                          <p className="font-medium line-clamp-1">{blog.title}</p>
                        </td>
                        <td>
                          <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full">
                            {blog.category}
                          </span>
                        </td>
                        <td>{formatDate(blog.created_at)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <a href={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBlog(blog.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-4" data-testid="messages-list">
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">কোনো মেসেজ নেই</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`bg-white rounded-2xl shadow-sm border p-4 lg:p-6 ${
                    !msg.read ? "border-sky-200 bg-sky-50/50" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{msg.name}</h3>
                        {!msg.read && (
                          <span className="px-2 py-0.5 bg-sky-500 text-white text-xs rounded-full">নতুন</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-slate-500 mb-3">
                        <span>{msg.phone}</span>
                        {msg.email && <span className="hidden sm:inline">{msg.email}</span>}
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="text-slate-700 text-sm lg:text-base">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      {!msg.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markMessageRead(msg.id)}
                          className="text-sky-600"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMessage(msg.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
