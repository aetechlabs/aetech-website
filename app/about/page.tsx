'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import BlogHeader from '../components/BlogHeader';
import Footer from '@/components/Footer';
import { 
  RocketLaunchIcon,
  UsersIcon,
  LightBulbIcon,
  ChartBarIcon,
  BeakerIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const values = [
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      title: "Innovation First",
      description: "We push the boundaries of what's possible through continuous research and development."
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: "Collaborative Excellence",
      description: "Building strong partnerships with clients to deliver tailored solutions that exceed expectations."
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Data-Driven Decisions",
      description: "Every solution is backed by rigorous analysis and evidence-based methodologies."
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Impact",
      description: "Creating technologies that make a positive difference in communities worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Navigation */}
      <BlogHeader currentPage="about" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/a-computer-instructor-standing-while-students-code.jpg"
            alt="Computer instructor teaching students"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
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
              className="text-5xl lg:text-7xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-red-400">
                About
              </span>
              <br />
              <span className="text-white">AETech</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Engineering tomorrow's solutions through innovation-driven technology research, 
              development, and deployment across AI, software engineering, and data systems.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <BeakerIcon className="w-8 h-8 text-red-400 dark:text-red-300 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                To become a leading force in technological innovation, creating impactful solutions that transform industries and empower communities across Africa and the world.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <RocketLaunchIcon className="w-8 h-8 text-red-400 dark:text-red-300 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our mission is to research, develop, and deploy advanced technologies that solve real-world problems, drive business growth, and shape the future of digital transformation.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-red-400 dark:text-red-300 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>



        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center bg-red-400 rounded-2xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Innovate Together?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss how AETech can help transform your business with cutting-edge technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-white text-red-400 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get in Touch
            </Link>
            <Link 
              href="/blog"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white hover:text-red-400 transition-colors"
            >
              Read Our Blog
            </Link>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
