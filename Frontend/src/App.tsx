import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Dashboard from "./pages/Dashboard";
import ApiDocs from "./pages/ApiDocs";
import Faq from "./pages/Faq";
import Leaderboard from "./pages/Leaderboard";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Invoice from "./pages/Invoice";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription"; 


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/@:username" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
};

export default App;
