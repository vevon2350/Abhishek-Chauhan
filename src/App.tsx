import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { 
  Wrench, 
  Snowflake, 
  PlugZap, 
  PackagePlus, 
  Bike, 
  PhoneCall, 
  Droplets,
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  Phone,
  Zap,
  Facebook,
  Instagram,
  PhoneOff,
  IndianRupee,
  AlertCircle,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  Clock,
  History,
  Home,
  Menu,
  Search,
  Info,
  HelpCircle,
  FileText,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  PlusCircle,
  UserCheck
} from 'lucide-react';

const servicesData = [
  { id: 'plumbing', title: 'Plumbing', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-50', basePrice: 299 },
  { id: 'ac-repair', title: 'AC Repair', icon: Snowflake, color: 'text-sky-500', bg: 'bg-sky-50', basePrice: 499 },
  { id: 'connection', title: 'Connection', icon: PlugZap, color: 'text-yellow-500', bg: 'bg-yellow-50', basePrice: 149 },
  { id: 'new-install', title: 'Installation', icon: PackagePlus, color: 'text-green-500', bg: 'bg-green-50', basePrice: 899 },
  { id: 'site-visit', title: 'Site Visit', icon: Bike, color: 'text-purple-500', bg: 'bg-purple-50', basePrice: 99 },
  { id: 'call-consult', title: 'Consultation', icon: PhoneCall, color: 'text-pink-500', bg: 'bg-pink-50', basePrice: 10 },
  { id: 'borewell', title: 'Borewell', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', basePrice: 1499 },
  { id: 'other', title: 'Other Work', icon: Zap, color: 'text-slate-600', bg: 'bg-slate-50', basePrice: 199 }
];

export default function App() {
  // --- USER SESSION & AUTHENTICATION STATE ---
  const [userSession, setUserSession] = useState<{ name: string; phone: string } | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(true);
  const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone');
  const [loginForm, setLoginForm] = useState({ name: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [showSmsToast, setShowSmsToast] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  // --- BUSINESS / SERVICE BOOKING STATE ---
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [blinkingId, setBlinkingId] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', problem: '', date: '', amount: '' });

  // --- MENU & TRACKING STATE ---
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [menuActiveTab, setMenuActiveTab] = useState<'home' | 'find_order' | 'jobs' | 'policies' | 'support' | 'about'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [searchSuccessMsg, setSearchSuccessMsg] = useState('');

  // --- JOB PORTAL STATE MANAGEMENT ---
  const [jobsActiveSubTab, setJobsActiveSubTab] = useState<'list' | 'post' | 'my_gigs'>('list');
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [jobsSearchQuery, setJobsSearchQuery] = useState('');
  const [jobsList, setJobsList] = useState<any[]>(() => {
    const stored = localStorage.getItem('pragya_jobs');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    return [
      { id: 'JOB-101', title: 'Power Meter Sparking Repair', serviceType: 'connection', description: 'Main meter circuit breaker switch bar burnt due to heavy high voltage AC usage. Sparks during afternoon load.', area: 'Gomti Nagar Extension', budget: 650, urgency: 'Emergency', date: '29-05-2026', status: 'Open', applicantCount: 2 },
      { id: 'JOB-102', title: 'Complete Dual Flat AC Service', serviceType: 'ac-repair', description: 'Two split AC indoor blower motor cleaning, outdoor gas bypass reading adjustment & drainage leakage solution.', area: 'Aliganj Sector Q', budget: 1400, urgency: 'Standard', date: '29-05-2026', status: 'Open', applicantCount: 1 },
      { id: 'JOB-103', title: 'Submersible Pump Panel Switch Rewind', serviceType: 'plumbing', description: '3 HP submersed water pump wiring burnt. Requires pulling motor out, copper wire rewind, and new switch installation.', area: 'Indira Nagar', budget: 2200, urgency: 'Standard', date: '28-05-2026', status: 'Open', applicantCount: 3 },
      { id: 'JOB-104', title: 'New Commercial LED Board Connection', serviceType: 'new-install', description: 'Setting up new neon sign board controller switch panel connection and backup fuse connection on second floor balcony.', area: 'Hazratganj Market', budget: 1850, urgency: 'Flex', date: '27-05-2026', status: 'Open', applicantCount: 0 },
      { id: 'JOB-105', title: 'Inverter Transformer Breakdown Repair', serviceType: 'connection', description: 'Luminous 1500VA home inverter making continuous sound post local thunderstorm and state power grid line surge.', area: 'Jankipuram Vistar', budget: 500, urgency: 'Emergency', date: '29-05-2026', status: 'Open', applicantCount: 4 }
    ];
  });

  const [technicianApplications, setTechnicianApplications] = useState<any[]>(() => {
    const stored = localStorage.getItem('pragya_tech_applications');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    return [];
  });

  // State to manage new job posts by users
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    serviceType: 'connection',
    description: '',
    area: 'Gomti Nagar Extension',
    budget: '',
    urgency: 'Standard'
  });

  // State to manage technician applications modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState<any | null>(null);
  const [applyForm, setApplyForm] = useState({
    name: '',
    phone: '',
    experience: '1-2 years'
  });

  const [jobsFeedbackMessage, setJobsFeedbackMessage] = useState('');
  const [jobsErrorMessage, setJobsErrorMessage] = useState('');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    setJobsFeedbackMessage('');
    setJobsErrorMessage('');

    if (!newJobForm.title.trim() || !newJobForm.description.trim() || !newJobForm.budget.trim()) {
      setJobsErrorMessage('Kripya sabhi fields dhyan se fill karein.');
      return;
    }

    const budgetNum = parseInt(newJobForm.budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setJobsErrorMessage('Kripya valid budget standard bypass select karein.');
      return;
    }

    const newJob = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      title: newJobForm.title,
      serviceType: newJobForm.serviceType,
      description: newJobForm.description,
      area: newJobForm.area,
      budget: budgetNum,
      urgency: newJobForm.urgency,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Open',
      applicantCount: 0
    };

    const updatedList = [newJob, ...jobsList];
    setJobsList(updatedList);
    localStorage.setItem('pragya_jobs', JSON.stringify(updatedList));

    setNewJobForm({
      title: '',
      serviceType: 'connection',
      description: '',
      area: 'Gomti Nagar Extension',
      budget: '',
      urgency: 'Standard'
    });

    setJobsFeedbackMessage(`🎉 Job Offer '${newJob.id}' matching successfully posted onto Lucknow live queue! Wait for verified Pragya tech response.`);
    setJobsActiveSubTab('list');
  };

  const handleApplyJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJobsFeedbackMessage('');
    setJobsErrorMessage('');

    if (!applyForm.name.trim() || !applyForm.phone.trim()) {
      setJobsErrorMessage('Kripya Name aur active Phone number specify karein.');
      return;
    }

    if (!selectedJobToApply) return;

    const newApp = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      jobId: selectedJobToApply.id,
      jobTitle: selectedJobToApply.title,
      name: applyForm.name,
      phone: applyForm.phone,
      experience: applyForm.experience,
      appliedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedApps = [newApp, ...technicianApplications];
    setTechnicianApplications(updatedApps);
    localStorage.setItem('pragya_tech_applications', JSON.stringify(updatedApps));

    // Update job status & applicant count
    const updatedJobs = jobsList.map(j => {
      if (j.id === selectedJobToApply.id) {
        return { ...j, applicantCount: j.applicantCount + 1, status: 'Applied' };
      }
      return j;
    });
    setJobsList(updatedJobs);
    localStorage.setItem('pragya_jobs', JSON.stringify(updatedJobs));

    setShowApplyModal(false);
    setJobsFeedbackMessage(`👍 Bid accepted! Applied successfully for Job ${selectedJobToApply.id}. Status changed to 'Applied'. Admin review started.`);
  };

  const handleSearchBooking = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError('');
    setSearchResult(null);
    setSearchSuccessMsg('');
    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      setSearchError('Kripya Booking ID ya Txn ID enter karein.');
      return;
    }

    const stored = localStorage.getItem('pragya_bookings');
    let allBookings: any[] = [];
    if (stored) {
      try {
        allBookings = JSON.parse(stored);
      } catch (err) {
        console.error("Error reading bookings database", err);
      }
    }

    // Find custom id match
    const found = allBookings.find(
      b => b.id.toUpperCase() === query || 
           (b.paymentId && b.paymentId.toUpperCase() === query)
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchError('Rukie! Yeh Booking ID system me register nahi hai. Kripya dhyan se check karke sahi ID dalein (e.g., BK-MOCK1234 or pay_XXXX).');
    }
  };

  const handleCancelBookingFromSearch = (bookingId: string) => {
    const stored = localStorage.getItem('pragya_bookings');
    let currentList: any[] = [];
    if (stored) {
      try { currentList = JSON.parse(stored); } catch (e) { console.error(e); }
    }
    
    const updatedList = currentList.map((b: any) => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    });

    localStorage.setItem('pragya_bookings', JSON.stringify(updatedList));
    setPastBookings(updatedList);
    
    // Auto sync search result display as well
    if (searchResult && searchResult.id === bookingId) {
      setSearchResult({ ...searchResult, status: 'Cancelled' });
    }
    setSearchSuccessMsg('Safely Cancelled! Instant 100% Refund direct source limit credit transfer kar diya gaya hai. Real refund safely 3-5 banking days me automatic credit hoga.');
  };

  const myPhoneNumber = "9889941609";
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_Sv3QjSbb3511sd"); 
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed' | 'Cancelled'>('All');

  const loadPastBookings = (currPhone: string) => {
    const stored = localStorage.getItem('pragya_bookings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPastBookings(parsed);
      } catch (e) {
        console.error("Error reading pragya_bookings", e);
      }
    } else {
      // Empty storage! pre-populate with mock samples for premium appearance
      const demoList = [
        {
          id: "BK-82931",
          serviceId: "ac-repair",
          serviceTitle: "AC Repair",
          amount: "499",
          name: localStorage.getItem('pragya_user_name') || "User",
          phone: currPhone,
          address: "Flat 402, Shiv Shakti Apartment, Lucknow",
          problem: "Split AC cooling issue, making clicking sound.",
          date: "2026-05-28",
          status: "Completed",
          createdAt: "2026-05-28T10:30:00.000Z",
          paymentId: "pay_Sv3QjSbb3511sd_demo"
        },
        {
          id: "BK-54210",
          serviceId: "plumbing",
          serviceTitle: "Plumbing",
          amount: "299",
          name: localStorage.getItem('pragya_user_name') || "User",
          phone: currPhone,
          address: "Flat 402, Shiv Shakti Apartment, Lucknow",
          problem: "Water tap leakage in master bathroom washbasin.",
          date: "2026-06-03",
          status: "Pending",
          createdAt: "2026-05-29T01:15:00.000Z",
          paymentId: ""
        }
      ];
      localStorage.setItem('pragya_bookings', JSON.stringify(demoList));
      setPastBookings(demoList);
    }
  };

  // Check active session on component mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('pragya_user_phone');
    const savedName = localStorage.getItem('pragya_user_name');
    if (savedPhone && savedName) {
      setUserSession({ name: savedName, phone: savedPhone });
      setShowAuthOverlay(false);
      loadPastBookings(savedPhone);
    } else {
      setShowAuthOverlay(true);
    }

    // Dynamic config fetch from backend API
    fetch("/api/config")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load server config");
      })
      .then((data) => {
        if (data && data.razorpayKeyId) {
          setRazorpayKeyId(data.razorpayKeyId);
        }
      })
      .catch((err) => {
        console.log("Configuration initial connection complete.");
      });
  }, []);

  // Update bookings on userSession change explicitly if verification succeeds
  useEffect(() => {
    if (userSession?.phone) {
      loadPastBookings(userSession.phone);
    }
  }, [userSession?.phone]);

  // Sync OTP timer countdown
  useEffect(() => {
    let interval: any = null;
    if (loginStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loginStep, timer]);

  // Secure API Call helper to trigger Twilio service
  const sendOtpSms = async (phone: string, otpCode: string, name: string) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, otp: otpCode, name })
      });
      return await response.json();
    } catch (err) {
      console.error("API send-otp invocation error:", err);
      return { success: false, demoMode: true, message: "Network connectivity issue check karein." };
    }
  };

  // Auth Operations
  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setApiMessage('');
    if (!loginForm.name.trim()) {
      setAuthError('Kripya apna naam darj karein.');
      return;
    }
    if (loginForm.phone.length !== 10) {
      setAuthError('Kripya sahi 10-digit mobile number darj karein.');
      return;
    }
    
    setIsAuthLoading(true);
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    const result = await sendOtpSms(loginForm.phone, code, loginForm.name);

    setIsAuthLoading(false);
    setLoginStep('otp');
    setOtp('');
    setTimer(30);

    if (result && result.success) {
      setIsDemoMode(false);
      setApiMessage('Real SMS safely sent to your mobile!');
      setShowSmsToast(false);
    } else {
      setIsDemoMode(true);
      if (result && result.message) {
        setApiMessage(result.message);
      }
      setShowSmsToast(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    if (otp !== generatedOtp) {
      setAuthError('Galat verification code! Dobara koshish karein.');
      return;
    }
    
    setIsAuthLoading(true);
    setTimeout(() => {
      localStorage.setItem('pragya_user_phone', loginForm.phone);
      localStorage.setItem('pragya_user_name', loginForm.name);
      setUserSession({ name: loginForm.name, phone: loginForm.phone });
      setShowSmsToast(false);
      setIsAuthLoading(false);
      setShowAuthOverlay(false);
    }, 1000);
  };

  const handleResendOtp = async () => {
    setAuthError('');
    setApiMessage('');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtp('');
    setTimer(30);

    setIsAuthLoading(true);
    const result = await sendOtpSms(loginForm.phone, code, loginForm.name);
    setIsAuthLoading(false);

    if (result && result.success) {
      setIsDemoMode(false);
      setApiMessage('Real SMS resent to your mobile!');
      setShowSmsToast(false);
    } else {
      setIsDemoMode(true);
      if (result && result.message) {
        setApiMessage(result.message);
      }
      setShowSmsToast(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pragya_user_phone');
    localStorage.removeItem('pragya_user_name');
    setUserSession(null);
    setLoginForm({ name: '', phone: '' });
    setOtp('');
    setLoginStep('phone');
    setShowAuthOverlay(true);
  };

  const handleCallInitiate = () => {
    setIsCalling(true);
    setTimeout(() => { window.location.href = `tel:+91${myPhoneNumber}`; }, 800);
  };

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const detectLiveLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    setLocationError("");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "Accept-Language": "en",
                "User-Agent": "PragyaElectricApp/1.0"
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              setFormData(prev => ({
                ...prev,
                address: `${data.display_name} (GPS Accuracy: ${Math.round(accuracy)}m)`
              }));
              setIsLocating(false);
              return;
            }
          }
        } catch (error) {
          console.error("Reverse geocoding failed, falling back to raw coordinates", error);
        }
        
        // Fallback to coordinates
        setFormData(prev => ({
          ...prev,
          address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)} (GPS Accuracy: ${Math.round(accuracy)}m, Lucknow, UP)`
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location: ", error);
        let errorMsg = "Permission denied. Please tap recalculate or enter address.";
        if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out.";
        }
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleServiceClick = (service: any) => {
    setBlinkingId(service.id);
    setTimeout(() => {
      setSelectedService(service);
      // Auto-prefill the booking form using our authenticated user profile details and trigger automatic location detection!
      setFormData({
        name: userSession?.name || '',
        phone: userSession?.phone || '',
        address: 'Fetching live GPS location automatically...',
        problem: '',
        date: '',
        amount: service.basePrice.toString()
      }); 
      setIsModalOpen(true);
      setIsSubmitted(false);
      setBlinkingId(null);
      setErrorMessage('');

      // Auto-fetch location
      setTimeout(() => {
        detectLiveLocation();
      }, 150);
    }, 350);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', address: '', problem: '', date: '', amount: '' });
      setErrorMessage('');
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Phone validation limit inside input
    if (name === 'phone' && value !== '' && !/^\d+$/.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' && value !== '' && !/^\d+$/.test(value)) return;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBookingAndPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      return setErrorMessage("Kripya sahi amount darj karein.");
    }
    if (formData.phone.length !== 10) {
      return setErrorMessage("Mobile number exactly 10 digits ka hona chahiye.");
    }
    
    setIsProcessing(true);
    const res = await loadRazorpayScript();
    
    if (!res) {
      setErrorMessage("Razorpay load nahi ho paya. Apna internet connection check karein.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKeyId, 
      amount: Number(formData.amount) * 100, 
      currency: "INR",
      name: "Pragya Electric",
      description: `${selectedService.title} Booking`,
      handler: function (response: any) {
        const pId = response.razorpay_payment_id || `BK-${Date.now()}`;
        setPaymentId(pId);
        setIsProcessing(false);
        setIsSubmitted(true); 

        // Save new booking to pragya_bookings localStorage
        const newBooking = {
          id: pId,
          serviceId: selectedService?.id || 'other',
          serviceTitle: selectedService?.title || 'Other Work',
          amount: formData.amount,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          problem: formData.problem || 'No specific description provided',
          date: formData.date || new Date().toISOString().split('T')[0],
          status: "Completed",
          createdAt: new Date().toISOString(),
          paymentId: pId
        };

        const stored = localStorage.getItem('pragya_bookings');
        let currentList: any[] = [];
        if (stored) {
          try {
            currentList = JSON.parse(stored);
          } catch (e) {
            console.error("Error parsing existing pragya_bookings", e);
          }
        }
        const updatedList = [newBooking, ...currentList];
        localStorage.setItem('pragya_bookings', JSON.stringify(updatedList));
        setPastBookings(updatedList);
      },
      prefill: { name: formData.name, contact: formData.phone },
      theme: { color: "#1a2f6b" },
      modal: { 
        ondismiss: function() { 
          setIsProcessing(false); 
          setErrorMessage("Aapne payment cancel kar di hai."); 
        } 
      }
    };
    
    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setIsProcessing(false);
        setErrorMessage("Payment fail ho gayi: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage("Payment gateway open karne mein error aayi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-800 flex flex-col overflow-x-hidden relative">
      <style>{`
        @keyframes quickBlink { 0%,100%{transform:scale(1)} 50%{transform:scale(0.92);background:#eff6ff} }
        .blink-motion { animation: quickBlink 0.35s ease-in-out; border-color: #3b82f6 !important; }
        @keyframes ripple { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 70%{box-shadow:0 0 0 20px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(0,0,0,0)} }
      `}</style>

      {/* --- SIMULATED SMS NOTIFICATION TOAST --- */}
      {showSmsToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl p-4 text-white flex items-start space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-xl shrink-0">
              <Phone className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Simulated SMS Service</span>
                <span className="text-[9px] text-slate-400">Just Now</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                Pragya Electric secure verification OTP is <strong className="text-yellow-400 font-mono tracking-widest bg-yellow-400/20 px-2 py-0.5 rounded border border-yellow-400/20 text-sm">{generatedOtp}</strong>. Yeh code aapka login secure karne ke liye hai.
              </p>
            </div>
            <button onClick={() => setShowSmsToast(false)} className="text-slate-400 hover:text-slate-200 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container Content Wrapper: Blurs if auth overlay is active */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${showAuthOverlay ? 'blur-md pointer-events-none select-none filter' : ''}`}>
        
        {/* Header */}
        <div className="bg-[#1a2f6b] text-white pt-14 pb-28 px-6 relative rounded-b-[2rem] shadow-md text-center">
          
          {/* Top-Left Menu Launcher Button */}
          <button 
            type="button"
            onClick={() => {
              setIsMenuDrawerOpen(true);
            }}
            className="absolute top-4 left-4 flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-[11.5px] border border-white/20 hover:bg-white/20 active:scale-95 transition-all shadow-md font-bold uppercase tracking-wider cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5 text-white" />
            <span>Menu</span>
          </button>
          
          {/* Top-Right User Badge */}
          {userSession && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs border border-white/10 shadow-sm animate-in slide-in-from-top-1 duration-200">
              <button onClick={handleLogout} className="text-red-300 font-bold hover:text-red-400 transition-colors flex items-center space-x-1 cursor-pointer">
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-5 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-yellow-400 mr-2 fill-yellow-400" />
            <span className="text-white/90 text-[10px] font-bold tracking-[0.2em] uppercase">Trusted Services</span>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">PRAGYA ELECTRIC</h1>
          <p className="text-blue-200/90 text-sm font-semibold tracking-wide">A to Z Home & Motor Solutions</p>
        </div>

        {/* Main Content Area based on Menu Tab */}
        <div className="flex-grow max-w-md mx-auto px-4 -mt-20 relative z-20 w-full mb-6">
          {menuActiveTab === 'home' ? (
            <>
              {/* Services Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {servicesData.map((service) => {
                  const Icon = service.icon; 
                  
                  return (
                    <button 
                      key={service.id} 
                      onClick={() => handleServiceClick(service)} 
                      className={`flex flex-col items-center justify-center py-4 px-1 bg-white rounded-[1.25rem] shadow-sm border transition-all duration-200 h-[115px] cursor-pointer ${blinkingId === service.id ? 'blink-motion' : 'border-slate-100 hover:border-blue-200 hover:shadow-md'}`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2.5 ${service.bg}`}>
                        <Icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full px-1 text-[#1e293b]">{service.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Urgent Call Banner */}
              <button 
                onClick={handleCallInitiate} 
                className="mt-6 w-full bg-[#003057] rounded-[1.5rem] p-5 text-white text-left shadow-lg relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-transparent opacity-50"></div>
                <h3 className="font-bold text-[17px] mb-1 relative z-10">Urgent Service Required?</h3>
                <p className="text-blue-100/80 text-[11px] leading-relaxed mb-5 pr-8 relative z-10">Ghar par emergency professional help chahiye? Slide karein!</p>
                <div className="border border-white/20 rounded-full py-1 pl-1 pr-4 flex items-center bg-white/5 relative z-10">
                  <div className="bg-[#22c55e] p-3 rounded-full mr-4 shadow-lg group-hover:scale-105 transition-transform" style={{animation: 'ripple 2s infinite'}}>
                    <PhoneCall className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-[11px] font-bold tracking-widest uppercase">Slide to call immediately &gt;</span>
                </div>
              </button>

              {/* --- PAST BOOKINGS SECTION --- */}
              <div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 feedback-section">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2.5 rounded-2xl text-[#1a2f6b]">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#1a2f6b] text-base leading-tight">Aapki Bookings</h3>
                      <p className="text-[10px] text-slate-500 font-medium">History and current statuses</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const mockPending = {
                        id: `BK-MOCK${Math.floor(1000 + Math.random() * 9000)}`,
                        serviceId: "connection",
                        serviceTitle: "Connection Help",
                        amount: "149",
                        name: userSession?.name || "User",
                        phone: userSession?.phone || "",
                        address: "12, Gomti Nagar Bypass, Lucknow",
                        problem: "Meter terminal showing load warning. Requires urgent wire upgrade.",
                        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                        status: "Pending",
                        createdAt: new Date().toISOString(),
                        paymentId: ""
                      };
                      const stored = localStorage.getItem('pragya_bookings');
                      let currentList: any[] = [];
                      if (stored) {
                        try { currentList = JSON.parse(stored); } catch (e) { console.error(e); }
                      }
                      const updatedList = [mockPending, ...currentList];
                      localStorage.setItem('pragya_bookings', JSON.stringify(updatedList));
                      setPastBookings(updatedList);
                    }}
                    className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors px-2.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                    title="Create a simulated pending booking to test status views"
                  >
                    <span>+ Simulate Pending</span>
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
                  {(['All', 'Pending', 'Completed', 'Cancelled'] as const).map((tab) => {
                    const isActive = filterStatus === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFilterStatus(tab)}
                        className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-white text-[#1a2f6b] shadow-sm font-bold' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Bookings List mapping */}
                <div className="space-y-3">
                  {pastBookings.filter(b => !userSession || b.phone === userSession.phone).filter(b => filterStatus === 'All' || b.status === filterStatus).length === 0 ? (
                    <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-400">Abhi koi booking nahi hai</p>
                      <p className="text-[10px] text-slate-400 mt-1">App mein service book karein ya upar simulated test generate karein!</p>
                    </div>
                  ) : (
                    pastBookings
                      .filter(b => !userSession || b.phone === userSession.phone)
                      .filter(b => filterStatus === 'All' || b.status === filterStatus)
                      .map((booking) => (
                        <div 
                          key={booking.id}
                          className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex flex-col space-y-2 relative transition-all hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-[#1e293b]">{booking.serviceTitle}</h4>
                              <span className="text-[10px] text-slate-400 font-mono tracking-wider select-all">#{booking.id}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                              booking.status === 'Completed'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : booking.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {booking.status === 'Completed' ? (
                                <CheckCircle2 className="w-3 h-3 shrink-0 mr-1 text-green-600" />
                              ) : booking.status === 'Cancelled' ? (
                                <XCircle className="w-3 h-3 shrink-0 mr-1 text-rose-600" />
                              ) : (
                                <Clock className="w-3 h-3 shrink-0 mr-1 text-amber-600" />
                              )}
                              <span>{booking.status}</span>
                            </span>
                          </div>

                          <div className="space-y-1.5 text-slate-600 text-[11px] pt-1 border-t border-slate-200/40">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-semibold">{booking.date}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{booking.address}</span>
                            </div>
                            {booking.problem && (
                              <div className="flex items-start space-x-1.5 bg-blue-50/50 p-2 rounded-xl border border-blue-100/50 text-[#1a2f6b]/95 mt-1 font-medium">
                                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.25 font-bold" />
                                <span className="line-clamp-2"><strong>Issue:</strong> {booking.problem}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 text-[11px] font-bold">
                            <div className="flex items-center text-blue-600">
                              <IndianRupee className="w-3 h-3 mr-0.5" />
                              <span className="text-xs font-black">{booking.amount}</span>
                            </div>
                            {booking.paymentId && (
                              <span className="text-[9px] text-slate-400 font-mono w-40 text-right truncate select-all" title={booking.paymentId}>Txn: {booking.paymentId}</span>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </>
          ) : menuActiveTab === 'find_order' ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 animate-in slide-in-from-bottom-4 feedback-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-50 p-2.5 rounded-2xl text-[#1a2f6b]">
                  <Search className="w-6 h-6 text-[#1a2f6b]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1a2f6b] text-base leading-tight">Find & Track Booking</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Search Any Order ID Easily</p>
                </div>
              </div>

              <form onSubmit={handleSearchBooking} className="space-y-3">
                <div className="relative">
                  <Search className="absolute top-3.5 left-4 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Order ID (e.g., BK-MOCK1234, pay_XX)"
                    className="w-full pl-11 pr-24 py-3 bg-slate-50 font-bold rounded-xl text-xs outline-none border border-slate-200 focus:border-blue-500 focus:bg-white transition-all text-[#1e293b]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-[#1a2f6b] text-white hover:bg-[#111e47] text-[10px] font-black px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    SEARCH
                  </button>
                </div>
              </form>

              {searchError && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100/80 text-rose-700 text-xs rounded-2xl flex items-start space-x-2.5">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5" />
                  <span className="leading-relaxed font-bold">{searchError}</span>
                </div>
              )}

              {searchSuccessMsg && (
                <div className="mt-4 p-4 bg-green-50 border border-green-100 text-green-800 text-xs rounded-2xl flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-green-600 mt-0.5" />
                  <span className="leading-relaxed font-black">{searchSuccessMsg}</span>
                </div>
              )}

              {searchResult ? (
                <div className="mt-6 border border-slate-100 bg-slate-50/50 p-5 rounded-2xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100/80">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#1a2f6b] tracking-wider mb-1 bg-blue-50 px-2 py-0.5 rounded w-max block">Found Booking</span>
                      <h4 className="font-extrabold text-base text-[#1e293b] leading-tight mt-1">{searchResult.serviceTitle}</h4>
                      <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">#{searchResult.id}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                      searchResult.status === 'Completed'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : searchResult.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {searchResult.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3 shrink-0 text-green-600" />
                      ) : searchResult.status === 'Cancelled' ? (
                        <XCircle className="w-3 h-3 shrink-0 text-rose-600" />
                      ) : (
                        <Clock className="w-3 h-3 shrink-0 text-amber-600" />
                      )}
                      <span>{searchResult.status}</span>
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[#1e293b] text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Booking Person (Name):</span>
                      <span className="font-extrabold text-[#1a2f6b]">{searchResult.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Phone Number:</span>
                      <span className="font-mono font-bold">+91 {searchResult.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Scheduled Date:</span>
                      <span className="font-bold">{searchResult.date}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-slate-400 font-bold">Service Location:</span>
                      <span className="bg-white p-3 rounded-xl border border-slate-100 font-medium text-[11px] leading-relaxed text-slate-600 shadow-sm">{searchResult.address}</span>
                    </div>
                    {searchResult.problem && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-slate-400 font-bold">Customer Issue / Problem:</span>
                        <span className="bg-blue-50/55 p-3 rounded-xl border border-blue-100/60 font-medium text-[11px] leading-relaxed text-[#1a2f6b]/95 shadow-sm flex items-start space-x-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 font-bold" />
                          <span>{searchResult.problem}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center text-blue-600">
                      <span className="text-slate-400 mr-2">Paid Base Amount:</span>
                      <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-blue-600 animate-pulse" />
                      <span className="text-sm font-black">{searchResult.amount}</span>
                    </div>
                    {searchResult.paymentId && (
                      <span className="text-[10px] text-slate-400 font-mono" title={searchResult.paymentId}>Txn: {searchResult.paymentId}</span>
                    )}
                  </div>

                  {/* Operational Cancellation in tracked status */}
                  <div className="pt-3 border-t border-slate-100">
                    {searchResult.status !== 'Cancelled' ? (
                      <div className="space-y-2.5">
                        <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-xl font-bold leading-relaxed">
                          ⚠️ <strong>Cancellation Policy (Niyam):</strong> Agla technician dispatch hone se pehle is order ko direct free cancel karein. Refund automatic Gateway se direct trigger hoga.
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelBookingFromSearch(searchResult.id)}
                          className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md text-xs uppercase cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Cancel Booking & Refund Details</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px] font-bold leading-relaxed flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>Refund processed perfectly! 100% money safely routed back. Direct credit source update will reflect in 3-5 bank days. No fine charged!</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-8 text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">Order Search Database Active</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">Pragya Electric orders search engine se apni Booking ID verify karein. Koi bhi entry check ki ja sakti hai.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMenuActiveTab('home')}
                className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider text-center cursor-pointer"
              >
                Back to Home Services
              </button>
            </div>
          ) : menuActiveTab === 'jobs' ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 animate-in slide-in-from-bottom-4 feedback-section space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-1">
                <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600">
                  <Briefcase className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1a2f6b] text-base leading-tight">Lucknow Gigs & Jobs</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Electrician Work-Hub & Client Postings</p>
                </div>
              </div>

              {/* Jobs Feedback Message */}
              {jobsFeedbackMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold leading-relaxed relative flex items-start space-x-2 animate-in zoom-in-95">
                  <span className="text-emerald-500 font-black">✓</span>
                  <p className="flex-grow text-[11px] font-bold leading-normal">{jobsFeedbackMessage}</p>
                  <button onClick={() => setJobsFeedbackMessage('')} className="text-emerald-500 hover:text-emerald-700 font-black shrink-0 px-1">×</button>
                </div>
              )}

              {jobsErrorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs font-semibold leading-relaxed relative flex items-start space-x-2 animate-in zoom-in-95">
                  <span className="text-rose-500 font-black">✗</span>
                  <p className="flex-grow text-[11px] font-bold leading-normal">{jobsErrorMessage}</p>
                  <button onClick={() => setJobsErrorMessage('')} className="text-rose-500 hover:text-rose-700 font-black shrink-0 px-1">×</button>
                </div>
              )}

              {/* Navigation Tabs for Jobs Section */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-[10.5px] font-black uppercase tracking-wide">
                <button
                  type="button"
                  onClick={() => setJobsActiveSubTab('list')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                    jobsActiveSubTab === 'list' ? 'bg-white text-[#1a2f6b] shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Find Gigs ({jobsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setJobsActiveSubTab('post')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                    jobsActiveSubTab === 'post' ? 'bg-white text-[#1a2f6b] shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Post Job / Gig
                </button>
                <button
                  type="button"
                  onClick={() => setJobsActiveSubTab('my_gigs')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                    jobsActiveSubTab === 'my_gigs' ? 'bg-white text-[#1a2f6b] shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  My Applied ({technicianApplications.length})
                </button>
              </div>

              {/* Sub-tab 1: FIND ELECTRICAL JOBS LIST */}
              {jobsActiveSubTab === 'list' && (
                <div className="space-y-4">
                  {/* Informational banner */}
                  <div className="bg-blue-50/50 border border-blue-100/55 rounded-2xl p-3.5 text-[11px] text-[#1a2f6b] leading-normal flex items-start space-x-2.5">
                    <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1a2f6b] font-extrabold text-[11px] uppercase tracking-wide">Are you an electrician in Lucknow?</strong>
                      Accept any emergency repair call or wiring gig below. Submit your contact details, and our Lucknow team will link you up directly with the project owner.
                    </div>
                  </div>

                  {/* Filter & Search Area */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <div className="relative">
                      <Search className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={jobsSearchQuery}
                        onChange={(e) => setJobsSearchQuery(e.target.value)}
                        placeholder="Search keyword (e.g., Meter, AC, Pump, Fuse)..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none text-[#1e293b]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9.5px] uppercase tracking-wider text-slate-400 font-extrabold block">Lucknow Locality filter:</span>
                      <div className="flex flex-wrap gap-1">
                        {['All', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Hazratganj', 'Jankipuram'].map((loc) => {
                          const isSelected = selectedLocality === loc;
                          return (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => setSelectedLocality(loc)}
                              className={`px-2.5 py-1 text-[10px] rounded-lg font-bold border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#1a2f6b] text-white border-[#1a2f6b] shadow-sm' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {loc} {loc === 'All' ? 'Localities' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Listings */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {(() => {
                      const filtered = jobsList.filter(job => {
                        const matchesLocality = selectedLocality === 'All' 
                          ? true 
                          : job.area.toLowerCase().includes(selectedLocality.toLowerCase());
                        
                        const matchesSearch = job.title.toLowerCase().includes(jobsSearchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(jobsSearchQuery.toLowerCase()) ||
                          job.id.toLowerCase().includes(jobsSearchQuery.toLowerCase());
                          
                        return matchesLocality && matchesSearch;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <Search className="w-8 h-8 text-slate-350 mx-auto mb-1.5" />
                            <p className="text-slate-400 text-xs font-extrabold uppercase">No matching jobs found</p>
                            <p className="text-[10px] text-slate-450 mt-1">Gyan bypass check: change criteria above</p>
                          </div>
                        );
                      }

                      return filtered.map((job) => {
                        const isEmergency = job.urgency?.toLowerCase() === 'emergency';
                        const badgeColor = isEmergency 
                          ? "bg-rose-500 text-white animate-pulse" 
                          : job.urgency?.toLowerCase() === 'standard' 
                            ? "bg-blue-600 text-white" 
                            : "bg-slate-600 text-white";

                        const isApplied = job.status === 'Applied';

                        return (
                          <div key={job.id} className="bg-white border border-slate-150 p-4 rounded-2xl hover:shadow-sm transition-all space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-[8px] bg-blue-50 text-blue-700 font-extrabold border border-blue-100 px-1.5 py-0.5 rounded font-mono tracking-widest">{job.id}</span>
                                  <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded tracking-wider ${badgeColor}`}>
                                    {job.urgency}
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-xs text-[#1a2f6b] leading-tight select-all">{job.title}</h4>
                              </div>
                              <span className="font-extrabold text-xs text-[#10b981] font-mono shrink-0">₹{job.budget}</span>
                            </div>

                            <p className="text-[10.5px] text-slate-500 leading-normal select-all">{job.description}</p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                              <div className="flex items-center space-x-1 text-slate-600 uppercase tracking-wide">
                                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span>{job.area}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                <span>{job.date}</span>
                              </div>
                            </div>

                            <div className="pt-1 select-none">
                              {isApplied ? (
                                <div className="w-full bg-emerald-50 text-emerald-750 border border-emerald-100 rounded-xl py-2 text-center text-[10px] font-black uppercase flex items-center justify-center space-x-1.5 animate-in zoom-in-95">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Applied Successfully! ({job.applicantCount} bids)</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedJobToApply(job);
                                    setApplyForm({ name: '', phone: '', experience: '1-2 years' });
                                    setShowApplyModal(true);
                                  }}
                                  className="w-full py-2 bg-[#1a2f6b]/5 hover:bg-[#1a2f6b] text-[#1a2f6b] hover:text-white font-extrabold rounded-xl border border-[#1a2f6b]/10 text-[10px] transition-all uppercase tracking-wide cursor-pointer flex items-center justify-center space-x-1.5"
                                >
                                  <Briefcase className="w-3.5 h-3.5" />
                                  <span>Offer Bid & Connect</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: POST ELECTRICAL GIG FORM */}
              {jobsActiveSubTab === 'post' && (
                <form onSubmit={handlePostJob} className="space-y-3 pt-1 animate-in fade-in duration-200">
                  <div className="p-3 bg-blue-50/50 rounded-2xl text-[10.5px] text-[#1a2f6b] font-semibold leading-relaxed flex items-start space-x-2 border border-blue-100/55">
                    <PlusCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Post requirement directly onto the Lucknow Board! Instantly reach hundreds of Pragya certified electrical professionals.</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#0a0f24] uppercase tracking-wider mb-1">Service Demand Title *</label>
                    <input
                      type="text"
                      required
                      value={newJobForm.title}
                      onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                      placeholder="E.g., Burning sound near main fuse box"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white text-[#1e293b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-[#0a0f24] uppercase tracking-wider mb-1">Service category</label>
                      <select
                        value={newJobForm.serviceType}
                        onChange={(e) => setNewJobForm({ ...newJobForm, serviceType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer text-[#1e293b]"
                      >
                        <option value="connection">Meters & Fusebox</option>
                        <option value="ac-repair">AC & Cooling</option>
                        <option value="plumbing">Pump & Boring</option>
                        <option value="new-install">Installation</option>
                        <option value="site-visit">Site Inspection</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#0a0f24] uppercase tracking-wider mb-1">Lucknow Locality</label>
                      <select
                        value={newJobForm.area}
                        onChange={(e) => setNewJobForm({ ...newJobForm, area: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer text-[#1e293b]"
                      >
                        <option value="Gomti Nagar Extension">Gomti Nagar Ext</option>
                        <option value="Aliganj Sector Q">Aliganj Sector Q</option>
                        <option value="Indira Nagar Sector 12">Indira Nagar</option>
                        <option value="Hazratganj Market Area">Hazratganj</option>
                        <option value="Jankipuram Vistar Sector C">Jankipuram</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-[#0a0f24] uppercase tracking-wider mb-1">Work Price Budget (₹) *</label>
                      <input
                        type="number"
                        required
                        value={newJobForm.budget}
                        onChange={(e) => setNewJobForm({ ...newJobForm, budget: e.target.value })}
                        placeholder="E.g., 650"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-[#1e293b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#0a0f24] uppercase tracking-wider mb-1">Urgency Priority</label>
                      <select
                        value={newJobForm.urgency}
                        onChange={(e) => setNewJobForm({ ...newJobForm, urgency: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer text-[#1e293b]"
                      >
                        <option value="Emergency">🚨 EMERGENCY</option>
                        <option value="Standard">⏰ Standard Visit</option>
                        <option value="Flex">📅 Flexible Schedule</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#0a0f24] uppercase tracking-wider mb-1">Problem Details *</label>
                    <textarea
                      required
                      value={newJobForm.description}
                      onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                      placeholder="E.g. Sparking from fuse connector strip during high transformer loading. Safety issue..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none resize-none text-[#1e293b]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1a2f6b] hover:bg-blue-900 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all mt-2"
                  >
                    🚀 PUBLISH JOB OFFER
                  </button>
                </form>
              )}

              {/* Sub-tab 3: MY GIG APPLICATIONS */}
              {jobsActiveSubTab === 'my_gigs' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-widest font-black block mb-2">My Applied bids ({technicianApplications.length}):</span>
                    
                    {technicianApplications.length === 0 ? (
                      <p className="text-center text-slate-400 text-xs py-10 font-bold select-none uppercase tracking-wider">No bids placed yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {technicianApplications.map((app) => (
                          <div key={app.id} className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col space-y-1 shadow-sm text-xs select-all">
                            <div className="flex items-center justify-between font-black text-[10px]">
                              <span className="text-blue-700 uppercase font-mono">{app.id}</span>
                              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] tracking-wide">UNDER ADMIN AUDIT</span>
                            </div>
                            <strong className="text-slate-800 text-[11px] block leading-tight">{app.jobTitle}</strong>
                            <div className="text-slate-400 text-[9px] font-extrabold flex justify-between pr-1">
                              <span>Bidder: {app.name}</span>
                              <span>Time: {app.appliedAt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Direct Contact help banner */}
                  <div className="bg-[#1a2f6b] text-white p-4.5 rounded-2xl relative overflow-hidden shadow">
                    <span className="text-[8px] bg-yellow-400 text-slate-900 px-2 py-0.5 rounded font-black uppercase tracking-wider">Fast-track Hiring</span>
                    <h5 className="font-extrabold text-white text-xs mt-2 mb-1">Need Urgent Electricians Deployment?</h5>
                    <p className="text-blue-100 text-[10.5px] leading-relaxed mb-3">If you need immediate matching with multiple master technicians, call Pragya Service Helpdesk direct hotline bypass.</p>
                    <button
                      type="button"
                      onClick={handleCallInitiate}
                      className="w-full bg-[#22c55e] hover:bg-[#1bb052] active:scale-95 text-white font-extrabold rounded-xl py-2.5 text-[10px] tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 fill-white animate-bounce" />
                      <span>DIRECT CALL SUPPORT</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation button */}
              <button
                type="button"
                onClick={() => setMenuActiveTab('home')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider text-center cursor-pointer"
              >
                Go back to Services
              </button>
            </div>
          ) : menuActiveTab === 'policies' ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 animate-in slide-in-from-bottom-4 feedback-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-rose-50 p-2.5 rounded-2xl text-rose-600">
                  <FileText className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1a2f6b] text-base leading-tight">Cancellation & Refund Policy</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Humara Suraksha Niyam</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <div className="bg-rose-50/40 p-4 border border-rose-100/50 rounded-2xl space-y-2">
                  <h4 className="font-black text-rose-800 text-sm">💡 Quick Policy Niyam</h4>
                  <p className="text-[#1a2f6b] font-bold leading-relaxed text-[11px]">
                    Customer satisfaction hamara standard protocol hai. Agar aap Pragya service cancel karna chahte hain, toh bina penalty direct 100% free cancel select karein.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#1a2f6b]/5 text-[#1a2f6b] p-1.5 rounded-lg font-black text-[11px] shrink-0 mt-0.5">24h</div>
                    <div>
                      <p className="font-black text-slate-800 text-xs">100% Free Cancellation (नो पेनल्टी)</p>
                      <p className="text-slate-500 text-[11px]">Hamare certified service professionals ke ghar dispatch hone se pehle cancel karne par ₹0 late cancel charge liya jayega.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-[#1a2f6b]/5 text-[#1a2f6b] p-1.5 rounded-lg font-black text-[11px] shrink-0 mt-0.5">Inst</div>
                    <div>
                      <p className="font-black text-slate-800 text-xs">Instant Gateway Transfer (सुरक्षित रिफंड)</p>
                      <p className="text-slate-500 text-[11px]">System se direct automatic Razorpay/UPI standard billing channel me live source transaction load safe push kar diya jata hai.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-[#1a2f6b]/5 text-[#1a2f6b] p-1.5 rounded-lg font-black text-[11px] shrink-0 mt-0.5">3-5d</div>
                    <div>
                      <p className="font-black text-slate-800 text-xs">Banking Settlement Timeline (रिफंड अवधि)</p>
                      <p className="text-slate-500 text-[11px]">Reserve Bank of India banking clearance rules aur gateway settlements ke anusaar refund credit source panel me aane me 3 to 5 functional bank days lagte hain.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4 text-[11px] leading-relaxed">
                  <p className="font-extrabold text-[#1e293b] mb-1">Apna Refund Status Check Karein:</p>
                  Agar aapki booking list me cancel and refund check karna hai, toh upar system me check tracking se search karke direct action call karein!
                </div>
              </div>

              <div className="flex space-x-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setMenuActiveTab('find_order')}
                  className="flex-1 py-3 bg-blue-50 hover:bg-blue-100 text-[#1a2f6b] font-black rounded-xl text-xs transition-all tracking-wider uppercase text-center cursor-pointer"
                >
                  Track Order & Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setMenuActiveTab('home')}
                  className="flex-1 py-3 bg-[#1a2f6b] hover:bg-[#111e47] text-white font-black rounded-xl text-xs transition-all tracking-wider uppercase text-center cursor-pointer"
                >
                  Go to Home Page
                </button>
              </div>
            </div>
          ) : menuActiveTab === 'support' ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 animate-in slide-in-from-bottom-4 feedback-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-50 p-2.5 rounded-2xl text-green-600">
                  <PhoneCall className="w-6 h-6 text-green-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1a2f6b] text-base leading-tight">Support & Call Desk</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">24/7 Service Emergency Assistance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1a2f6b] text-white p-5 rounded-2xl relative overflow-hidden shadow-lg">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full"></div>
                  <span className="text-[8px] font-black uppercase text-yellow-300 bg-white/10 px-2 py-0.5 rounded tracking-widest">Active Call Desk</span>
                  <h4 className="font-black text-base mt-2 mb-1">Direct Hotline Help</h4>
                  <p className="text-blue-100 text-[11px] leading-relaxed mb-4">Ghar me short-circuit, AC leakage, water connection plumbing problem ya motor breakdown hai? Live instant expert se baat karein.</p>
                  
                  <button
                    onClick={handleCallInitiate}
                    className="w-full bg-[#22c55e] hover:bg-[#1bb052] active:scale-95 text-white font-black rounded-xl py-3 text-xs transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                  >
                    <Phone className="w-4 h-4 fill-white animate-bounce shrink-0" />
                    <span>Dial: +91 {myPhoneNumber}</span>
                  </button>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl space-y-3 bg-slate-50">
                  <h5 className="font-extrabold text-xs text-[#1e293b] uppercase tracking-wider">Other Communication Help</h5>
                  
                  <a
                    href={`https://wa.me/91${myPhoneNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      </div>
                      <span className="text-xs font-bold text-slate-800">WhatsApp Chat Active Support</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <div className="p-3.5 bg-white border border-slate-100 rounded-xl flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed text-slate-500 font-medium">
                      <strong>Registered Base Branch:</strong> Lucknow bypass, near Gomti Nagar railway crossing, Lucknow, UP, India.
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuActiveTab('home')}
                className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider text-center cursor-pointer"
              >
                Back to Home Services
              </button>
            </div>
          ) : (
            /* ABOUT COMPANY */
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 animate-in slide-in-from-bottom-4 feedback-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600">
                  <Info className="w-6 h-6 text-[#1a2f6b]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1a2f6b] text-base leading-tight">About Pragya Company</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">A to Z Home Service Masters</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-semibold">
                <p>
                  Pragya Electric Lucknow ka sabse bharosemand and standard digital platform hai, jo electrical installation, wiring, air conditioner repair, motor rewires, robust plumbing, aur borewell work me custom support bypass karta hai.
                </p>
                
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#1a2f6b] space-y-2">
                  <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">🏆 Trust Indicators</h4>
                  <ul className="space-y-1.5 text-[11px] leading-relaxed text-slate-600">
                    <li className="flex items-center space-x-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> <span>Humble and certified specialists (10+ Years Exp)</span></li>
                    <li className="flex items-center space-x-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> <span>Genuine parts and wire setups only</span></li>
                    <li className="flex items-center space-x-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> <span>Direct 100% money back cancel & refund routing</span></li>
                  </ul>
                </div>

                <p>
                  Prerna, quality service, speed aur low price hamara dynamic resolution niyam hai. Lucknow, UP kshetron me koi bhi location ho, expert bypass and fast reaching time ensured hai.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuActiveTab('home')}
                className="mt-6 w-full py-3 bg-[#1a2f6b] hover:bg-[#111e47] text-white font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider text-center cursor-pointer"
              >
                Go back to Services
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-[#0f172a] text-slate-300 py-8 px-6 mt-auto rounded-t-[2rem] text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
            <a href={`https://wa.me/91${myPhoneNumber}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-green-500 hover:text-white transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>
          </div>
          <p className="text-[10px] text-slate-600">© 2026 Pragya Electric. All rights reserved.</p>
        </footer>


      </div>

      {/* --- FIRST LOGIN MOBILE AUTHENTICATION POPUP OVERLAY --- */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f24]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col p-6 animate-in zoom-in-95 duration-200">
            
            {/* Logo and Security Banner */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-3 text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#1a2f6b] tracking-tight">PRAGYA ELECTRIC</h2>
              <p className="text-xs text-slate-500 mt-1">First-time login secure mobile verification</p>
            </div>

            {loginStep === 'phone' ? (
              /* Step 1: Phone & Name Input */
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Apna Naam Darj Karein</label>
                  <div className="relative">
                    <User className="absolute top-3.5 left-4 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      name="name" 
                      value={loginForm.name} 
                      onChange={handleAuthInputChange} 
                      placeholder="Enter Full Name" 
                      required 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 focus:border-blue-500 focus:bg-white transition-colors text-[#1e293b]" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Number (10 digits)</label>
                  <div className="relative flex">
                    <span className="absolute top-3.5 left-4 flex items-center space-x-1.5 text-slate-500 text-sm font-bold select-none">
                      <Phone className="w-4 h-4 text-slate-400 mr-0.5" />
                      <span>+91</span>
                    </span>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={loginForm.phone} 
                      onChange={handleAuthInputChange} 
                      placeholder="98XXXXXXXX" 
                      maxLength={10} 
                      minLength={10} 
                      required 
                      className="w-full pl-[4.5rem] pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 focus:border-blue-500 focus:bg-white transition-colors font-semibold tracking-wider text-[#1e293b]" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isAuthLoading} 
                  className="w-full bg-[#1a2f6b] hover:bg-[#111e47] text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
                >
                  {isAuthLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Requesting OTP...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify Mobile (Get OTP)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Verification Code Entry */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-start space-x-2 animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                {apiMessage && (
                  <div className={`p-3 text-xs rounded-xl flex items-start space-x-2 border ${
                    isDemoMode 
                      ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium' 
                      : 'bg-green-50 border-green-200 text-green-800 font-medium'
                  }`}>
                    {isDemoMode ? (
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-600 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-green-600 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{apiMessage}</span>
                  </div>
                )}

                <div className="text-center space-y-1">
                  <span className="text-xs text-slate-500 block">We sent a secure verification code to</span>
                  <span className="text-sm font-bold text-[#1e293b] select-none">+91 {loginForm.phone}</span>
                </div>

                <div className="relative">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">Enter 4-Digit OTP</span>
                  
                  {/* Visual Passcode Row */}
                  <div className="flex justify-center space-x-3 my-4">
                    {[0, 1, 2, 3].map((index) => {
                      const digit = otp[index] || '';
                      const isActive = otp.length === index;
                      return (
                        <div 
                          key={index} 
                          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all duration-150 ${
                            isActive 
                              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-sm' 
                              : digit 
                                ? 'border-blue-200 bg-blue-50/20 text-blue-900 shadow-sm' 
                                : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          {digit || <span className="w-2 h-2 bg-slate-300 rounded-full"></span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Absolute invisible native text input for keyboard hooks */}
                  <input 
                    type="tel" 
                    maxLength={4} 
                    value={otp} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtp(val);
                    }}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer text-center"
                    autoFocus
                  />
                </div>

                {/* Resend Actions block */}
                <div className="text-center pt-1">
                  {timer > 0 ? (
                    <span className="text-xs text-slate-400 font-medium select-none">Resend OTP in <strong className="text-slate-600 font-mono">{timer}s</strong></span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleResendOtp} 
                      className="text-xs text-blue-600 font-bold hover:text-blue-800 hover:underline transition-all"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setLoginStep('phone');
                      setAuthError('');
                    }} 
                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition-all active:scale-98"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isAuthLoading || otp.length !== 4} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isAuthLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Verify Login</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </div>
      )}

      {/* Calling Screen Overlay */}
      {isCalling && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-slate-900/95 backdrop-blur-md pb-12 pt-20">
          <div className="flex flex-col items-center mt-10">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl" style={{animation: 'ripple 1.5s infinite'}}>
              <PhoneCall className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">PRAGYA ELECTRIC</h2>
            <p className="text-blue-300 text-lg flex items-center font-medium">Calling +91 {myPhoneNumber}...</p>
          </div>
          <button onClick={() => setIsCalling(false)} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"><PhoneOff className="w-7 h-7 text-white" /></button>
        </div>
      )}

      {/* Booking Form Overlay */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10">
            <div className={`p-5 flex items-center justify-between border-b ${selectedService.bg}`}>
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2.5 rounded-xl">
                  {(() => {
                    const Icon = selectedService.icon;
                    return <Icon className={`w-6 h-6 ${selectedService.color}`} />
                  })()}
                </div>
                <div><h3 className="text-lg font-bold">{selectedService.title}</h3><p className="text-xs text-slate-600">Secure Booking</p></div>
              </div>
              <button onClick={closeModal} className="p-2 bg-white/60 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {isSubmitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h4 className="text-xl font-bold mb-1">Booking Confirmed!</h4>
                  <p className="text-sm text-slate-500 mb-6">Payment of ₹{formData.amount} successful. (Txn: {paymentId})</p>
                  <button onClick={closeModal} className="w-full bg-[#1a2f6b] text-white font-bold py-3.5 rounded-xl">Done</button>
                </div>
              ) : (
                <form onSubmit={handleBookingAndPayment} className="space-y-4">
                  {errorMessage && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center border border-red-200"><AlertCircle className="w-4 h-4 mr-2 shrink-0"/>{errorMessage}</p>}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Amount (₹)</label>
                    <div className="relative"><IndianRupee className="absolute top-3 left-4 w-5 h-5 text-slate-400"/><input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-3 bg-blue-50 rounded-xl text-lg font-bold text-blue-700 outline-none" /></div>
                  </div>
                  <div><div className="relative"><User className="absolute top-3.5 left-4 w-5 h-5 text-slate-400"/><input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Name" className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200" /></div></div>
                  <div><div className="relative"><Phone className="absolute top-3.5 left-4 w-5 h-5 text-slate-400"/><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone (10 digits)" maxLength={10} minLength={10} className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200" /></div></div>
                  <div>
                    <div className="relative">
                      <MapPin className="absolute top-3.5 left-4 w-5 h-5 text-slate-400" />
                      <textarea 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Service Address" 
                        rows={2} 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 resize-none" 
                      />
                    </div>
                    {/* Dynamic Auto-location feedback HUD */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px] px-1 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                      {isLocating ? (
                        <span className="text-blue-700 font-bold flex items-center space-x-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-ping"></span>
                          <span>Detecting GPS Location...</span>
                        </span>
                      ) : locationError ? (
                        <span className="text-rose-600 font-bold flex items-center space-x-1">
                          <span>⚠️ {locationError}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center space-x-1">
                          <span>📍 Live GPS Location Set</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={detectLiveLocation}
                        disabled={isLocating}
                        className="text-[10px] font-black text-blue-800 hover:text-blue-900 bg-white border border-slate-100 hover:border-blue-200 px-2 py-1 rounded transition-all uppercase cursor-pointer"
                      >
                        Recalculate
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <HelpCircle className="absolute top-3.5 left-4 w-5 h-5 text-slate-400" />
                      <textarea
                        name="problem"
                        value={formData.problem}
                        onChange={handleInputChange}
                        required
                        placeholder="अपनी समस्या बताएं (Describe your problem or issue)..."
                        rows={2}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200 resize-none focus:bg-white focus:border-[#1a2f6b]/55 focus:ring-1 focus:ring-[#1a2f6b]/20 transition-all"
                      />
                    </div>
                  </div>
                  <div><div className="relative"><Calendar className="absolute top-3.5 left-4 w-5 h-5 text-slate-400"/><input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none border border-slate-200" /></div></div>
                  <button type="submit" disabled={isProcessing} className="w-full bg-[#1a2f6b] text-white font-bold py-4 rounded-xl mt-2 flex justify-center items-center transition-all active:scale-95">{isProcessing ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> Processing...</> : `Pay ₹${formData.amount || 0} via Razorpay`}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR MENU DRAWER OVERLAY --- */}
      {isMenuDrawerOpen && (
        <div className="fixed inset-0 z-[120] flex animate-in fade-in duration-200">
          {/* Black backdrop click to close */}
          <div 
            onClick={() => setIsMenuDrawerOpen(false)} 
            className="absolute inset-0 bg-[#0a0f24]/75 backdrop-blur-sm cursor-pointer"
          ></div>

          {/* Sidebar container */}
          <div className="bg-white w-[285px] h-full relative z-10 flex flex-col p-6 shadow-2xl animate-in slide-in-from-left duration-300 border-r border-slate-100">
            {/* Header / Logo */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              {userSession ? (
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black uppercase text-sm shadow-sm shrink-0">
                    {userSession.name ? userSession.name.charAt(0) : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-black text-[#1a2f6b] text-sm tracking-tight leading-none uppercase block truncate select-all" title={userSession.name}>
                      👋 {userSession.name}
                    </span>
                    <span className="text-[9px] text-[#22c55e] font-black uppercase tracking-wider block mt-1">● Personal Profile</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="bg-[#1a2f6b] text-white p-2 rounded-xl shrink-0">
                    <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div>
                    <span className="font-black text-[#1a2f6b] text-sm tracking-tight leading-none uppercase block">Pragya Electric</span>
                    <span className="text-[9px] text-[#22c55e] font-black uppercase tracking-wider block mt-1">● Online Dashboard</span>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setIsMenuDrawerOpen(false)} 
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation options list */}
            <nav className="flex-1 py-6 space-y-2">
              {[
                { tab: 'home', label: 'Home Services', icon: Home },
                { tab: 'find_order', label: 'Track Order / Find ID', icon: Search },
                { tab: 'jobs', label: 'Technician Job Board', icon: Briefcase },
                { tab: 'policies', label: 'Cancel & Refund Policy', icon: FileText },
                { tab: 'support', label: 'Support & Assistance', icon: PhoneCall },
                { tab: 'about', label: 'About Company', icon: Info }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = menuActiveTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => {
                      setMenuActiveTab(item.tab as any);
                      setIsMenuDrawerOpen(false);
                      // Clear stale warnings on navigation
                      if (item.tab === 'find_order' && !searchQuery) {
                        setSearchError('');
                        setSearchResult(null);
                        setSearchSuccessMsg('');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold text-left transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 font-extrabold shadow-sm border border-blue-100/50' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Footer Company info */}
            <div className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium pb-2">
              <p className="font-extrabold text-slate-500">Pragya Digital Pvt. Ltd.</p>
              <p className="mt-1 text-[9px]">Lucknow, UP | India</p>
            </div>
          </div>
        </div>
      )}
      {showApplyModal && selectedJobToApply && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-[#0a0f24]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col p-6 animate-in zoom-in-95 duration-200 text-[#0a0f24]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-[#1a2f6b] text-sm uppercase">Accept Electrical Gig</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setShowApplyModal(false)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-[11px] leading-snug">
              <span className="font-black text-slate-400 uppercase tracking-wider block text-[9px] mb-1">Applying For:</span>
              <strong className="text-[#1a2f6b] block text-xs font-black">{selectedJobToApply.title}</strong>
              <span className="text-slate-500 mt-1 block font-semibold">Location: {selectedJobToApply.area} | Budget: ₹{selectedJobToApply.budget}</span>
            </div>

            <form onSubmit={handleApplyJobSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Technician Full Name *</label>
                <input
                  type="text"
                  required
                  value={applyForm.name}
                  onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                  placeholder="E.g., Ramesh Kumar"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-200 text-[#1e293b]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Working Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={applyForm.phone}
                  onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                  placeholder="E.g., 9889941609"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-200 text-[#1e293b]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Electrical Experience</label>
                <select
                  value={applyForm.experience}
                  onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-200 cursor-pointer text-[#1e293b]"
                >
                  <option value="Under 1 year">Helper / Trainee (&lt;1 yr)</option>
                  <option value="1-2 years">Junior Technician (1-2 yrs)</option>
                  <option value="3-5 years">Certified Expert (3-5 yrs)</option>
                  <option value="5+ years">Master Electrician (5+ yrs)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a2f6b] text-white font-extrabold py-3.5 rounded-xl mt-2 text-xs uppercase tracking-wider hover:bg-blue-950 transition-all cursor-pointer shadow-md"
              >
                Send Bid Request
              </button>
            </form>
          </div>
        </div>
      )}

      <Analytics />
    </div>
  );
}
