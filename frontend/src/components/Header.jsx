import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_1f657fef-67dc-4bd6-b745-98b3a70b1384/artifacts/v2gm9yua_image.png";

const navLinks = [
  { name: "হোম", path: "/" },
  { name: "সেবাসমূহ", path: "/services" },
  { name: "ব্লগ", path: "/blog" },
  { name: "যোগাযোগ", path: "/contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="header-logo">
            <img src={LOGO_URL} alt="Supreme Pet Clinic" className="h-12 md:h-14 w-auto" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-sky-600">সুপ্রীম পেট ক্লিনিক</p>
              <p className="text-xs text-slate-500">Supreme Pet Clinic</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-sky-600"
                    : "text-slate-600 hover:text-sky-600"
                }`}
                data-testid={`nav-link-${link.path.replace("/", "") || "home"}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hidden sm:block">
              <Button 
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6 btn-hover"
                data-testid="header-cta-button"
              >
                <Phone className="w-4 h-4 mr-2" />
                এপয়েন্টমেন্ট বুক করুন
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in" data-testid="mobile-menu">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${link.path.replace("/", "") || "home"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button 
                className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-full mt-4"
                data-testid="mobile-cta-button"
              >
                <Phone className="w-4 h-4 mr-2" />
                এপয়েন্টমেন্ট বুক করুন
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
