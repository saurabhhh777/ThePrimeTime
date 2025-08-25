import { motion } from 'framer-motion';
import { ChevronDown, Star, Search, ArrowRight, Users, Shield, Folder, Code2, Monitor, BarChart2, Clock, Github, Instagram, Linkedin, Twitter, Copyright, Zap, Target, TrendingUp, Globe, Activity, Database, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleJoinWaitlist = () => {
    navigate('/signup');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden font-['Poppins']">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PrimeTime</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-gray-900 transition-colors">Home</a>
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#docs" className="text-gray-700 hover:text-gray-900 transition-colors">Docs</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">Contact</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button 
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  onClick={handleDashboard}
                >
                  Dashboard
                </button>
                <button 
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button 
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  onClick={handleJoinWaitlist}
                >
                  Get Started
                </button>
                <button 
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleLogin}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* VS Code Icons */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <div className="w-0.5 h-4 bg-gray-300"></div>
              <div className="w-8 h-8 bg-purple-500 rounded"></div>
              <div className="w-0.5 h-4 bg-gray-300"></div>
              <div className="w-8 h-8 bg-green-500 rounded"></div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Prime Time -{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Coding Analytics
                </span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded opacity-20"></div>
              </span>{' '}
              Platform
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive coding time tracking and analytics platform that helps developers monitor their productivity, 
              track coding patterns, and optimize their workflow with real-time VS Code integration.
            </p>

            {/* CTA Button */}
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Start Tracking'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* VS Code Extension Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">VS Code Extension</h2>
            </div>
            <p className="text-lg text-gray-600">
              Seamlessly track your coding sessions with our powerful VS Code extension.
            </p>
          </div>

          {/* Extension Features */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Real-time tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Status bar integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Token-based authentication</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Automatic data sync</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Language usage tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">File change monitoring</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Download Extension
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Features */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Platform Features</h2>
              <p className="text-xl text-gray-600 mb-12">
                Comprehensive analytics and insights to help you become a more productive developer.
              </p>

              <div className="space-y-8">
                {[
                  {
                    number: "01",
                    icon: Activity,
                    title: "Real-time Analytics",
                    description: "Monitor coding sessions, file changes, and language usage in real-time.",
                    color: "blue"
                  },
                  {
                    number: "02", 
                    icon: BarChart2,
                    title: "Productivity Insights",
                    description: "Get detailed insights into your productivity patterns and coding habits.",
                    color: "green"
                  },
                  {
                    number: "03",
                    icon: Database,
                    title: "Data Retention",
                    description: "Flexible data retention with subscription plans from 30 days to unlimited.",
                    color: "purple"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center`}>
                        <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-400">{feature.number}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "1000+", label: "Active Developers", color: "blue" },
                { number: "50+", label: "Languages Tracked", color: "purple" },
                { number: "99.9%", label: "Uptime", color: "green" },
                { number: "24/7", label: "Real-time Sync", color: "orange" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Plan
                </span>
                <Star className="absolute -top-2 -right-6 w-6 h-6 text-purple-600" />
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible subscription plans to match your analytics needs and data retention requirements.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                dataRetention: "30 days",
                features: ["Basic analytics", "Language tracking", "Session monitoring", "File activity"],
                color: "gray",
                popular: false
              },
              {
                name: "Basic",
                price: "$9.99",
                period: "month",
                dataRetention: "3 months",
                features: ["Extended analytics", "Custom date ranges", "Export capabilities", "Priority support"],
                color: "blue",
                popular: false
              },
              {
                name: "Pro",
                price: "$19.99",
                period: "month",
                dataRetention: "1 year",
                features: ["Advanced analytics", "Team insights", "API access", "Custom integrations"],
                color: "purple",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$49.99",
                period: "month",
                dataRetention: "Unlimited",
                features: ["Unlimited data", "Custom solutions", "Dedicated support", "White-label options"],
                color: "gray",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-${plan.color === 'purple' ? 'purple-50' : 'white'} rounded-xl p-6 border-2 ${plan.popular ? 'border-purple-500' : 'border-gray-200'} hover:shadow-lg transition-all duration-300 cursor-pointer group relative`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.dataRetention} data retention</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="https://github.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/saurabh-maurya-92b727245/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Linkedin size={24} />
              </a>
              <a href="https://www.instagram.com/asksaurabhhh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Instagram size={24} />
              </a>
              <a href="https://x.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Twitter size={24} />
              </a>
            </div>

            <div className="flex items-center text-gray-400 gap-2">
              <Copyright size={16} />
              <span>Copyright 2025 PrimeTime. All rights reserved.</span>
            </div>

            <div 
              className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => window.open("https://www.asksaurabh.xyz/")}
            >
              <span>Developed by</span>
              <img className='w-8 h-8 rounded-full' src="https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp" alt="Developer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;