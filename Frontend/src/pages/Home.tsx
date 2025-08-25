import { motion } from 'framer-motion';
import { Star, ArrowRight, Code2, BarChart2, Activity, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Footer from '../components/ui/footer';

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
                <Button 
                  variant="default"
                  onClick={handleDashboard}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="default"
                  onClick={handleJoinWaitlist}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="gradient"
                onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
                className="px-8 py-4 text-lg"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Tracking'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
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
          <Card className="shadow-lg">
            <CardContent className="p-6">
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
                <Button variant="default" size="lg">
                  Download Extension
                </Button>
              </div>
            </CardContent>
          </Card>
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
                        <Badge variant="secondary" className="text-xs">{feature.number}</Badge>
                        <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600">{feature.description}</p>
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
                  variant="gradient"
                  onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
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
                  <Card className="text-center shadow-sm border border-gray-100">
                    <CardContent className="p-6">
                      <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                        {stat.number}
                      </div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`relative ${plan.popular ? 'border-purple-500 border-2' : ''} hover:shadow-lg transition-all duration-300 cursor-pointer`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="success" className="text-xs">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <CardDescription>{plan.dataRetention} data retention</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={plan.popular ? "gradient" : "default"}
                      className="w-full"
                    >
                      {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
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