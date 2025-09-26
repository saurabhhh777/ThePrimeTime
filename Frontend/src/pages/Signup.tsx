import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Check, ArrowLeft, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { instance as axios } from "../../lib/axios.tsx";
interface FormData {
  username: string;
  password: string;
  email: string;
}

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [formdata, setFormdata] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
    
    // Check username availability when username changes
    if (e.target.name === 'username' && e.target.value.length >= 3) {
      checkUsernameAvailability(e.target.value);
    } else if (e.target.name === 'username') {
      setUsernameAvailable(null);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;
    
    setCheckingUsername(true);
    try {
      const response = await axios.post('/api/v1/user/check-username', { username });
      setUsernameAvailable(response.data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formdata.username || !formdata.email || !formdata.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formdata.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (usernameAvailable === false) {
      toast.error("Please choose a different username");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/v1/user/send-signup-otp', formdata);
      if (response.data.success) {
        setOtpSent(true);
        setCountdown(60); // 60 seconds countdown
        toast.success("OTP sent to your email!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await axios.post('/api/v1/user/verify-signup-otp', {
        email: formdata.email,
        otp: otp
      });
      
      if (response.data.success) {
        toast.success("Account created successfully! Welcome to ThePrimeTime");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      const response = await axios.post('/api/v1/user/send-signup-otp', formdata);
      if (response.data.success) {
        setCountdown(60);
        toast.success("OTP resent to your email!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!otpSent) {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
    }
  };

  const passwordStrength = formdata.password.length >= 6;
  const canSendOTP = formdata.username && formdata.email && passwordStrength && usernameAvailable === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Poppins'] p-4">
      <Toaster position="top-right" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <img src="/favicon-32x32.png" alt="ThePrimeTime Logo" className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">ThePrimeTime</h1>
          </div>
          <p className="text-gray-400 text-sm">Join thousands of developers tracking their productivity</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {otpSent ? "Verify Your Email" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
              {otpSent ? "Enter the 6-digit code sent to your email" : "Start tracking your coding journey"}
            </p>
          </div>

          {!otpSent ? (
            <div className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formdata.username}
                    placeholder="Choose a username"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  />
                  {checkingUsername && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                {/* Username Availability Status */}
                {formdata.username.length >= 3 && !checkingUsername && (
                  <div className={`flex items-center gap-2 text-xs ${
                    usernameAvailable === true ? 'text-green-400' : 
                    usernameAvailable === false ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    <Check className="h-3 w-3" />
                    <span>
                      {usernameAvailable === true ? 'Username is available' : 
                       usernameAvailable === false ? 'Username is taken' : 
                       'Checking availability...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formdata.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formdata.password}
                    placeholder="Create a password"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${passwordStrength ? 'text-green-400' : 'text-gray-500'}`}>
                    <Check className="h-3 w-3" />
                    <span>At least 6 characters</span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p className="text-gray-300 text-sm font-medium">What you'll get:</p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    Real-time coding analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    Language and project insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    Productivity tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    VS Code extension access
                  </li>
                </ul>
              </div>

              {/* Send OTP Button */}
              <button
                onClick={handleSendOTP}
                disabled={loading || !canSendOTP}
                className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Enter OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-center text-lg tracking-widest"
                  />
                </div>
                <p className="text-gray-400 text-xs">
                  We've sent a 6-digit code to {formdata.email}
                </p>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-gray-400 hover:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  <Clock className="h-4 w-4" />
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>

              {/* Verify OTP Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={verifyingOtp || otp.length !== 6}
                className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {verifyingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>

              {/* Back Button */}
              <button
                onClick={() => setOtpSent(false)}
                className="w-full py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Form
              </button>
            </div>
          )}

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-white/10 mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link 
                to="/signin" 
                className="text-white hover:text-gray-200 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;