'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

interface AttendanceSession {
  id: string
  title: string
  description: string
  course?: string | null
  question: string
  meetingDate: string
  expiresAt: string
  isActive: boolean
}

export default function AttendancePage() {
  const params = useParams()
  const sessionId = params.id as string

  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ isCorrect: boolean; message: string } | null>(null)

  const [formData, setFormData] = useState({
    studentEmail: '',
    studentName: '',
    answer: ''
  })

  useEffect(() => {
    fetchSession()
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/attendance/${sessionId}`)
      const data = await response.json()

      if (data.success) {
        setSession(data.data)
      } else {
        setError(data.message || 'Failed to load attendance session')
      }
    } catch (err) {
      setError('Failed to load attendance session')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/attendance/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        setSubmitted(true)
      } else {
        setError(data.message || 'Failed to submit attendance')
      }
    } catch (err) {
      setError('Failed to submit attendance')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const isExpired = session ? new Date() > new Date(session.expiresAt) : false
  const timeLeft = session ? new Date(session.expiresAt).getTime() - new Date().getTime() : 0
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1272d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance session...</p>
        </div>
      </div>
      </>
    )
  }

  if (error && !session) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Available</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
      </>
    )
  }

  if (submitted && result) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {result.isCorrect ? (
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {result.isCorrect ? 'Attendance Confirmed!' : 'Attendance Submitted'}
          </h1>
          
          <p className="text-gray-600 mb-6">{result.message}</p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Session Details</h3>
            <p className="text-sm text-gray-600">{session?.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              Submitted on {new Date().toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-[#c1272d] rounded-full flex items-center justify-center mx-auto mb-4">
              <QuestionMarkCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Check</h1>
            <p className="text-gray-600 mt-2">Submit your answer to mark your attendance</p>
          </motion.div>
        </div>

        {/* Session Info */}
        {session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">{session.title}</h2>
            
            {session.description && (
              <p className="text-gray-600 mb-4">{session.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.meetingDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Deadline</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.expiresAt).toLocaleString()}
                  </p>
                  {!isExpired && timeLeft > 0 && (
                    <p className="text-xs text-[#c1272d] font-medium">
                      {hoursLeft > 0 ? `${hoursLeft}h ` : ''}{minutesLeft}m remaining
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-red-800 font-medium">This attendance window has expired</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Attendance Form */}
        {session && !isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Attendance Question:</h3>
                <p className="text-blue-800">{session.question}</p>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => handleInputChange('answer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your answer here"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.studentName || !formData.studentEmail || !formData.answer}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#c1272d] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Submit Attendance</span>
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Make sure to enter the same email address you used for bootcamp enrollment. 
                You can only submit once per session, and your answer must be correct to be marked present.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  )
}
