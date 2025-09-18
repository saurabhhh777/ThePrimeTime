import { motion } from 'framer-motion';
import { Star, ArrowRight, BarChart3, Clock, Users, Github, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setCurrentUser] = useState<any>(null);
  const [githubStars, setGithubStars] = useState<number | null>(null);

  useEffect(() => {
    checkAuthStatus();
    fetchGithubStars();
  }, []);

  const fetchGithubStars = async () => {
    try {
      // Simple local cache to avoid frequent API calls
      const cacheKey = 'primetime_github_stars_cache_v1';
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
          setGithubStars(parsed.stars);
          return;
        }
      }

      const res = await fetch('https://api.github.com/repos/saurabhhh777/ThePrimeTime');
      if (!res.ok) throw new Error('Failed to fetch GitHub stars');
      const data = await res.json();
      const stars = Number(data?.stargazers_count ?? 0);
      setGithubStars(stars);
      localStorage.setItem(
        'primetime_github_stars_cache_v1',
        JSON.stringify({ stars, expiresAt: Date.now() + 1000 * 60 * 10 }) // cache 10 minutes
      );
    } catch (e) {
      console.error('Error fetching GitHub stars:', e);
      setGithubStars(null);
    }
  };

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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/android-chrome-192x192.png" alt="PrimeTime logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-semibold">PrimeTime</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#company" className="text-gray-300 hover:text-white transition-colors text-sm">
                Company
              </a>
              <a href="#resources" className="text-gray-300 hover:text-white transition-colors text-sm">
                Resources
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <a href="#privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                Privacy
              </a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/saurabhhh777/ThePrimeTime"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center space-x-2 text-sm text-gray-400 hover:text-white"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{githubStars !== null ? githubStars.toLocaleString() : '—'}</span>
              </a>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    onClick={handleDashboard}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleJoinWaitlist}
                  className="bg-white text-black hover:bg-gray-200 font-medium"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              AI Powered Coding Analytics,
              <br />
              <span className="text-gray-400">Built to Save You Time</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              PrimeTime is an AI-native coding analytics platform that tracks your development workflow, 
              so you don't have to.
            </p>

            <div className="text-gray-500 mb-12">
              No credit card required.
            </div>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">
                <span className="mr-2">🔥</span>
                Backed by Saurabh
              </Badge>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
                className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-4 text-lg"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Tracking Free'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden"
          >
            {/* Mock Analytics Dashboard */}
            <div className="bg-gray-900 p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-400">PrimeTime Analytics Dashboard</div>
              </div>
            </div>

            <div className="p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Coding Analytics Dashboard</h3>
                  <p className="text-gray-400">Track your development productivity and insights</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    <Play className="w-4 h-4 mr-2" />
                    Live Session
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Today's Coding Time", value: "6h 23m", change: "+12%", color: "text-green-400" },
                  { label: "Active Projects", value: "8", change: "+2", color: "text-blue-400" },
                  { label: "Languages Used", value: "5", change: "TypeScript, Python", color: "text-purple-400" },
                  { label: "Weekly Average", value: "42h 15m", change: "+8%", color: "text-orange-400" }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className={`text-sm ${stat.color}`}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Mock Chart Area */}
              <div className="bg-gray-800/30 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Weekly Coding Activity</h4>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">Coding Time</span>
                  </div>
                </div>
                <div className="h-48 flex items-end space-x-2">
                  {[40, 65, 45, 80, 55, 75, 60].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Top Languages</h4>
                  <div className="space-y-3">
                    {[
                      { name: "TypeScript", time: "2h 45m", percentage: 65 },
                      { name: "Python", time: "1h 30m", percentage: 35 },
                      { name: "JavaScript", time: "45m", percentage: 20 }
                    ].map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{lang.name}</span>
                        </div>
                        <div className="text-sm text-gray-400">{lang.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Active Projects</h4>
                  <div className="space-y-3">
                    {[
                      { name: "E-commerce Platform", status: "In Progress", files: 23 },
                      { name: "Analytics Dashboard", status: "Review", files: 12 },
                      { name: "Mobile App", status: "Planning", files: 8 }
                    ].map((project, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{project.name}</div>
                          <div className="text-xs text-gray-400">{project.files} files</div>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to track your coding journey
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive analytics, real-time tracking, and insights to help you become a more productive developer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Real-time Tracking",
                description: "Automatic time tracking with VS Code integration. Monitor your coding sessions without any manual effort."
              },
              {
                icon: BarChart3,
                title: "Detailed Analytics",
                description: "Get insights into your productivity patterns, language usage, and project progress with beautiful visualizations."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share insights with your team, compare productivity metrics, and collaborate on coding goals."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to optimize your coding workflow?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already tracking their productivity with PrimeTime.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                onClick={isLoggedIn ? handleDashboard : handleJoinWaitlist}
                className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-4"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="border-gray-700 text-white hover:bg-gray-800 px-8 py-4"
              >
                View Demo
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/android-chrome-192x192.png" alt="PrimeTime logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-semibold">PrimeTime</span>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <a href="#github" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2025 PrimeTime Analytics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;