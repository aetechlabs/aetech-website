'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import Footer from '@/components/Footer'
import { 
  HeartIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  MegaphoneIcon,
  CameraIcon,
  PencilIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  HandRaisedIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    interests: [] as string[],
    availability: '',
    motivation: '',
    skills: '',
    previousVolunteering: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const volunteerOpportunities = [
    {
      icon: AcademicCapIcon,
      title: "Bootcamp Instructor",
      description: "Teach coding, data science, AI/ML, or design to aspiring tech enthusiasts",
      commitment: "2-3 hours/week",
      skills: ["Programming", "Teaching", "Patience"],
      impact: "High",
      color: "bg-blue-500"
    },
    {
      icon: HandRaisedIcon,
      title: "Mentor & Support",
      description: "Guide students through their learning journey and provide career advice",
      commitment: "1-2 hours/week",
      skills: ["Communication", "Industry Experience", "Leadership"],
      impact: "High",
      color: "bg-green-500"
    },
    {
      icon: UserGroupIcon,
      title: "Community Manager",
      description: "Help build and manage our Discord community and student engagement",
      commitment: "3-5 hours/week",
      skills: ["Social Media", "Community Building", "Communication"],
      impact: "Medium",
      color: "bg-purple-500"
    },
    {
      icon: MegaphoneIcon,
      title: "Marketing & Outreach",
      description: "Help spread the word about our programs and reach more students",
      commitment: "2-4 hours/week",
      skills: ["Marketing", "Social Media", "Content Creation"],
      impact: "Medium",
      color: "bg-pink-500"
    },
    {
      icon: CameraIcon,
      title: "Content Creator",
      description: "Create videos, graphics, and educational content for our programs",
      commitment: "3-6 hours/week",
      skills: ["Video Editing", "Graphic Design", "Photography"],
      impact: "Medium",
      color: "bg-orange-500"
    },
    {
      icon: PencilIcon,
      title: "Curriculum Developer",
      description: "Help design course materials, projects, and assessment criteria",
      commitment: "4-6 hours/week",
      skills: ["Technical Writing", "Curriculum Design", "Subject Expertise"],
      impact: "High",
      color: "bg-indigo-500"
    }
  ]

  const benefits = [
    {
      icon: "🎯",
      title: "Make Real Impact",
      description: "Directly contribute to transforming lives through tech education"
    },
    {
      icon: "🤝",
      title: "Build Network",
      description: "Connect with like-minded professionals and industry experts"
    },
    {
      icon: "📜",
      title: "Recognition",
      description: "Receive official volunteer certificates and LinkedIn recommendations"
    },
    {
      icon: "🚀",
      title: "Skill Development",
      description: "Enhance your teaching, leadership, and communication skills"
    },
    {
      icon: "💼",
      title: "Career Growth",
      description: "Gain valuable experience for your professional development"
    },
    {
      icon: "🎉",
      title: "Exclusive Access",
      description: "Priority access to our events, workshops, and community"
    }
  ]

  const requirements = [
    "Passion for technology and education",
    "Commitment to the selected time period",
    "Strong communication skills",
    "Reliable internet connection",
    "Professional attitude and punctuality"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: '',
          interests: [],
          availability: '',
          motivation: '',
          skills: '',
          previousVolunteering: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-800">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="volunteer-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#volunteer-grid)" className="text-gray-900 dark:text-gray-100" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
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
              <HeartIcon className="h-20 w-20 text-[#c1272d] mx-auto mb-6" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            >
              Volunteer with{' '}
              <span className="text-[#c1272d]">AETech</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Join our mission to democratize tech education and empower the next generation of innovators. 
              Make a lasting impact while growing your own skills and network.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="#opportunities"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#c1272d] text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-red-700 transition-all duration-300 shadow-lg"
              >
                View Opportunities
              </motion.a>
              <motion.a
                href="#apply"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-red-400 text-red-400 hover:bg-red-400/20 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300"
              >
                Apply Now
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Volunteer with Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join a community of passionate individuals making technology education accessible to everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section id="opportunities" className="relative py-20 bg-gray-50 dark:bg-gray-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="opportunities-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#opportunities-grid)" className="text-gray-900 dark:text-gray-100" />
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
              Volunteer Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from various roles that match your skills and interests
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`${opportunity.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <opportunity.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {opportunity.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {opportunity.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">{opportunity.commitment}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Impact: {opportunity.impact}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.a
                  href="#apply"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-center bg-[#c1272d] text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300"
                >
                  Apply for This Role
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Basic Requirements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              What we're looking for in our volunteers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="relative py-20 bg-gray-50 dark:bg-gray-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="apply-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#apply-grid)" className="text-gray-900 dark:text-gray-100" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Apply to Volunteer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to make a difference? Fill out the form below to get started
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg"
          >
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                <p className="text-green-800 dark:text-green-100">
                  Thank you for your interest! We'll review your application and get back to you within 48 hours.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-100">
                  Something went wrong. Please try again or contact us directly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability *
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select your availability</option>
                    <option value="1-2 hours/week">1-2 hours per week</option>
                    <option value="3-5 hours/week">3-5 hours per week</option>
                    <option value="6-10 hours/week">6-10 hours per week</option>
                    <option value="10+ hours/week">More than 10 hours per week</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Areas of Interest (select all that apply)
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {volunteerOpportunities.map((opportunity) => (
                    <label key={opportunity.title} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(opportunity.title)}
                        onChange={() => handleInterestChange(opportunity.title)}
                        className="h-4 w-4 text-[#c1272d] focus:ring-[#c1272d] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{opportunity.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relevant Experience *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Tell us about your relevant experience, skills, and background..."
                />
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why do you want to volunteer with AETech? *
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Share your motivation and what you hope to achieve..."
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills & Technologies
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="List your technical skills, programming languages, tools, etc..."
                />
              </div>

              <div>
                <label htmlFor="previousVolunteering" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Volunteering Experience
                </label>
                <textarea
                  id="previousVolunteering"
                  name="previousVolunteering"
                  value={formData.previousVolunteering}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Tell us about any previous volunteering or teaching experience..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#c1272d] hover:bg-red-700 text-white shadow-lg'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
