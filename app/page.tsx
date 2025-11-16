'use client';

import ContactForm from "./components/ContactForm";
import FloatingParticles from "@/components/FloatingParticles";
import SponsorsSection from "@/components/SponsorsSection";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CodeBracketIcon, 
  ComputerDesktopIcon, 
  CircleStackIcon, 
  CloudIcon, 
  ShieldCheckIcon, 
  BookOpenIcon,
  BeakerIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Video Background with Enhanced Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/person-typing-keyboard.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for modern look */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-red-900/30"></div>
          {/* Floating Particles */}
          <FloatingParticles count={30} className="text-white/20" />
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
                className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-red-100 dark:hover:bg-red-900/40 w-full sm:w-auto"
              >
                Explore Our Services →
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
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-400 transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-500 rounded-xl p-3 mr-4">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Our Vision</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                To become Africa's leading technology innovation hub, creating transformative solutions that 
                empower businesses, advance industries, and improve lives across the continent and beyond.
              </p>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-red-500 rounded-lg p-2 mr-3">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Our Mission</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To research, develop, and deploy cutting-edge technology solutions that solve real-world problems, 
                  accelerate digital transformation, and create sustainable value for our clients and communities.
                </p>
              </div>
            </motion.div>

            {/* Company Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-400 transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-500 rounded-xl p-3 mr-4">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Overview</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className="flex items-start mb-3">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 mr-3">
                      <ShieldCheckIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Established Excellence</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Registered as Advanced Engineering Technology Research Labs Limited (RC 8627078), 
                        we operate at the forefront of technological innovation with proven expertise.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className="flex items-start mb-3">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 mr-3">
                      <BeakerIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Research & Innovation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pioneering breakthroughs in AI, machine learning, data engineering, and emerging technologies 
                        with practical applications across diverse industries.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className="flex items-start mb-3">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 mr-3">
                      <GlobeAltIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Pan-African Impact</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Building scalable solutions that address unique African challenges while maintaining 
                        global standards for sustainability, accessibility, and social impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose AETech - Modern Design */}
      <section className="relative py-24 bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              Why <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Choose AETech</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We combine cutting-edge technology with deep industry expertise to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CodeBracketIcon className="w-8 h-8" />,
                title: 'Expert Team',
                description: 'Skilled professionals with proven track records in cutting-edge technologies',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: <ShieldCheckIcon className="w-8 h-8" />,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security and 99.9% uptime guarantee for all solutions',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: <CloudIcon className="w-8 h-8" />,
                title: 'Scalable Solutions',
                description: 'Future-proof architecture that grows seamlessly with your business',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: 'Innovation Driven',
                description: 'Leveraging AI and emerging tech to keep you ahead of the curve',
                color: 'from-red-500 to-red-600'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-400"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise - Modern Grid Section */}
      <section className="relative py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Expertise</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive technology capabilities across development, training, and innovation
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Technical Stack */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-400 transition-all shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mr-4">
                  <CodeBracketIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Technical Stack</h3>
                  <p className="text-red-600 dark:text-red-400 font-semibold">Modern Development Tools</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Web Development', tech: 'React, Next.js, Node.js', time: '2-6 weeks', color: 'text-blue-600 dark:text-blue-400' },
                  { name: 'Mobile Apps', tech: 'React Native, Flutter', time: '3-8 weeks', color: 'text-purple-600 dark:text-purple-400' },
                  { name: 'AI Solutions', tech: 'Python, TensorFlow, PyTorch', time: '4-12 weeks', color: 'text-green-600 dark:text-green-400' },
                  { name: 'Data Analytics', tech: 'SQL, Python, Power BI', time: '2-4 weeks', color: 'text-orange-600 dark:text-orange-400' },
                  { name: 'Cloud Solutions', tech: 'AWS, Azure, GCP', time: '1-3 weeks', color: 'text-cyan-600 dark:text-cyan-400' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{item.name}</h4>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.tech}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Training Programs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-400 transition-all shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mr-4">
                  <BookOpenIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Training Programs</h3>
                  <p className="text-red-600 dark:text-red-400 font-semibold">Skill Building Excellence</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'DevStars Bootcamp', duration: '3 weeks', level: 'Beginner', color: 'text-green-600 dark:text-green-400' },
                  { name: 'Corporate Training', duration: '1-4 weeks', level: 'Intermediate', color: 'text-blue-600 dark:text-blue-400' },
                  { name: 'Tech Workshops', duration: '1-3 days', level: 'All Levels', color: 'text-yellow-600 dark:text-yellow-400' },
                  { name: 'Mentorship', duration: '3-6 months', level: 'Advanced', color: 'text-purple-600 dark:text-purple-400' },
                  { name: 'Certification Prep', duration: '2-8 weeks', level: 'Professional', color: 'text-orange-600 dark:text-orange-400' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{item.name}</h4>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                        {item.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.duration}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Research & Innovation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border-2 border-red-200 dark:border-red-900/50 shadow-lg"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mr-4">
                <BeakerIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Research & Innovation</h3>
                <p className="text-gray-600 dark:text-gray-400">Pioneering breakthrough solutions</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: <GlobeAltIcon className="w-6 h-6" />,
                  title: 'AI for Agriculture',
                  desc: 'Smart farming solutions',
                  detail: 'Precision agriculture using ML & IoT',
                  color: 'from-green-500 to-green-600'
                },
                { 
                  icon: <CurrencyDollarIcon className="w-6 h-6" />,
                  title: 'FinTech Innovation',
                  desc: 'Digital payment systems',
                  detail: 'Blockchain for financial inclusion',
                  color: 'from-blue-500 to-blue-600'
                },
                { 
                  icon: <BookOpenIcon className="w-6 h-6" />,
                  title: 'EdTech Platforms',
                  desc: 'Learning management systems',
                  detail: 'Interactive remote education',
                  color: 'from-purple-500 to-purple-600'
                }
              ].map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${project.color} text-white mb-4`}>
                    {project.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.desc}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{project.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
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
                icon: <CodeBracketIcon className="w-8 h-8" />,
                title: 'Software Development',
                description: 'Custom web and mobile applications built with cutting-edge technologies',
                features: ['Web Applications', 'Mobile Apps', 'Enterprise Software', 'API Development']
              },
              {
                icon: <ComputerDesktopIcon className="w-8 h-8" />,
                title: 'AI & Machine Learning',
                description: 'Intelligent systems that automate processes and deliver insights',
                features: ['Predictive Analytics', 'Computer Vision', 'NLP Solutions', 'ML Models']
              },
              {
                icon: <CircleStackIcon className="w-8 h-8" />,
                title: 'Data Engineering',
                description: 'Scalable data infrastructure and analytics solutions',
                features: ['Data Pipelines', 'Database Design', 'Data Warehousing', 'Analytics']
              },
              {
                icon: <CloudIcon className="w-8 h-8" />,
                title: 'Cloud Solutions',
                description: 'Cloud-native architectures and DevOps excellence',
                features: ['Cloud Migration', 'DevOps Setup', 'CI/CD Pipelines', 'Infrastructure']
              },
              {
                icon: <ShieldCheckIcon className="w-8 h-8" />,
                title: 'IT Consulting',
                description: 'Strategic technology advisory and system integration',
                features: ['Tech Strategy', 'System Integration', 'Digital Transformation', 'Architecture']
              },
              {
                icon: <BookOpenIcon className="w-8 h-8" />,
                title: 'Training & Workshops',
                description: 'Hands-on technical training and capacity building programs',
                features: ['Bootcamps', 'Corporate Training', 'Tech Workshops', 'Mentorship']
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-red-400 dark:hover:border-red-400 transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-red-600 dark:text-red-400">
                  {service.icon}
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
                      <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => scrollToSection('contact')}
                  className="inline-block bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Get Started →
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* R&D Highlight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-10 shadow-xl relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                  <pattern id="rd-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="currentColor" className="text-red-500"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#rd-grid)" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-block bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4">
                <BeakerIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Research & Development</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
                Pioneering innovative solutions in AI for Agriculture, FinTech Innovation, and EdTech Platforms
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { 
                    icon: <GlobeAltIcon className="w-8 h-8" />,
                    color: 'text-green-600 dark:text-green-400',
                    title: 'AI for Agriculture', 
                    desc: 'Smart farming solutions' 
                  },
                  { 
                    icon: <CurrencyDollarIcon className="w-8 h-8" />,
                    color: 'text-blue-600 dark:text-blue-400',
                    title: 'FinTech Innovation', 
                    desc: 'Digital payment systems' 
                  },
                  { 
                    icon: <BookOpenIcon className="w-8 h-8" />,
                    color: 'text-purple-600 dark:text-purple-400',
                    title: 'EdTech Platforms', 
                    desc: 'Learning management systems' 
                  }
                ].map((project) => (
                  <div key={project.title} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-red-400 dark:hover:border-red-400 transition-all">
                    <div className={`flex justify-center mb-3 ${project.color}`}>{project.icon}</div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.desc}</p>
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
              <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-red-400 dark:hover:border-red-400 transition-all">
                <div className="flex items-center mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mr-4">
                    <BuildingOfficeIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
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
              <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-red-400 dark:hover:border-red-400 transition-all">
                <div className="flex items-center mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mr-4">
                    <SparklesIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Why Choose AETech?</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Expert team with proven track record',
                    'Cutting-edge technology solutions',
                    'Focus on African and global markets',
                    'End-to-end project support',
                    'Sustainable and scalable solutions'
                  ].map((item) => (
                    <li key={item} className="flex items-start text-gray-700 dark:text-gray-300">
                      <CheckCircleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Contact Info */}
              <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-red-400 dark:hover:border-red-400 transition-all">
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
    </div>
  );
}
