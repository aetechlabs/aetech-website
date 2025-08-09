'use client'

import { useState, Fragment, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  HeartIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface SponsorshipModalProps {
  isOpen: boolean
  onClose: () => void
}

const sponsorshipTiers = [
  {
    name: 'COMMUNITY',
    amount: 100,
    color: 'from-blue-500 to-blue-600',
    benefits: ['Logo on website', 'Social media mention', 'Newsletter feature'],
    icon: '🤝'
  },
  {
    name: 'BRONZE',
    amount: 500,
    color: 'from-amber-600 to-amber-700',
    benefits: ['All Community benefits', 'Blog post feature', 'Event mentions'],
    icon: '🥉'
  },
  {
    name: 'SILVER',
    amount: 1000,
    color: 'from-gray-400 to-gray-500',
    benefits: ['All Bronze benefits', 'Speaking opportunity', 'Research collaboration'],
    icon: '🥈'
  },
  {
    name: 'GOLD',
    amount: 2500,
    color: 'from-yellow-400 to-yellow-500',
    benefits: ['All Silver benefits', 'Advisory board seat', 'Priority project access'],
    icon: '🥇'
  },
  {
    name: 'PLATINUM',
    amount: 5000,
    color: 'from-purple-500 to-purple-600',
    benefits: ['All Gold benefits', 'Executive partnership', 'Custom research projects'],
    icon: '💎'
  }
]

export default function SponsorshipModal({ isOpen, onClose }: SponsorshipModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTier, setSelectedTier] = useState<string>('')
  const [customAmount, setCustomAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const [formData, setFormData] = useState({
    // Organization Details
    organizationName: '',
    organizationType: '',
    website: '',
    description: '',
    
    // Contact Information
    contactName: '',
    email: '',
    phone: '',
    country: '',
    
    // Sponsorship Details
    tier: '',
    amount: '',
    interests: [] as string[],
    message: '',
    
    // Payment Method
    paymentMethod: 'bank_transfer'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const selectTier = (tier: typeof sponsorshipTiers[0]) => {
    setSelectedTier(tier.name)
    setFormData(prev => ({
      ...prev,
      tier: tier.name,
      amount: tier.amount.toString()
    }))
    setCurrentStep(2)
  }

  const handleCustomAmount = () => {
    if (customAmount && parseInt(customAmount) > 0) {
      setSelectedTier('CUSTOM')
      setFormData(prev => ({
        ...prev,
        tier: 'CUSTOM',
        amount: customAmount
      }))
      setCurrentStep(2)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    console.log('Submitting sponsorship application:', formData)
    
    try {
      const response = await fetch('/api/sponsors/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'PENDING',
          dateCreated: new Date().toISOString()
        }),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        setSubmitStatus('success')
        setCurrentStep(4)
      } else {
        setSubmitStatus('error')
        console.error('Application submission failed:', responseData)
      }
    } catch (error) {
      console.error('Error submitting sponsorship:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetModal = () => {
    setCurrentStep(1)
    setSelectedTier('')
    setCustomAmount('')
    setSubmitStatus('idle')
    setFormData({
      organizationName: '',
      organizationType: '',
      website: '',
      description: '',
      contactName: '',
      email: '',
      phone: '',
      country: '',
      tier: '',
      amount: '',
      interests: [],
      message: '',
      paymentMethod: 'bank_transfer'
    })
    onClose()
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetModal()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            resetModal()
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6"
        >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <HeartIcon className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Become a Sponsor
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Support our research, education & AgriTech initiatives
                  </p>
                </div>
              </div>
              <button
                onClick={resetModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {currentStep > step ? <CheckCircleIcon className="h-5 w-5" /> : step}
                        </div>
                        {step < 3 && (
                          <div className={`w-16 h-1 mx-2 ${
                            currentStep > step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1: Choose Sponsorship Tier */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h4 className="text-xl font-semibold mb-4">Choose Your Sponsorship Tier</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sponsorshipTiers.map((tier) => (
                          <motion.button
                            key={tier.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectTier(tier)}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                              selectedTier === tier.name
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                            }`}
                          >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} text-white text-xl mb-3`}>
                              {tier.icon}
                            </div>
                            <h5 className="font-bold text-lg mb-2">{tier.name}</h5>
                            <p className="text-2xl font-bold text-green-600 mb-3">${tier.amount.toLocaleString()}</p>
                            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              {tier.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </motion.button>
                        ))}
                      </div>

                      {/* Custom Amount Option */}
                      <div className="border-t pt-6">
                        <h5 className="font-semibold mb-4">Or Enter Custom Amount</h5>
                        <div className="flex items-center space-x-4">
                          <div className="relative flex-1 max-w-xs">
                            <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="number"
                              placeholder="Enter amount"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                            />
                          </div>
                          <button
                            onClick={handleCustomAmount}
                            disabled={!customAmount || parseInt(customAmount) <= 0}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Organization & Contact Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-semibold">Organization & Contact Details</h4>
                        <div className="text-sm text-gray-600">
                          Selected: <span className="font-semibold text-green-600">{selectedTier} - ${formData.amount}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Organization Details */}
                        <div className="space-y-4">
                          <h5 className="font-semibold flex items-center">
                            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                            Organization Information
                          </h5>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Organization Name *</label>
                            <input
                              type="text"
                              name="organizationName"
                              value={formData.organizationName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Organization Type</label>
                            <select
                              name="organizationType"
                              value={formData.organizationType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                            >
                              <option value="">Select type</option>
                              <option value="corporation">Corporation</option>
                              <option value="nonprofit">Non-Profit</option>
                              <option value="government">Government</option>
                              <option value="educational">Educational Institution</option>
                              <option value="startup">Startup</option>
                              <option value="individual">Individual</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Website</label>
                            <div className="relative">
                              <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Organization Description</label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                            />
                          </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                          <h5 className="font-semibold flex items-center">
                            <UserIcon className="h-5 w-5 mr-2" />
                            Contact Information
                          </h5>

                          <div>
                            <label className="block text-sm font-medium mb-2">Contact Person *</label>
                            <input
                              type="text"
                              name="contactName"
                              value={formData.contactName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Email *</label>
                            <div className="relative">
                              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Country</label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                            >
                              <option value="">Select country</option>
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="GB">United Kingdom</option>
                              <option value="DE">Germany</option>
                              <option value="FR">France</option>
                              <option value="AU">Australia</option>
                              <option value="NG">Nigeria</option>
                              <option value="ZA">South Africa</option>
                              <option value="KE">Kenya</option>
                              <option value="GH">Ghana</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>

                          {/* Sponsorship Interests */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Areas of Interest</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['AgriTech', 'AI Research', 'Education', 'Data Systems', 'Sustainability', 'Innovation'].map((interest) => (
                                <label key={interest} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.interests.includes(interest)}
                                    onChange={() => handleInterestToggle(interest)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                  />
                                  <span className="ml-2 text-sm">{interest}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Additional Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Tell us about your goals and how you'd like to partner with us..."
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setCurrentStep(3)}
                          disabled={!formData.organizationName || !formData.contactName || !formData.email}
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment & Review */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h4 className="text-xl font-semibold">Review & Payment</h4>

                      {/* Summary */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h5 className="font-semibold mb-3">Sponsorship Summary</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Organization:</span>
                            <p className="font-medium">{formData.organizationName}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                            <p className="font-medium">{formData.contactName}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Tier:</span>
                            <p className="font-medium">{selectedTier}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <p className="font-medium text-green-600">${parseInt(formData.amount).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h5 className="font-semibold mb-4 flex items-center">
                          <CreditCardIcon className="h-5 w-5 mr-2" />
                          Payment Method
                        </h5>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bank_transfer"
                              checked={formData.paymentMethod === 'bank_transfer'}
                              onChange={handleInputChange}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <div className="ml-3">
                              <p className="font-medium">Bank Transfer</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">We'll send you bank details for direct transfer</p>
                            </div>
                          </label>
                          <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="crypto"
                              checked={formData.paymentMethod === 'crypto'}
                              onChange={handleInputChange}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <div className="ml-3">
                              <p className="font-medium">Cryptocurrency</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Pay with Bitcoin, Ethereum, or other crypto</p>
                            </div>
                          </label>
                          <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="check"
                              checked={formData.paymentMethod === 'check'}
                              onChange={handleInputChange}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <div className="ml-3">
                              <p className="font-medium">Check/Cheque</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Mail a physical check to our office</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h6 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Next Steps</h6>
                        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                          <li>• We'll review your sponsorship application within 2 business days</li>
                          <li>• You'll receive payment instructions via email</li>
                          <li>• Upon payment confirmation, we'll activate your sponsorship benefits</li>
                          <li>• A dedicated partnership manager will be assigned to your account</li>
                        </ul>
                      </div>

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <p className="text-red-800 dark:text-red-300">There was an error submitting your application. Please try again.</p>
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-8 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircleIcon className="h-12 w-12 text-white" />
                      </motion.div>
                      
                      <h4 className="text-2xl font-bold text-green-600 mb-4">Application Submitted Successfully!</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Thank you for your interest in sponsoring AETech! We'll review your application and get back to you within 2 business days with payment instructions.
                      </p>
                      
                      <div className="space-y-3">
                        <button
                          onClick={resetModal}
                          className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          Close
                        </button>
                        <p className="text-sm text-gray-500">
                          Check your email for a confirmation message
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
