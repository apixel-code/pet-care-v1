import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, Clock, Heart, Stethoscope, Shield, 
  Syringe, Scissors, Activity, ArrowRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HERO_IMAGE = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxoYXBweSUyMGhlYWx0aHklMjBkb2clMjBhbmQlMjBjYXR8ZW58MHx8fHwxNzc1NzQ3MzU3fDA&ixlib=rb-4.1.0&q=85";
const VET_IMAGE = "https://images.unsplash.com/photo-1700665537604-412e89a285c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHx2ZXRlcmluYXJpYW4lMjB3aXRoJTIwZG9nJTIwb3IlMjBjYXQlMjBjbGluaWN8ZW58MHx8fHwxNzc1NzQ3MzU3fDA&ixlib=rb-4.1.0&q=85";

const whyUsItems = [
  {
    icon: Clock,
    title: "২৪/৭ জরুরি সেবা",
    description: "রাত-দিন যেকোনো সময় আপনার পাশে। জরুরি অবস্থায় এক ফোনেই আমরা হাজির।"
  },
  {
    icon: Stethoscope,
    title: "অভিজ্ঞ ডাক্তার",
    description: "দক্ষ ও প্রশিক্ষিত পশু চিকিৎসকদের দ্বারা আধুনিক চিকিৎসা সেবা।"
  },
  {
    icon: Heart,
    title: "মমতাময় পরিচর্যা",
    description: "আপনার পোষা প্রাণীকে আমরা পরিবারের সদস্যের মতোই ভালোবাসা দিয়ে যত্ন নিই।"
  }
];

const services = [
  {
    icon: Stethoscope,
    title: "সাধারণ চেকআপ",
    description: "নিয়মিত স্বাস্থ্য পরীক্ষা আপনার প্রিয় বন্ধুটিকে রোগের হাত থেকে বাঁচায়।"
  },
  {
    icon: Syringe,
    title: "টিকাদান",
    description: "মারাত্মক রোগ থেকে সুরক্ষা। জলাতঙ্ক, পারভো সহ সকল প্রয়োজনীয় টিকা।"
  },
  {
    icon: Scissors,
    title: "সার্জারি",
    description: "আধুনিক অপারেশন থিয়েটারে নিরাপদ ও সফল সার্জারি।"
  },
  {
    icon: Activity,
    title: "জরুরি চিকিৎসা",
    description: "দুর্ঘটনা বা হঠাৎ অসুস্থতায় তাৎক্ষণিক চিকিৎসা সেবা।"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-bg pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                সাভারের বিশ্বস্ত পেট ক্লিনিক
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6" data-testid="hero-title">
                আপনার আদরের পোষা প্রাণীটি কি{" "}
                <span className="text-sky-600">অসুস্থ?</span>
                <br />
                <span className="text-teal-600">আমরা আছি তো!</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-auto" data-testid="hero-subtitle">
                সাভারের বুকে একমাত্র আধুনিক ও বিশ্বস্ত পেট ক্লিনিক, যেখানে আপনার আদরের বন্ধুটি পাবে পরিবারের মতোই মমতা ও সেরা চিকিৎসা।
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8 py-6 text-lg btn-hover w-full sm:w-auto"
                    data-testid="hero-cta-button"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    এপয়েন্টমেন্ট বুক করুন
                  </Button>
                </Link>
                <a href="tel:+8801797993951">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 rounded-full px-8 py-6 text-lg w-full sm:w-auto"
                    data-testid="hero-call-button"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    এখনই কল করুন
                  </Button>
                </a>
              </div>
              
              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-slate-600 text-sm">৫০০+ সন্তুষ্ট পোষা প্রাণীর মালিক</span>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={HERO_IMAGE} 
                  alt="সুখী কুকুর এবং বিড়াল" 
                  className="w-full h-auto object-cover"
                  data-testid="hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">২৪/৭</p>
                    <p className="text-sm text-slate-500">জরুরি সেবা</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 md:py-24 bg-white" data-testid="why-us-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" data-testid="why-us-title">
              কেন আমাদের বেছে নেবেন?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              আপনার পোষা প্রাণীর জন্য সেরা যত্ন নিশ্চিত করতে আমরা প্রতিশ্রুতিবদ্ধ
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {whyUsItems.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-slate-50 rounded-2xl p-8 card-hover border border-slate-100"
                data-testid={`why-us-card-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24 bg-slate-50" data-testid="services-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img 
                src={VET_IMAGE} 
                alt="পশু চিকিৎসক কুকুরের যত্ন নিচ্ছেন" 
                className="rounded-3xl shadow-xl w-full"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6" data-testid="services-title">
                আমাদের সেবাসমূহ
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                আপনার পোষা প্রাণীর সুস্থতা আমাদের প্রথম অগ্রাধিকার। আধুনিক সরঞ্জাম ও দক্ষ চিকিৎসকদের মাধ্যমে আমরা সম্পূর্ণ পরিসেবা প্রদান করি।
              </p>
              
              <div className="space-y-4 mb-8">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100"
                    data-testid={`service-item-${index}`}
                  >
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{service.title}</h3>
                      <p className="text-sm text-slate-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/services">
                <Button 
                  className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6"
                  data-testid="view-all-services-button"
                >
                  সকল সেবা দেখুন
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-sky-600 to-teal-600" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              আপনার পোষা প্রাণীর সুস্থতা নিয়ে চিন্তিত?
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              আর দেরি নয়! এখনই এপয়েন্টমেন্ট নিন এবং আপনার প্রিয় বন্ধুটিকে সেরা যত্ন দিন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg"
                  className="bg-white text-sky-600 hover:bg-sky-50 rounded-full px-8 py-6 text-lg font-semibold"
                  data-testid="cta-book-button"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  এপয়েন্টমেন্ট বুক করুন
                </Button>
              </Link>
              <a href="tel:+8801797993951">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
                  data-testid="cta-call-button"
                >
                  +880 1797-993951
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      {/* Floating CTA Button (Mobile) */}
      <div className="floating-cta md:hidden">
        <a href="tel:+8801797993951">
          <Button 
            size="lg"
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg px-6"
            data-testid="floating-cta"
          >
            <Phone className="w-5 h-5 mr-2" />
            কল করুন
          </Button>
        </a>
      </div>
    </div>
  );
};

export default HomePage;
