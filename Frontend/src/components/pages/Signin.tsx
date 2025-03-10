import { userAuthStore } from "../../../store/userAuthStore.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Define the form data type
interface FormData {
  email: string;
  password: string;
}

const Signin = () => {
  const navigate = useNavigate();
  const { signin } = userAuthStore();

  const [formdata, setFormdatat] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdatat({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    const success = await signin(formdata.email, formdata.password);
    if (success) {
      toast.success("Login successful");
      navigate("/dashboard");
    } else {
      toast.error("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#e9ecda] to-[#c9ccba]">
     
      <div className="flex flex-col items-center justify-center p-8 bg-black bg-opacity-90 shadow-2xl rounded-xl w-96 space-y-6">
        <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>
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
          onClick={handleSignin}
        >
          Sign In
        </button>
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-blue-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
