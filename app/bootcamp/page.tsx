'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import BootcampEnrollmentForm from '@/components/BootcampEnrollmentForm'
import FloatingParticles from '@/components/FloatingParticles'
import GradientText from '@/components/GradientText'
import UrgencyBanner from '@/components/UrgencyBanner'
import Footer from '@/components/Footer'
import { 
  AcademicCapIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CpuChipIcon,
  PaintBrushIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ClockIcon,
  BookOpenIcon,
  TrophyIcon,
  HandRaisedIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

export default function BootcampPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false)

  const courses = [
    {
      icon: ChartBarIcon,
      title: "Data Science",
      description: "Learn data analysis, visualization, and insights extraction using Python and modern tools.",
      color: "bg-blue-500"
    },
    {
      icon: CpuChipIcon,
      title: "AI & Machine Learning",
      description: "Explore artificial intelligence, machine learning algorithms, and practical applications.",
      color: "bg-purple-500"
    },
    {
      icon: PaintBrushIcon,
      title: "Graphic Design with Canva",
      description: "Master visual design principles and create stunning graphics using Canva.",
      color: "bg-pink-500"
    },
    {
      icon: LightBulbIcon,
      title: "Creative Programming",
      description: "Discover creative coding, interactive art, and visual programming concepts.",
      color: "bg-yellow-500"
    },
    {
      icon: GlobeAltIcon,
      title: "Beginner Web Development",
      description: "Build responsive websites using HTML, CSS, and modern web technologies.",
      color: "bg-green-500"
    }
  ]

  const features = [
    {
      icon: UserGroupIcon,
      title: "Live Expert-Led Sessions",
      description: "Learn directly from industry professionals with real-world experience."
    },
    {
      icon: ComputerDesktopIcon,
      title: "Hands-On Projects & Feedback",
      description: "Build practical projects and receive personalized feedback from instructors."
    },
    {
      icon: TrophyIcon,
      title: "Certificate of Completion",
      description: "Earn a recognized certificate to showcase your new skills to employers."
    },
    {
      icon: HandRaisedIcon,
      title: "Community Support & Mentorship",
      description: "Join a supportive community and get guidance from mentors throughout your journey."
    },
    {
      icon: ClockIcon,
      title: "Flexible Weekly Structure",
      description: "Structured learning with optional help sessions to fit your schedule."
    }
  ]

  const schedule = [
    { day: "Monday", activity: "Optional Help Session (Morning)", type: "optional" },
    { day: "Tuesday", activity: "Full Instruction Day - Live Classes", type: "mandatory" },
    { day: "Wednesday", activity: "Optional Help Session (Morning)", type: "optional" },
    { day: "Thursday", activity: "Project-Based Assessments", type: "mandatory" },
    { day: "Friday", activity: "Self-Study & Practice", type: "recommended" }
  ]

  const faqs = [
    {
      question: "Do I need a laptop and internet?",
      answer: "Yes, having your own laptop and reliable internet connection is compulsory for all courses except Graphic Design with Canva, where you can use your smartphone. For other courses (Data Science, AI/ML, Creative Programming, and Web Development), a laptop and stable internet are essential for hands-on coding, accessing online resources, and participating in virtual sessions. We'll provide guidance on minimum system requirements to help you choose the right device."
    },
    {
      question: "What if I miss a class?",
      answer: "Sessions are not recorded, so it's important to attend live classes. However, our optional help sessions on Mondays and Wednesdays provide opportunities to catch up on missed content and get personalized assistance from instructors."
    },
    {
      question: "Will there be a certificate?",
      answer: "Yes! Upon successful completion of the bootcamp and all project assessments, you'll receive an AETech DevStarter Bootcamp Certificate of Completion that you can add to your resume and LinkedIn profile."
    },
    {
      question: "What's the cost of the bootcamp?",
      answer: "The AETech DevStarter Bootcamp is completely FREE! We believe in making quality tech education accessible to everyone, regardless of their financial background."
    },
    {
      question: "Do I need any prior programming experience?",
      answer: "No prior experience is required! This bootcamp is specifically designed for beginners. We start with the fundamentals and build up your skills progressively throughout the 3 weeks."
    },
    {
      question: "What happens after the bootcamp?",
      answer: "Graduates will join our exclusive WhatsApp group and Discord community where you can continue to share ideas, collaborate on projects, brainstorm solutions, and network with fellow tech enthusiasts. It's a supportive space for ongoing learning and connection."
    },
    {
      question: "When does registration close?",
      answer: "Registration closes on August 10, 2025 at 11:59 PM. We encourage you to apply early as spots are limited and will be filled on a first-come, first-served basis after meeting our selection criteria."
    },
    {
      question: "When do classes begin?",
      answer: "Onboarding and classes begin on Monday, August 12, 2025 at 11:00 AM. Please arrive on time as we'll cover important orientation information and begin with our first learning session."
    }
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/students-in-a-computer-lab.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#c1272d]/80 via-red-600/80 to-red-800/80"></div>
          {/* Floating Particles */}
          <FloatingParticles count={25} className="text-white/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              AETech DevStarter
              <span className="block text-yellow-300">Bootcamp</span>
            </h1>
            <p className="text-2xl lg:text-3xl mb-8 text-red-100 font-light">
              3 Weeks. 5 Skills. Endless Possibilities.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <button 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                onClick={() => setShowEnrollmentForm(true)}
              >
                🚀 Enroll Now
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 opacity-30 animate-bounce">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ComputerDesktopIcon className="h-16 w-16 text-white" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-30">
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <AcademicCapIcon className="h-20 w-20 text-white" />
          </motion.div>
        </div>
        <div className="absolute top-1/2 right-20 opacity-20">
          <motion.div
            animate={{ x: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CalendarDaysIcon className="h-12 w-12 text-white" />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              About the Bootcamp
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              The AETech DevStarter Bootcamp is a 3-week hands-on program designed to empower beginners 
              with practical skills in technology. Whether you're just getting started or want to explore 
              different tech fields, this bootcamp is your gateway to digital excellence. Our comprehensive 
              curriculum combines theoretical knowledge with real-world applications, ensuring you gain 
              practical experience that employers value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn */}
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
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Five comprehensive courses designed to launch your tech career
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-[#c1272d] dark:hover:border-[#c1272d] group"
              >
                <div className={`${course.color} rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <course.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {course.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Weekly Schedule
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Structured learning with flexibility for your success
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {schedule.map((item, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.type === 'mandatory' ? 'bg-red-500' :
                        item.type === 'optional' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {item.day}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.activity}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'mandatory' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        item.type === 'optional' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
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
              Why Choose Our Bootcamp?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Unique features that set us apart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="bg-[#c1272d] rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="py-20 bg-[#c1272d] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">
              Who Can Join?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[
                { icon: AcademicCapIcon, title: "Secondary School Leavers", desc: "Starting your next chapter" },
                { icon: BookOpenIcon, title: "University Students", desc: "Enhance your studies" },
                { icon: UserGroupIcon, title: "Job Seekers", desc: "Gain marketable skills" },
                { icon: LightBulbIcon, title: "Tech Curious", desc: "Explore new possibilities" }
              ].map((audience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <audience.icon className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{audience.title}</h3>
                  <p className="text-red-100">{audience.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Enroll */}
      <section className="relative py-20 overflow-hidden">
        {/* Subtle Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-5"
          >
            <source src="/videos/students-in-a-computer-lab.mp4" type="video/mp4" />
          </video>
          {/* Light overlay */}
          <div className="absolute inset-0 bg-gray-50/95 dark:bg-gray-800/95"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Ready to Start Your Tech Journey?
            </h2>

            {/* Urgency Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <UrgencyBanner 
                message="⚡ Only 3 days left to register!"
                countdown="Registration closes August 10, 2025 at 11:59 PM"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                <CalendarDaysIcon className="h-12 w-12 text-[#c1272d] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Registration Period
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Opens: <span className="font-semibold">August 8, 2025 at 12:00 AM</span><br />
                  Closes: <span className="font-semibold">August 10, 2025 at 11:59 PM</span>
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                <CalendarDaysIcon className="h-12 w-12 text-[#c1272d] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Bootcamp Dates
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Onboarding & Classes Begin:<br />
                  <span className="font-semibold">Monday, August 12, 2025 at 11:00 AM</span><br />
                  Duration: <span className="font-semibold">3 weeks intensive</span>
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                <MapPinIcon className="h-12 w-12 text-[#c1272d] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Location
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AETech Labs<br />
                  Suite 30, Es-Em Plaza<br />
                  Utako, Abuja
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                <CurrencyDollarIcon className="h-12 w-12 text-[#c1272d] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Investment
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Completely FREE!<br />
                  <span className="font-semibold text-green-600 dark:text-green-400">No hidden costs</span>
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <button 
                className="bg-[#c1272d] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                onClick={() => setShowEnrollmentForm(true)}
              >
                🎓 Enroll in DevStarter Bootcamp
              </button>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Limited spots available. Secure your place today!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#c1272d] rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUpIcon className="h-5 w-5 text-[#c1272d]" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-[#c1272d]" />
                    )}
                  </div>
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Enrollment Form Modal */}
      <BootcampEnrollmentForm 
        isOpen={showEnrollmentForm} 
        onClose={() => setShowEnrollmentForm(false)} 
      />
    </div>
  )
}
