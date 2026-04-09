import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Heart, MessageCircle } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_1f657fef-67dc-4bd6-b745-98b3a70b1384/artifacts/v2gm9yua_image.png";

export const Footer = () => {
  return (
    <footer className="footer-bg text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="Supreme Pet Clinic" className="h-16 w-auto bg-white rounded-lg p-1" />
              <div>
                <h3 className="text-xl font-bold">সুপ্রীম পেট ক্লিনিক</h3>
                <p className="text-slate-400 text-sm">Supreme Pet Clinic</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              সাভারের সবচেয়ে বিশ্বস্ত পেট ক্লিনিক। আমরা আপনার পোষা প্রাণীকে পরিবারের সদস্য মনে করি এবং তাদের সেরা যত্ন প্রদান করি।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-300 hover:text-sky-400 transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-sky-400 transition-colors">
                  সেবাসমূহ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-sky-400 transition-colors">
                  ব্লগ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-sky-400 transition-colors">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">যোগাযোগ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+8801797993951" className="text-slate-300 hover:text-sky-400 block">
                    +880 1797-993951
                  </a>
                  <a href="tel:+8801738139977" className="text-slate-300 hover:text-sky-400 block">
                    +880 1738-139977
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">সাভার, ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">২৪/৭ সেবা উপলব্ধ</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <a 
                  href="https://wa.me/8801797993951?text=আসসালামু আলাইকুম, আমি সুপ্রীম পেট ক্লিনিকে এপয়েন্টমেন্ট নিতে চাই।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-green-400 transition-colors"
                >
                  WhatsApp এ মেসেজ করুন
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} সুপ্রীম পেট ক্লিনিক। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            তৈরি করা হয়েছে <Heart className="w-4 h-4 text-red-500" /> দিয়ে পোষা প্রাণী প্রেমীদের জন্য
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
