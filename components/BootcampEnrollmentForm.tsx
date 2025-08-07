'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface EnrollmentFormProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  educationLevel: string
  coursesInterested: string[]
  hasLaptop: string
  experience: string
  motivation: string
  heardAbout: string
}

export default function BootcampEnrollmentForm({ isOpen, onClose }: EnrollmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    educationLevel: '',
    coursesInterested: [],
    hasLaptop: '',
    experience: '',
    motivation: '',
    heardAbout: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const courses = [
    'Data Science',
    'AI & Machine Learning',
    'Graphic Design with Canva',
    'Creative Programming',
    'Beginner Web Development'
  ]

  const educationLevels = [
    'Secondary School (SSCE/WAEC)',
    'University Student',
    'University Graduate',
    'Other'
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.age.trim()) newErrors.age = 'Age is required'
    if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required'
    if (formData.coursesInterested.length === 0) newErrors.coursesInterested = ['Please select at least one course']
    if (!formData.hasLaptop) newErrors.hasLaptop = 'Please specify if you have a laptop'
    if (!formData.motivation.trim()) newErrors.motivation = 'Please tell us your motivation'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCourseChange = (course: string, checked: boolean) => {
    const updatedCourses = checked
      ? [...formData.coursesInterested, course]
      : formData.coursesInterested.filter(c => c !== course)
    
    handleInputChange('coursesInterested', updatedCourses)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/bootcamp/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            age: '',
            educationLevel: '',
            coursesInterested: [],
            hasLaptop: '',
            experience: '',
            motivation: '',
            heardAbout: ''
          })
          onClose()
          setSubmitStatus('idle')
        }, 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Enroll in AETech DevStarter Bootcamp
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Join our 3-week intensive tech bootcamp - completely FREE!
                </p>
                <p className="text-sm text-[#c1272d] dark:text-red-400 font-semibold mt-2">
                  ⏰ Registration closes: August 10, 2025 at 11:59 PM
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="m-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                    We've received your application and sent a confirmation email. We'll be in touch soon!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <XMarkIcon className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    Submission Failed
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                    There was an error submitting your application. Please try again.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+234 800 000 0000"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Age and Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your age"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                  Education Level *
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                    errors.educationLevel ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your education level</option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.educationLevel && <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>}
              </div>
            </div>

            {/* Courses Interested */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Courses You're Most Interested In * (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courses.map((course) => (
                  <label key={course} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.coursesInterested.includes(course)}
                      onChange={(e) => handleCourseChange(course, e.target.checked)}
                      className="h-4 w-4 text-[#c1272d] focus:ring-[#c1272d] border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{course}</span>
                  </label>
                ))}
              </div>
              {errors.coursesInterested && <p className="text-red-500 text-sm mt-1">Please select at least one course</p>}
            </div>

            {/* Laptop Availability */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <ComputerDesktopIcon className="h-4 w-4 inline mr-1" />
                Do you have access to a laptop and reliable internet? *
              </label>
              <div className="space-y-2">
                {['Yes, I have my own laptop and reliable internet', 'No, but I can get both before the bootcamp starts', 'No, I need guidance on laptop requirements and internet setup'].map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="radio"
                      name="hasLaptop"
                      value={option}
                      checked={formData.hasLaptop === option}
                      onChange={(e) => handleInputChange('hasLaptop', e.target.value)}
                      className="h-4 w-4 text-[#c1272d] focus:ring-[#c1272d] border-gray-300"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                💡 Note: Stable internet is essential for accessing online resources and joining virtual sessions
              </p>
              {errors.hasLaptop && <p className="text-red-500 text-sm mt-1">{errors.hasLaptop}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Previous Tech Experience (Optional)
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                placeholder="Briefly describe any programming, design, or tech-related experience you have (or write 'None' if you're a complete beginner)"
              />
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Why do you want to join this bootcamp? *
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                  errors.motivation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us what motivates you to learn tech skills and how you plan to use what you learn..."
              />
              {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
            </div>

            {/* How did you hear about us */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                How did you hear about us? (Optional)
              </label>
              <select
                value={formData.heardAbout}
                onChange={(e) => handleInputChange('heardAbout', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Please select</option>
                <option value="Social Media">Social Media (Instagram, Facebook, Twitter)</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Friend/Family">Friend or Family Member</option>
                <option value="School">School/University</option>
                <option value="Website">AETech Website</option>
                <option value="Google Search">Google Search</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#c1272d] hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
