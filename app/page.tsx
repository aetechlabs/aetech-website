'use client';

import Navigation from "./components/Navigation";
import ContactForm from "./components/ContactForm";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import BootcampBanner from "@/components/BootcampBanner";
import FloatingBootcampButton from "@/components/FloatingBootcampButton";
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
      <section id="about" className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About AETech</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We deliver high-impact products and services designed to empower businesses, accelerate growth, and transform society.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-red-400 dark:text-red-400">🌟 Vision</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To become a leading force in technological innovation, creating impactful solutions that transform industries and empower communities across Africa and the world.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-red-400 dark:text-red-400">🎯 Mission</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our mission is to research, develop, and deploy advanced technologies that solve real-world problems, drive business growth, and shape the future of digital transformation.
              </p>
            </div>
          </div>

          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-8">💡 Core Values</h3>
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { title: "Innovation", desc: "Solving complex problems through creativity and technology" },
                { title: "Integrity", desc: "Upholding honesty, transparency, and ethical standards" },
                { title: "Excellence", desc: "Pursuing the highest standards in research, engineering, and delivery" },
                { title: "Collaboration", desc: "Building strong teams and partnerships to achieve impactful results" },
                { title: "Impact", desc: "Creating solutions that positively transform businesses and society" }
              ].map((value, index) => (
                <div key={value.title} className="text-center group">
                  <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4 transform group-hover:scale-110 transition-all duration-300">
                    <h4 className="font-semibold text-red-400 dark:text-red-400">{value.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-20 overflow-hidden">
        {/* Subtle Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-10"
          >
            <source src="/videos/person-typing-keyboard.mp4" type="video/mp4" />
          </video>
          {/* Light overlay */}
          <div className="absolute inset-0 bg-gray-50/95 dark:bg-gray-900/95"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">🔷 Service Offerings</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive technology solutions designed to drive innovation and growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Software Development",
                desc: "Design, development, and deployment of robust web applications, mobile apps, and enterprise software solutions tailored to client needs."
              },
              {
                title: "Artificial Intelligence Solutions", 
                desc: "Development of machine learning models, data analytics platforms, and intelligent automation systems to optimise business operations."
              },
              {
                title: "Data Systems & Engineering",
                desc: "Designing and implementing secure, scalable data infrastructures, including database design, data pipelines, and analytics integrations."
              },
              {
                title: "IT Consulting & Systems Integration",
                desc: "Strategic technology advisory, architecture design, and seamless integration of systems to improve efficiency and scalability."
              },
              {
                title: "Research & Development (R&D)",
                desc: "Innovating emerging technology solutions to solve unique challenges in African and global markets with focus on sustainability."
              },
              {
                title: "Training & Capacity Building",
                desc: "Hands-on workshops, bootcamps, and custom training programs to empower individuals and teams with future-ready tech skills."
              },
              {
                title: "Technology Advisory for Startups",
                desc: "Supporting startups with technical strategy, product design, MVP development, and scale planning to accelerate growth efficiently."
              }
            ].map((service, index) => (
              <motion.div 
                key={service.title} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-red-200 dark:hover:border-red-600 group relative overflow-hidden"
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-red-400 dark:text-red-400 text-3xl mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    🚀
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-red-400 dark:group-hover:text-red-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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

      {/* Footer */}
      <Footer />

      {/* Bootcamp Banner - Shows after 3 seconds */}
      <BootcampBanner delay={3000} autoShow={true} />
      
      {/* Floating Bootcamp Button - Shows after 5 seconds */}
      <FloatingBootcampButton />
    </div>
  );
}
