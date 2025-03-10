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
          type="email"
          name="email"
          placeholder="example@gmail.com"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded text-white bg-transparent border-2 border-white focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded text-white bg-transparent border-2 border-white focus:border-blue-500 focus:outline-none"
        />
        <button
          className="w-full px-4 py-2 rounded bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white transition-all duration-300 transform hover:scale-105"
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
