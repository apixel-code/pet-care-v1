import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Stethoscope, Syringe, Scissors, Activity, 
  HeartPulse, Bone, Eye, Droplets, Phone, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Stethoscope,
    title: "সাধারণ চেকআপ",
    description: "আপনার পোষা প্রাণীর নিয়মিত স্বাস্থ্য পরীক্ষা করান। প্রাথমিক অবস্থায় রোগ নির্ণয় করে আপনার বন্ধুটিকে সুস্থ রাখুন। আমাদের অভিজ্ঞ ডাক্তাররা সম্পূর্ণ শারীরিক পরীক্ষা করে আপনাকে বিস্তারিত রিপোর্ট দেবেন।",
    benefits: ["সম্পূর্ণ শারীরিক পরীক্ষা", "রক্ত পরীক্ষা", "ওজন মনিটরিং", "পরামর্শ সেবা"]
  },
  {
    icon: Syringe,
    title: "টিকাদান কর্মসূচি",
    description: "জলাতঙ্ক, পারভো, ডিস্টেম্পার সহ সকল প্রয়োজনীয় টিকা। টিকা আপনার পোষা প্রাণীকে মারাত্মক রোগ থেকে রক্ষা করে। আমরা বয়স অনুযায়ী সঠিক টিকাসূচি অনুসরণ করি।",
    benefits: ["জলাতঙ্ক টিকা", "পারভো ভ্যাকসিন", "ডিস্টেম্পার", "বার্ষিক বুস্টার"]
  },
  {
    icon: Scissors,
    title: "সার্জারি সেবা",
    description: "আধুনিক অপারেশন থিয়েটারে নিরাপদ ও সফল সার্জারি। স্পে/নিউটার থেকে শুরু করে জটিল অপারেশন পর্যন্ত সব ধরনের সার্জিক্যাল সেবা প্রদান করি।",
    benefits: ["স্পে/নিউটার", "টিউমার অপসারণ", "ফ্র্যাকচার সার্জারি", "সি-সেকশন"]
  },
  {
    icon: Activity,
    title: "জরুরি চিকিৎসা",
    description: "২৪/৭ জরুরি সেবা। দুর্ঘটনা বা হঠাৎ অসুস্থতায় এক ফোনেই আমরা আপনার পাশে। রাত-দিন যেকোনো সময় আপনার পোষা প্রাণীর জরুরি চিকিৎসা নিশ্চিত করি।",
    benefits: ["২৪/৭ উপলব্ধ", "দুর্ঘটনা চিকিৎসা", "বিষক্রিয়া", "শ্বাসকষ্ট"]
  },
  {
    icon: HeartPulse,
    title: "কার্ডিওলজি",
    description: "হৃদরোগ নির্ণয় ও চিকিৎসা। ECG, আল্ট্রাসাউন্ড সহ আধুনিক পরীক্ষার মাধ্যমে আপনার পোষা প্রাণীর হৃদযন্ত্রের সমস্যা সনাক্ত করি।",
    benefits: ["ECG পরীক্ষা", "আল্ট্রাসাউন্ড", "হার্ট মনিটরিং", "ওষুধ ব্যবস্থাপনা"]
  },
  {
    icon: Bone,
    title: "অর্থোপেডিক্স",
    description: "হাড় ও জয়েন্টের সমস্যার চিকিৎসা। ফ্র্যাকচার, আর্থ্রাইটিস, লিগামেন্ট ইনজুরি সহ সকল অর্থোপেডিক সমস্যার সমাধান।",
    benefits: ["ফ্র্যাকচার চিকিৎসা", "আর্থ্রাইটিস", "ফিজিওথেরাপি", "জয়েন্ট সার্জারি"]
  },
  {
    icon: Eye,
    title: "চক্ষু চিকিৎসা",
    description: "চোখের বিভিন্ন সমস্যার নির্ণয় ও চিকিৎসা। ছানি, গ্লুকোমা, কর্নিয়া আলসার সহ সকল চক্ষু রোগের সেবা।",
    benefits: ["চোখ পরীক্ষা", "ছানি অপারেশন", "গ্লুকোমা চিকিৎসা", "কর্নিয়া চিকিৎসা"]
  },
  {
    icon: Droplets,
    title: "ডেন্টাল কেয়ার",
    description: "দাঁত ও মাড়ির যত্ন। পেশাদার দাঁত পরিষ্কার, দাঁত তোলা এবং মাড়ির রোগের চিকিৎসা। সুস্থ দাঁত সুস্থ জীবনের চাবিকাঠি।",
    benefits: ["দাঁত পরিষ্কার", "দাঁত তোলা", "মাড়ির চিকিৎসা", "ডেন্টাল এক্স-রে"]
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-bg pt-24 md:pt-32 pb-16" data-testid="services-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6" data-testid="services-page-title">
              আমাদের <span className="text-sky-600">সেবাসমূহ</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              আপনার পোষা প্রাণীর সম্পূর্ণ স্বাস্থ্য সেবা এক ছাদের নিচে। আধুনিক প্রযুক্তি ও দক্ষ চিকিৎসক দল নিয়ে আমরা প্রস্তুত।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24" data-testid="services-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 card-hover"
                data-testid={`service-card-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                
                <div className="space-y-2">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white" data-testid="services-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              আপনার পোষা প্রাণীর জন্য সেরা যত্ন দিতে চান?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              আজই এপয়েন্টমেন্ট নিন এবং আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে পরামর্শ করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg"
                  className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8 py-6 text-lg btn-hover"
                  data-testid="services-book-button"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  এপয়েন্টমেন্ট বুক করুন
                </Button>
              </Link>
              <a href="tel:+8801797993951">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 rounded-full px-8 py-6 text-lg"
                  data-testid="services-call-button"
                >
                  এখনই কল করুন
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
