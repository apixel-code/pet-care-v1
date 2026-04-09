import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API}/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError("ব্লগ পোস্ট পাওয়া যায়নি।");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <span className="ml-2 text-slate-600">লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-32 text-center px-4">
          <p className="text-slate-600 text-lg mb-4">{error || "ব্লগ পোস্ট পাওয়া যায়নি।"}</p>
          <Link to="/blog">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ব্লগে ফিরে যান
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <article className="pt-24 md:pt-32 pb-16" data-testid="blog-detail">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/blog">
              <Button variant="ghost" className="text-slate-600 hover:text-sky-600" data-testid="back-to-blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ব্লগে ফিরে যান
              </Button>
            </Link>
          </motion.div>

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Featured Image */}
            {blog.image_url && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img 
                  src={blog.image_url} 
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                  data-testid="blog-featured-image"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-700 text-sm font-medium rounded-full">
                {blog.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.created_at)}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6" data-testid="blog-title">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-slate-600 mb-8 leading-relaxed border-l-4 border-sky-500 pl-4">
              {blog.excerpt}
            </p>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
              data-testid="blog-content"
            >
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 p-8 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl text-center"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              আপনার পোষা প্রাণীর স্বাস্থ্য নিয়ে উদ্বিগ্ন?
            </h3>
            <p className="text-slate-600 mb-6">
              আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে এখনই পরামর্শ করুন।
            </p>
            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8"
                data-testid="blog-detail-cta"
              >
                এপয়েন্টমেন্ট নিন
              </Button>
            </Link>
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
