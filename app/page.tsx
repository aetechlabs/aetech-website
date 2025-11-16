'use client';

import Navigation from "./components/Navigation";
import ContactForm from "./components/ContactForm";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import SponsorsSection from "@/components/SponsorsSection";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black text-black dark:text-white">
      
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* Video Background with Enhanced Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/person-typing-keyboard.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for modern look */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-red-900/50 dark:from-black/80 dark:via-black/70 dark:to-red-900/60"></div>
          {/* Floating Particles */}
          <FloatingParticles count={30} className="text-white/30" />
        </div>
        
        {/* Content with Modern Design */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo with Glow Effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-2xl bg-red-400/30 rounded-full"></div>
                <Image
                  src="/assets/Light transparent logo.png"
                  alt="AETech Research Labs Limited"
                  width={400}
                  height={120}
                  className="relative mx-auto h-24 w-auto"
                />
              </div>
            </motion.div>

            {/* Modern Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight"
            >
              Engineering Tomorrow&apos;s
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Solutions Today
              </span>
            </motion.h1>

            {/* Subtitle with Better Typography */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl md:text-2xl mb-12 text-gray-100 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Innovation-driven technology company delivering advanced solutions in 
              <span className="text-red-300 font-medium"> AI</span>,
              <span className="text-red-300 font-medium"> Software Engineering</span>, and
              <span className="text-red-300 font-medium"> Data Systems</span>
            </motion.p>

            {/* Modern CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('services')}
                className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto"
              >
                <span className="relative z-10">Explore Our Services</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
              >
                Get in Touch
              </motion.button>
            </motion.div>

            {/* Stats/Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { label: 'Solutions Delivered', value: '50+' },
                { label: 'Enterprise Clients', value: '20+' },
                { label: 'Research Projects', value: '15+' },
                { label: 'Innovation Awards', value: '5+' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
                >
                  <div className="text-3xl font-bold text-red-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 bg-gray-50 dark:bg-gray-800">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="about-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" className="text-gray-900 dark:text-gray-100" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">About AETech</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Advanced Engineering Technology Research Labs Limited is a cutting-edge technology company dedicated to 
              delivering high-impact products and services that empower businesses, accelerate growth, and transform society 
              through innovative technological solutions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Vision & Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🌟</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Our Vision</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                To become a leading force in technological innovation, creating impactful solutions that transform 
                industries and empower communities across Africa and the world.
              </p>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-6 bg-blue-500 rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Our Mission</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  To research, develop, and deploy advanced technologies that solve real-world problems, 
                  drive business growth, and shape the future of digital transformation.
                </p>
              </div>
            </motion.div>

            {/* Company Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🏢</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Overview</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-[#c1272d]">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Established Excellence</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registered as Advanced Engineering Technology Research Labs Limited (RC 8627078), 
                    we operate at the forefront of technological innovation.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Research Focus</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Specializing in AI, machine learning, data systems, and emerging technologies 
                    with applications across various industries.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Global Impact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Creating solutions that address challenges in African and global markets 
                    with focus on sustainability and social impact.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do at AETech
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: "💡",
                title: "Innovation",
                subtitle: "Creative Problem Solving",
                description: "We push boundaries and challenge conventional thinking to develop groundbreaking solutions that address complex technological challenges.",
                color: "bg-yellow-500"
              },
              {
                icon: "🤝",
                title: "Integrity",
                subtitle: "Ethical Excellence",
                description: "We uphold the highest standards of honesty, transparency, and ethical conduct in all our relationships and business practices.",
                color: "bg-blue-500"
              },
              {
                icon: "🎯",
                title: "Excellence",
                subtitle: "Quality Commitment",
                description: "We pursue perfection in research, engineering, and delivery, ensuring every solution meets the highest standards of quality and performance.",
                color: "bg-green-500"
              },
              {
                icon: "🌍",
                title: "Collaboration",
                subtitle: "Collective Success",
                description: "We believe in the power of teamwork, building strong partnerships and fostering collaborative environments to achieve impactful results.",
                color: "bg-purple-500"
              },
              {
                icon: "🚀",
                title: "Impact",
                subtitle: "Meaningful Change",
                description: "We create solutions that make a real difference, positively transforming businesses, communities, and society as a whole.",
                color: "bg-[#c1272d]"
              },
              {
                icon: "🔬",
                title: "Research",
                subtitle: "Continuous Learning",
                description: "We invest in ongoing research and development, staying at the cutting edge of technology and constantly expanding our knowledge base.",
                color: "bg-indigo-500"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-center mb-6">
                  <div className={`${value.color} rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value.title}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{value.subtitle}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Why Choose AETech */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-[#c1272d] rounded-xl p-8 shadow-lg text-white"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Why Choose AETech?</h3>
              <p className="text-red-100 text-lg">We combine technical expertise with a deep understanding of business needs</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <span className="text-3xl">⚡</span>
                </div>
                <h4 className="font-semibold mb-2">Rapid Development</h4>
                <p className="text-sm text-red-100">Fast, efficient delivery without compromising quality</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h4 className="font-semibold mb-2">Secure Solutions</h4>
                <p className="text-sm text-red-100">Enterprise-grade security built into every solution</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <span className="text-3xl">📈</span>
                </div>
                <h4 className="font-semibold mb-2">Scalable Systems</h4>
                <p className="text-sm text-red-100">Future-proof solutions that grow with your business</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <span className="text-3xl">🎓</span>
                </div>
                <h4 className="font-semibold mb-2">Expert Team</h4>
                <p className="text-sm text-red-100">Skilled professionals with proven track records</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Expertise Grid Section */}
      <section className="relative py-20 bg-gray-50 dark:bg-gray-800">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="expertise-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#expertise-grid)" className="text-gray-900 dark:text-gray-100" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Expertise
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive technology solutions that drive innovation and growth
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Technology Solutions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🚀</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Technology Solutions</h3>
                  <p className="text-[#c1272d] font-semibold">Development & Innovation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                  <span>Service</span>
                  <span>Technology</span>
                  <span>Delivery</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Web Development</span>
                  <span className="text-gray-600 dark:text-gray-400">React, Next.js, Node.js</span>
                  <span className="text-blue-600 dark:text-blue-400">2-6 weeks</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Mobile Apps</span>
                  <span className="text-gray-600 dark:text-gray-400">React Native, Flutter</span>
                  <span className="text-blue-600 dark:text-blue-400">3-8 weeks</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">AI Solutions</span>
                  <span className="text-gray-600 dark:text-gray-400">Python, TensorFlow, PyTorch</span>
                  <span className="text-green-600 dark:text-green-400">4-12 weeks</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Data Analytics</span>
                  <span className="text-gray-600 dark:text-gray-400">SQL, Python, Power BI</span>
                  <span className="text-orange-600 dark:text-orange-400">2-4 weeks</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Cloud Solutions</span>
                  <span className="text-gray-600 dark:text-gray-400">AWS, Azure, GCP</span>
                  <span className="text-purple-600 dark:text-purple-400">1-3 weeks</span>
                </div>
              </div>
            </motion.div>

            {/* Training & Development */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🎓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Training & Development</h3>
                  <p className="text-[#c1272d] font-semibold">Skill Building Programs</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                  <span>Program</span>
                  <span>Duration</span>
                  <span>Level</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">DevStars Bootcamp</span>
                  <span className="text-gray-600 dark:text-gray-400">3 weeks</span>
                  <span className="text-green-600 dark:text-green-400">Beginner</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Corporate Training</span>
                  <span className="text-gray-600 dark:text-gray-400">1-4 weeks</span>
                  <span className="text-blue-600 dark:text-blue-400">Intermediate</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Tech Workshops</span>
                  <span className="text-gray-600 dark:text-gray-400">1-3 days</span>
                  <span className="text-yellow-600 dark:text-yellow-400">All Levels</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Mentorship</span>
                  <span className="text-gray-600 dark:text-gray-400">3-6 months</span>
                  <span className="text-purple-600 dark:text-purple-400">Advanced</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm py-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Certification Prep</span>
                  <span className="text-gray-600 dark:text-gray-400">2-8 weeks</span>
                  <span className="text-orange-600 dark:text-orange-400">Professional</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Research & Innovation Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🔬</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Research & Innovation</h3>
                <p className="text-gray-600 dark:text-gray-400">Cutting-edge projects and breakthrough solutions</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">AI for Agriculture</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Smart farming solutions</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Precision agriculture using machine learning and IoT sensors</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">FinTech Innovation</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Digital payment systems</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Blockchain-based solutions for financial inclusion</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">EdTech Platforms</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Learning management systems</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Interactive platforms for remote and hybrid education</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-24 bg-white dark:bg-gray-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Our <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive technology solutions designed to drive innovation and accelerate business growth
            </p>
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '💻',
                title: 'Software Development',
                description: 'Custom web and mobile applications built with cutting-edge technologies',
                features: ['Web Applications', 'Mobile Apps', 'Enterprise Software', 'API Development'],
                gradient: 'from-blue-500 to-cyan-500',
                iconBg: 'bg-blue-500'
              },
              {
                icon: '🤖',
                title: 'AI & Machine Learning',
                description: 'Intelligent systems that automate processes and deliver insights',
                features: ['Predictive Analytics', 'Computer Vision', 'NLP Solutions', 'ML Models'],
                gradient: 'from-green-500 to-emerald-500',
                iconBg: 'bg-green-500'
              },
              {
                icon: '📊',
                title: 'Data Engineering',
                description: 'Scalable data infrastructure and analytics solutions',
                features: ['Data Pipelines', 'Database Design', 'Data Warehousing', 'Analytics'],
                gradient: 'from-purple-500 to-pink-500',
                iconBg: 'bg-purple-500'
              },
              {
                icon: '☁️',
                title: 'Cloud Solutions',
                description: 'Cloud-native architectures and DevOps excellence',
                features: ['Cloud Migration', 'DevOps Setup', 'CI/CD Pipelines', 'Infrastructure'],
                gradient: 'from-orange-500 to-amber-500',
                iconBg: 'bg-orange-500'
              },
              {
                icon: '🎯',
                title: 'IT Consulting',
                description: 'Strategic technology advisory and system integration',
                features: ['Tech Strategy', 'System Integration', 'Digital Transformation', 'Architecture'],
                gradient: 'from-red-500 to-rose-500',
                iconBg: 'bg-red-500'
              },
              {
                icon: '🎓',
                title: 'Training & Workshops',
                description: 'Hands-on technical training and capacity building programs',
                features: ['Bootcamps', 'Corporate Training', 'Tech Workshops', 'Mentorship'],
                gradient: 'from-indigo-500 to-blue-500',
                iconBg: 'bg-indigo-500'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon */}
                <div className={`${service.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => scrollToSection('contact')}
                  className="text-red-600 dark:text-red-400 font-semibold text-sm flex items-center group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors"
                >
                  Get Started
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>

                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </div>

          {/* R&D Highlight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-10 shadow-xl text-white relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                  <pattern id="rd-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#rd-grid)" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-block bg-white/20 rounded-full p-4 mb-4">
                <span className="text-4xl">🔬</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Research & Development</h3>
              <p className="text-red-100 text-lg mb-8 max-w-3xl mx-auto">
                Pioneering innovative solutions in AI for Agriculture, FinTech Innovation, and EdTech Platforms
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: '🌾', title: 'AI for Agriculture', desc: 'Smart farming solutions' },
                  { icon: '💰', title: 'FinTech Innovation', desc: 'Digital payment systems' },
                  { icon: '📚', title: 'EdTech Platforms', desc: 'Learning management systems' }
                ].map((project) => (
                  <div key={project.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-3xl mb-3">{project.icon}</div>
                    <h4 className="font-bold mb-2">{project.title}</h4>
                    <p className="text-sm text-red-100">{project.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="contact-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-red-500"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              Let&apos;s <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Ready to transform your business with cutting-edge technology solutions? Get in touch with our team today.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Company Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="bg-red-500 rounded-xl p-3 mr-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Details</h3>
                    <p className="text-red-500 font-semibold">Registered & Certified</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">AETech Research Labs Limited</p>
                  <p>Advanced Engineering Technology Research Labs Limited</p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Company Registration Number</p>
                    <p className="font-mono font-bold text-red-500">RC 8627078</p>
                  </div>
                </div>
              </div>

              {/* Why Choose AETech Card */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 rounded-xl p-3 mr-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold">Why Choose AETech?</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Expert team with proven track record',
                    'Cutting-edge technology solutions',
                    'Focus on African and global markets',
                    'End-to-end project support',
                    'Sustainable and scalable solutions'
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Quick Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mr-4">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email Us</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">info@aetech.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mr-4">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Sponsors Section */}
      <SponsorsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
