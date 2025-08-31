import { motion } from 'framer-motion';
import { Star, ArrowRight, Code2, BarChart2, Activity, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';

import { Badge } from '../components/ui/badge';
import Footer from '../components/ui/footer';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setCurrentUser] = useState<any>(null);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden font-['Poppins']">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-white">PrimeTime</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#docs" className="text-gray-300 hover:text-white transition-colors">Docs</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="outline"
                  onClick={handleDashboard}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleJoinWaitlist}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogin}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* VS Code Icons */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-8 h-8 bg-purple-500 rounded"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-8 h-8 bg-green-500 rounded"></div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Prime Time -{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Coding Analytics
                </span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded opacity-20"></div>
              </span>{' '}
              Platform
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A comprehensive coding time tracking and analytics platform that helps developers monitor their productivity, 
              track coding patterns, and optimize their workflow with real-time VS Code integration.
            </p>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Tracking'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VS Code Extension Section */}
      <section className="py-16 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">VS Code Extension</h2>
            </div>
            <p className="text-lg text-gray-300">
              Seamlessly track your coding sessions with our powerful VS Code extension.
            </p>
          </div>

          {/* Extension Features */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Real-time tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Status bar integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Token-based authentication</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Automatic data sync</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Language usage tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">File change monitoring</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Download Extension
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Features */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Platform Features</h2>
              <p className="text-xl text-gray-300 mb-12">
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
                      <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center border border-${feature.color}-500/30`}>
                        <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs border-white/20 text-white">{feature.number}</Badge>
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      </div>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 shadow-lg">
                    <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Plan
                </span>
                <Star className="absolute -top-2 -right-6 w-6 h-6 text-purple-400" />
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 ${plan.popular ? 'border-purple-500/50' : 'border-white/20'} hover:shadow-2xl transition-all duration-300 cursor-pointer relative`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400 bg-purple-500/10">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-400">{plan.dataRetention} data retention</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline"
                    className={`w-full ${plan.popular ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10' : 'border-white/20 text-white hover:bg-white/10'}`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;