import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, FileText, MessageSquare, LogOut, 
  Home, Loader2, Plus, Trash2, Eye, Check, X,
  ChevronDown, RefreshCw, AlertCircle
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 min-h-screen flex flex-col fixed left-0 top-0">
        <div className="p-6 border-b border-slate-700">
          <img src={LOGO_URL} alt="Logo" className="h-12 w-auto bg-white rounded-lg p-1" />
          <p className="text-white font-semibold mt-2">অ্যাডমিন প্যানেল</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
              activeTab === "appointments" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
            data-testid="tab-appointments"
          >
            <Calendar className="w-5 h-5" />
            এপয়েন্টমেন্ট
            {stats?.pending_appointments > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.pending_appointments}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("blogs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
              activeTab === "blogs" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
            data-testid="tab-blogs"
          >
            <FileText className="w-5 h-5" />
            ব্লগ পোস্ট
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
              activeTab === "messages" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
            data-testid="tab-messages"
          >
            <MessageSquare className="w-5 h-5" />
            মেসেজ
            {stats?.unread_messages > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.unread_messages}
              </span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <a 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            ওয়েবসাইট দেখুন
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stats-card" data-testid="stat-appointments">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">মোট এপয়েন্টমেন্ট</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_appointments}</p>
                </div>
                <Calendar className="w-10 h-10 text-sky-500" />
              </div>
            </div>
            <div className="stats-card" data-testid="stat-pending">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">অপেক্ষমান</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending_appointments}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              </div>
            </div>
            <div className="stats-card" data-testid="stat-blogs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">ব্লগ পোস্ট</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_blogs}</p>
                </div>
                <FileText className="w-10 h-10 text-teal-500" />
              </div>
            </div>
            <div className="stats-card" data-testid="stat-messages">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">অপঠিত মেসেজ</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.unread_messages}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {activeTab === "appointments" && "এপয়েন্টমেন্ট ব্যবস্থাপনা"}
            {activeTab === "blogs" && "ব্লগ পোস্ট ব্যবস্থাপনা"}
            {activeTab === "messages" && "মেসেজ"}
          </h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={fetchData}
              className="rounded-full"
              data-testid="refresh-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              রিফ্রেশ
            </Button>
            {activeTab === "blogs" && (
              <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-sky-600 hover:bg-sky-700 rounded-full" data-testid="add-blog-button">
                    <Plus className="w-4 h-4 mr-2" />
                    নতুন ব্লগ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
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
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">কোনো এপয়েন্টমেন্ট নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
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
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">কোনো ব্লগ পোস্ট নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">কোনো মেসেজ নেই</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`bg-white rounded-2xl shadow-sm border p-6 ${
                    !msg.read ? "border-sky-200 bg-sky-50/50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{msg.name}</h3>
                        {!msg.read && (
                          <span className="px-2 py-0.5 bg-sky-500 text-white text-xs rounded-full">নতুন</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <span>{msg.phone}</span>
                        {msg.email && <span>{msg.email}</span>}
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="text-slate-700">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
