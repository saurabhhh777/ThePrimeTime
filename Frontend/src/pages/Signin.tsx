import { userAuthStore } from "../../store/userAuthStore.tsx";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Timer, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import React from "react"; // Added missing import

interface FormData {
  identifier: string;
  password: string;
}

const Signin = () => {
  const navigate = useNavigate();
  const { signin } = userAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formdata, setFormdata] = useState<FormData>({
    identifier: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    if (!formdata.identifier || !formdata.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const success = await signin(formdata.identifier, formdata.password);
    if (success) {
      navigate("/dashboard");
      toast.success("Welcome back! Login successful");
    } else {
      toast.error("Invalid username/email or password");
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignin();
    }
  };

  // Check if identifier is email or username
  const isEmail = formdata.identifier.includes('@');
  const identifierIcon = isEmail ? Mail : User;
  const identifierPlaceholder = isEmail ? "Enter your email" : "Enter your username";

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
              <Timer className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">ThePrimeTime</h1>
          </div>
          <p className="text-gray-400 text-sm">Track your coding productivity</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>

          <div className="space-y-6">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {React.createElement(identifierIcon, { className: "h-5 w-5 text-gray-400" })}
                </div>
                <input
                  type="text"
                  name="identifier"
                  value={formdata.identifier}
                  placeholder={identifierPlaceholder}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                />
              </div>
              <p className="text-gray-400 text-xs">
                You can sign in with your username or email address
              </p>
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
                  placeholder="Enter your password"
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
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignin}
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-white hover:text-gray-200 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
