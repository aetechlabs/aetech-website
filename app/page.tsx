'use client';

import Navigation from "./components/Navigation";
import ContactForm from "./components/ContactForm";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import BootcampBanner from "@/components/BootcampBanner";
import DynamicBanner from "@/components/DynamicBanner";
import ClientOnlyBanner from "@/components/ClientOnlyBanner";
import FloatingBootcampButton from "@/components/FloatingBootcampButton";
import FloatingSponsorButton from "@/components/FloatingSponsorButton";
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
      {/* Top Announcement Banners */}
      <ClientOnlyBanner type="TOP_ANNOUNCEMENT" position="top" />
      
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* Video Background */}
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
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
          {/* Floating Particles */}
          <FloatingParticles count={30} className="text-white/30" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Image
                src="/assets/Light transparent logo.png"
                alt="AETech Research Labs Limited"
                width={400}
                height={120}
                className="mx-auto h-20 w-auto"
              />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
            >
              <span className="text-red-400">AETech</span> Research Labs Limited
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto"
            >
                Engineering Tomorrow's Solutions
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg mb-12 text-gray-300 max-w-4xl mx-auto"
            >
              Innovation-driven technology company committed to researching, developing, and deploying advanced solutions across software engineering, artificial intelligence, data systems, and integrated technologies.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('services')}
                className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Our Services
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="border border-red-400 text-red-400 hover:bg-red-400/20 px-8 py-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
              >
                Get in Touch
              </motion.button>
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
      <section id="services" className="relative py-20 bg-white dark:bg-gray-900">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="services-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#services-grid)" className="text-gray-900 dark:text-gray-100" />
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Service Offerings
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive technology solutions designed to drive innovation and growth
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Core Development Services */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">💻</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Development Services</h3>
                  <p className="text-[#c1272d] font-semibold">Building Digital Solutions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Software Development</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Custom web applications, mobile apps, and enterprise software solutions tailored to your specific business needs.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">React</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Next.js</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Node.js</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI & Machine Learning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Intelligent automation systems, predictive analytics, and machine learning models to optimize operations.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">Python</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">TensorFlow</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">PyTorch</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Systems & Engineering</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scalable data infrastructures, database design, data pipelines, and analytics integrations.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">SQL</span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">MongoDB</span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">AWS</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Consulting & Strategic Services */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 bg-[#c1272d] rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Consulting Services</h3>
                  <p className="text-[#c1272d] font-semibold">Strategic Technology Advisory</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">IT Consulting & Systems Integration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Strategic technology advisory, architecture design, and seamless system integrations.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">Strategy</span>
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">Integration</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Technology Advisory for Startups</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Technical strategy, product design, MVP development, and scaling plans for startup growth.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">MVP</span>
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">Scaling</span>
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">Strategy</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Training & Capacity Building</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hands-on workshops, bootcamps, and custom training programs for future-ready tech skills.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">Workshops</span>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">Bootcamps</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Research & Development Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#c1272d] rounded-xl p-8 shadow-lg text-white"
          >
            <div className="text-center mb-8">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-[#c1272d] text-2xl">🔬</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">Research & Development</h3>
              <p className="text-red-100">Innovative solutions for tomorrow's challenges</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="font-semibold">Sustainable Tech Solutions</span>
                </div>
                <p className="text-sm text-red-100">
                  Green technology innovations focused on environmental sustainability and energy efficiency.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <span className="font-semibold">African Market Solutions</span>
                </div>
                <p className="text-sm text-red-100">
                  Technology solutions designed specifically for African markets and unique regional challenges.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="font-semibold">Emerging Technologies</span>
                </div>
                <p className="text-sm text-red-100">
                  Research into blockchain, IoT, AR/VR, and other cutting-edge technologies for future applications.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="bg-white text-[#c1272d] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Start Your Project
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Ready to transform your business with cutting-edge technology solutions?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-red-400 dark:text-red-400">Company Details</h4>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p><strong>AETech Research Labs Limited</strong></p>
                    <p>Advanced Engineering Technology Research Labs Limited</p>
                    <p>Company Registration Number: <span className="font-mono">RC 8627078</span></p>
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-red-400 dark:text-red-400">Why Choose AETech?</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Expert team with proven track record</li>
                    <li>• Cutting-edge technology solutions</li>
                    <li>• Focus on African and global markets</li>
                    <li>• End-to-end project support</li>
                    <li>• Sustainable and scalable solutions</li>
                  </ul>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* Footer */}
      <Footer />

      {/* Dynamic Banners - Replaces static BootcampBanner */}
      <ClientOnlyBanner type="BOOTCAMP" delay={3000} autoShow={true} />
      <ClientOnlyBanner type="URGENCY" delay={5000} autoShow={true} />
      <ClientOnlyBanner type="GENERAL" delay={7000} autoShow={true} />
      
      {/* Floating Bootcamp Button - Shows after 5 seconds */}
      <FloatingBootcampButton />
      
      {/* Floating Sponsor Button - Shows after 8 seconds */}
      <FloatingSponsorButton />
    </div>
  );
}
