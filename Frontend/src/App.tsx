import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Signin from "./components/pages/Signin";
import Signup from "./components/pages/Signup";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Dashboard from "./components/pages/Dashboard";
import ApiDocs from "./components/pages/ApiDocs";
import Faq from "./components/pages/Faq";
import Leaderboard from "./components/pages/Leaderboard";
import Reports from "./components/pages/Reports";
import Profile from "./components/pages/Profile";
import Invoice from "./components/pages/Invoice";
import Projects from "./components/pages/Projects";
import Blog from "./components/pages/Blog";
import Settings from "./components/pages/Settings"; 


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
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
};

export default App;
