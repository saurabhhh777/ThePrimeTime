import { motion } from 'framer-motion';
import { Clock, BarChart2, Code2, Globe, Github, Instagram, Linkedin, Twitter, Copyright, Zap, Target, TrendingUp } from 'lucide-react';

const Home = () => {
  const text = "The Prime Time".split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-900/50 to-slate-900/80 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="z-10 text-center px-4">
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white flex overflow-hidden justify-center mb-8"
            style={{ fontFamily: 'Inter, sans-serif' }}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {text.map((letter, index) => (
              <motion.span
                key={index}
                variants={child}
                className="inline-block hover:text-purple-400 transition-colors duration-300"
                whileHover={{
                  scale: 1.2,
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 0.3
                  }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          <motion.span 
            className='text-xl md:text-2xl lg:text-3xl text-gray-300 font-light block mb-8'
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Track Your Coding Time, Boost Your Productivity
          </motion.span>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Install VS Code Extension
          </motion.button>
        </div>
      </div>

      {/* Features Section */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <motion.div 
          className='bg-white/10 backdrop-blur-sm p-12 lg:p-16 flex items-center justify-center'
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Track Everything
            </h2>
            <div className="space-y-6 text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock size={24} className="text-blue-400" />
                </div>
                <p className="font-medium">Monitor time spent per file and project</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Code2 size={24} className="text-green-400" />
                </div>
                <p className="font-medium">Track usage across different programming languages</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart2 size={24} className="text-purple-400" />
                </div>
                <p className="font-medium">Daily and weekly coding analytics</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Globe size={24} className="text-orange-400" />
                </div>
                <p className="font-medium">Website time tracking integration</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          className='bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm p-12 lg:p-16 flex items-center justify-center'
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Key Features
            </h2>
            <div className="space-y-4 text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div className="flex items-center gap-3">
                <Zap className="text-yellow-400" size={20} />
                <p className="font-medium">Real-time tracking in VS Code</p>
              </div>
              <div className="flex items-center gap-3">
                <Target className="text-green-400" size={20} />
                <p className="font-medium">Detailed time analytics dashboard</p>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-400" size={20} />
                <p className="font-medium">Language-wise time distribution</p>
              </div>
              <div className="flex items-center gap-3">
                <Code2 className="text-purple-400" size={20} />
                <p className="font-medium">Project-based time tracking</p>
              </div>
              <div className="flex items-center gap-3">
                <BarChart2 className="text-orange-400" size={20} />
                <p className="font-medium">Daily productivity insights</p>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="text-red-400" size={20} />
                <p className="font-medium">Website usage monitoring</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Preview Section */}
      <div className='min-h-screen bg-gradient-to-br from-slate-800/50 to-purple-800/50 backdrop-blur-sm p-12'>
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-12 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Analytics Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Time Analytics", 
                desc: "View detailed breakdowns of your coding time across projects and files",
                icon: Clock,
                color: "blue"
              },
              { 
                title: "Language Stats", 
                desc: "Track time spent in different programming languages and frameworks",
                icon: Code2,
                color: "green"
              },
              { 
                title: "Productivity Insights", 
                desc: "Get insights about your most productive coding hours and patterns",
                icon: TrendingUp,
                color: "purple"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`h-48 bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 flex items-center justify-center`}>
                  <feature.icon className={`h-16 w-16 text-${feature.color}-400`} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer className="bg-slate-900/80 backdrop-blur-sm py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <a href="https://github.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/saurabh-maurya-92b727245/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
              <Linkedin size={24} />
            </a>
            <a href="https://www.instagram.com/asksaurabhhh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
              <Instagram size={24} />
            </a>
            <a href="https://x.com/saurabhhh777" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
              <Twitter size={24} />
            </a>
          </div>

          <div className="flex items-center text-gray-400 gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Copyright size={16} />
            <span>Copyright 2025 Prime Time. All rights reserved.</span>
          </div>

          <div 
            className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            onClick={() => window.open("https://www.asksaurabh.xyz/")}
          >
            <span>Developed by</span>
            <img className='w-8 h-8 rounded-full' src="https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp" alt="Developer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;