import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API}/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-bg pt-24 md:pt-32 pb-16" data-testid="blog-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6" data-testid="blog-page-title">
              পোষা প্রাণীর যত্নে <span className="text-sky-600">টিপস</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              আপনার পোষা প্রাণীকে সুস্থ ও সুখী রাখতে আমাদের বিশেষজ্ঞদের পরামর্শ ও টিপস পড়ুন।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24" data-testid="blog-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              <span className="ml-2 text-slate-600">লোড হচ্ছে...</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">কোনো ব্লগ পোস্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 card-hover blog-card"
                  data-testid={`blog-card-${index}`}
                >
                  <div className="overflow-hidden">
                    <img 
                      src={blog.image_url || "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800"} 
                      alt={blog.title}
                      className="w-full h-48 object-cover blog-image"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.created_at)}
                    </div>
                    
                    <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full mb-3">
                      {blog.category}
                    </span>
                    
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    
                    <Link to={`/blog/${blog.id}`}>
                      <Button 
                        variant="link" 
                        className="text-sky-600 hover:text-sky-700 p-0 h-auto font-semibold"
                        data-testid={`read-more-${blog.id}`}
                      >
                        বিস্তারিত পড়ুন
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-white" data-testid="blog-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              পোষা প্রাণী নিয়ে প্রশ্ন আছে?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে কথা বলুন। আপনার পোষা প্রাণীর যেকোনো সমস্যায় আমরা আছি আপনার পাশে।
            </p>
            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8 py-6 text-lg btn-hover"
                data-testid="blog-contact-button"
              >
                পরামর্শ নিন
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
