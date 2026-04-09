import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, MapPin, Clock, Send, CheckCircle, 
  AlertCircle, Loader2, Calendar
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const services = [
  "সাধারণ চেকআপ",
  "টিকাদান",
  "সার্জারি",
  "জরুরি চিকিৎসা",
  "ডেন্টাল কেয়ার",
  "কার্ডিওলজি",
  "অর্থোপেডিক্স",
  "চক্ষু চিকিৎসা",
  "অন্যান্য"
];

const petTypes = [
  "কুকুর",
  "বিড়াল",
  "পাখি",
  "খরগোশ",
  "অন্যান্য"
];

const timeSlots = [
  "সকাল ৯:০০ - ১০:০০",
  "সকাল ১০:০০ - ১১:০০",
  "সকাল ১১:০০ - ১২:০০",
  "দুপুর ১২:০০ - ১:০০",
  "দুপুর ২:০০ - ৩:০০",
  "বিকাল ৩:০০ - ৪:০০",
  "বিকাল ৪:০০ - ৫:০০",
  "বিকাল ৫:০০ - ৬:০০",
  "সন্ধ্যা ৬:০০ - ৭:০০",
  "রাত ৭:০০ - ৮:০০"
];

const ContactPage = () => {
  const [formType, setFormType] = useState("appointment"); // appointment or message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    pet_name: "",
    pet_type: "",
    owner_name: "",
    phone: "",
    service: "",
    preferred_date: "",
    preferred_time: "",
    notes: ""
  });

  // Message form state
  const [messageForm, setMessageForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/appointments`, appointmentForm);
      toast.success("এপয়েন্টমেন্ট সফলভাবে বুক হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।");
      setAppointmentForm({
        pet_name: "",
        pet_type: "",
        owner_name: "",
        phone: "",
        service: "",
        preferred_date: "",
        preferred_time: "",
        notes: ""
      });
      // Redirect to home page after success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error("দুঃখিত, কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/messages`, messageForm);
      toast.success("আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!");
      setMessageForm({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
    } catch (error) {
      toast.error("দুঃখিত, কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-bg pt-24 md:pt-32 pb-16" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6" data-testid="contact-page-title">
              <span className="text-sky-600">যোগাযোগ</span> করুন
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              আপনার পোষা প্রাণীর যেকোনো সমস্যায় আমরা আছি আপনার পাশে। এখনই এপয়েন্টমেন্ট নিন অথবা মেসেজ পাঠান।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">যোগাযোগের তথ্য</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4" data-testid="contact-phone">
                  <div className="contact-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">ফোন নম্বর</h3>
                    <a href="tel:+8801797993951" className="text-slate-600 hover:text-sky-600 block">
                      +880 1797-993951
                    </a>
                    <a href="tel:+8801738139977" className="text-slate-600 hover:text-sky-600 block">
                      +880 1738-139977
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-address">
                  <div className="contact-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">ঠিকানা</h3>
                    <p className="text-slate-600">সাভার, ঢাকা, বাংলাদেশ</p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-hours">
                  <div className="contact-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">সেবার সময়</h3>
                    <p className="text-slate-600">২৪/৭ জরুরি সেবা উপলব্ধ</p>
                    <p className="text-slate-600">সাধারণ সেবা: সকাল ৯টা - রাত ৮টা</p>
                  </div>
                </div>
              </div>

              {/* Emergency Notice */}
              <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-700 mb-1">জরুরি অবস্থায়?</h3>
                    <p className="text-sm text-red-600">
                      এখনই কল করুন: <a href="tel:+8801797993951" className="font-bold underline">+880 1797-993951</a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {/* Form Type Toggle */}
              <div className="flex gap-2 mb-8 p-1 bg-slate-100 rounded-full w-fit" data-testid="form-toggle">
                <button
                  onClick={() => setFormType("appointment")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    formType === "appointment" 
                      ? "bg-sky-600 text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  data-testid="toggle-appointment"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  এপয়েন্টমেন্ট বুক
                </button>
                <button
                  onClick={() => setFormType("message")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    formType === "message" 
                      ? "bg-sky-600 text-white" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  data-testid="toggle-message"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  মেসেজ পাঠান
                </button>
              </div>

              {/* Appointment Form */}
              {formType === "appointment" && (
                <form onSubmit={handleAppointmentSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100" data-testid="appointment-form">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">এপয়েন্টমেন্ট বুক করুন</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pet_name">পোষা প্রাণীর নাম *</Label>
                      <Input
                        id="pet_name"
                        value={appointmentForm.pet_name}
                        onChange={(e) => setAppointmentForm({...appointmentForm, pet_name: e.target.value})}
                        placeholder="যেমন: টমি"
                        required
                        className="mt-1"
                        data-testid="input-pet-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pet_type">পোষা প্রাণীর ধরন *</Label>
                      <Select
                        value={appointmentForm.pet_type}
                        onValueChange={(value) => setAppointmentForm({...appointmentForm, pet_type: value})}
                        required
                      >
                        <SelectTrigger className="mt-1" data-testid="select-pet-type">
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {petTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="owner_name">আপনার নাম *</Label>
                      <Input
                        id="owner_name"
                        value={appointmentForm.owner_name}
                        onChange={(e) => setAppointmentForm({...appointmentForm, owner_name: e.target.value})}
                        placeholder="আপনার পূর্ণ নাম"
                        required
                        className="mt-1"
                        data-testid="input-owner-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">ফোন নম্বর *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={appointmentForm.phone}
                        onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                        placeholder="01XXX-XXXXXX"
                        required
                        className="mt-1"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="service">সেবার ধরন *</Label>
                      <Select
                        value={appointmentForm.service}
                        onValueChange={(value) => setAppointmentForm({...appointmentForm, service: value})}
                        required
                      >
                        <SelectTrigger className="mt-1" data-testid="select-service">
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="preferred_date">পছন্দের তারিখ *</Label>
                      <Input
                        id="preferred_date"
                        type="date"
                        value={appointmentForm.preferred_date}
                        onChange={(e) => setAppointmentForm({...appointmentForm, preferred_date: e.target.value})}
                        required
                        className="mt-1"
                        min={new Date().toISOString().split('T')[0]}
                        data-testid="input-date"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="preferred_time">পছন্দের সময় *</Label>
                      <Select
                        value={appointmentForm.preferred_time}
                        onValueChange={(value) => setAppointmentForm({...appointmentForm, preferred_time: value})}
                        required
                      >
                        <SelectTrigger className="mt-1" data-testid="select-time">
                          <SelectValue placeholder="সময় নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="notes">অতিরিক্ত তথ্য (ঐচ্ছিক)</Label>
                      <Textarea
                        id="notes"
                        value={appointmentForm.notes}
                        onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                        placeholder="আপনার পোষা প্রাণীর সমস্যা সম্পর্কে বিস্তারিত লিখুন..."
                        className="mt-1"
                        rows={4}
                        data-testid="input-notes"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-sky-600 hover:bg-sky-700 text-white rounded-full py-6 text-lg btn-hover"
                    data-testid="submit-appointment"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        প্রসেস হচ্ছে...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        এপয়েন্টমেন্ট বুক করুন
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Message Form */}
              {formType === "message" && (
                <form onSubmit={handleMessageSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100" data-testid="message-form">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">মেসেজ পাঠান</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="msg_name">আপনার নাম *</Label>
                      <Input
                        id="msg_name"
                        value={messageForm.name}
                        onChange={(e) => setMessageForm({...messageForm, name: e.target.value})}
                        placeholder="আপনার পূর্ণ নাম"
                        required
                        className="mt-1"
                        data-testid="input-msg-name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="msg_phone">ফোন নম্বর *</Label>
                        <Input
                          id="msg_phone"
                          type="tel"
                          value={messageForm.phone}
                          onChange={(e) => setMessageForm({...messageForm, phone: e.target.value})}
                          placeholder="01XXX-XXXXXX"
                          required
                          className="mt-1"
                          data-testid="input-msg-phone"
                        />
                      </div>

                      <div>
                        <Label htmlFor="msg_email">ইমেইল (ঐচ্ছিক)</Label>
                        <Input
                          id="msg_email"
                          type="email"
                          value={messageForm.email}
                          onChange={(e) => setMessageForm({...messageForm, email: e.target.value})}
                          placeholder="example@email.com"
                          className="mt-1"
                          data-testid="input-msg-email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="msg_message">আপনার মেসেজ *</Label>
                      <Textarea
                        id="msg_message"
                        value={messageForm.message}
                        onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                        placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
                        required
                        className="mt-1"
                        rows={6}
                        data-testid="input-msg-message"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-sky-600 hover:bg-sky-700 text-white rounded-full py-6 text-lg btn-hover"
                    data-testid="submit-message"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        মেসেজ পাঠান
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
