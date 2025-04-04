import { useState } from "react";
import { userAuthStore } from "../../store/userAuthStore.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Define the form data type
interface FormData {
  username: string;
  email: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = userAuthStore();

  const [formdata, setFormdata] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  
  const handleSignup = async () => {
    const success = await signup(formdata.username, formdata.email, formdata.password);
    if (success) {
      toast.success("Signup successful");
      navigate("/dashboard");
    } else {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b bg-[#273a48]">
      <div className="flex flex-col items-center justify-center p-8 bg-[#98a9bd] bg-opacity-90 shadow-2xl rounded-xl w-96 space-y-6">
        <h2 className="text-3xl font-bold text-text mb-6">Sign Up</h2>
        <input
          className="w-full px-4 py-3 bg-transparent border-2 border-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
          type="text"
          name="username"
          placeholder="Enter your username"
          onChange={handleChange}
        />
        <input
          className="w-full px-4 py-3 text-white bg-transparent border-2 border-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
          type="email"
          name="email"
          placeholder="example@gmail.com"
          onChange={handleChange}
        />
        <input
          className="w-full px-4 py-3 text-white bg-transparent border-2 border-white rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
        />
        <button 
          className="w-full bg-gradient-to-r from-red-800 to-red-600 py-3 rounded-lg text-white font-semibold hover:from-red-700 hover:to-red-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <p className="text-black text-sm">
          Already have an account? <a href="/signin" className="text-blue-500 hover:text-blue-400">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;