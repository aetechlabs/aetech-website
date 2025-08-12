'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import { 
  AcademicCapIcon,
  ClockIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface AttendanceSession {
  id: string
  title: string
  description: string
  course: string | null
  question: string
  meetingDate: string
  expiresAt: string
  isActive: boolean
}

export default function AttendancePage() {
  const [studentEmail, setStudentEmail] = useState('')
  const [approvedCourses, setApprovedCourses] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchApprovedCourses = async () => {
    if (!studentEmail.includes('@')) return
    
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`/api/bootcamp/public?email=${encodeURIComponent(studentEmail)}`)
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        const approved = data.data
          .filter((enrollment: any) => enrollment.status === 'APPROVED' && enrollment.assignedCourse)
          .map((enrollment: any) => enrollment.assignedCourse)
        
        setApprovedCourses(approved)
        if (approved.length === 0) {
          setError('No approved courses found for this email.')
        }
      } else {
        setError('Student not found or no approved enrollments.')
        setApprovedCourses([])
      }
    } catch (error) {
      setError('Failed to fetch student information.')
      setApprovedCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseSessions = async (courseName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/attendance/public?course=${encodeURIComponent(courseName)}`)
      const data = await response.json()

      if (data.success) {
        setSessions(data.data)
        setSelectedCourse(courseName)
      } else {
        setError('Failed to load attendance sessions')
      }
    } catch (error) {
      setError('Failed to load attendance sessions')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSessionStatus = (session: AttendanceSession) => {
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    
    if (now > expiresAt) {
      return { status: 'expired', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircleIcon }
    }
    
    const hoursLeft = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursLeft <= 2) {
      return { status: 'urgent', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: ExclamationTriangleIcon }
    }
    
    return { status: 'active', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircleIcon }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-[#c1272d] rounded-full flex items-center justify-center mx-auto mb-6">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Bootcamp Attendance</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Check your attendance sessions and mark your presence
              </p>
            </motion.div>
          </div>

          {/* Email Input Section */}
          {approvedCourses.length === 0 && !selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Enter Your Email</h2>
                <p className="text-gray-600 mb-6 text-center">Enter your registered email to see your approved courses</p>
                
                <div className="space-y-4">
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => {
                      setStudentEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && fetchApprovedCourses()}
                  />
                  <button
                    onClick={fetchApprovedCourses}
                    disabled={!studentEmail.includes('@') || loading}
                    className="w-full bg-gradient-to-r from-red-600 to-[#c1272d] text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Loading...' : 'Find My Courses'}
                  </button>
                  
                  {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Course Selection */}
          {approvedCourses.length > 0 && !selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Approved Courses</h2>
                <p className="text-gray-600">Select a course to access attendance sessions</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {approvedCourses.map((courseName, index) => (
                  <motion.button
                    key={courseName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => fetchCourseSessions(courseName)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-[#c1272d] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#c1272d] transition-colors">
                      {courseName}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      Click to access sessions
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setStudentEmail('')
                    setApprovedCourses([])
                    setError('')
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Use different email
                </button>
              </div>
            </motion.div>
          )}

          {/* Sessions List */}
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCourse} Sessions</h2>
                  <p className="text-gray-600">Available attendance sessions for your course</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(null)
                    setSessions([])
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Courses
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1272d] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12">
                  <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Sessions</h3>
                  <p className="text-gray-600">There are no active attendance sessions for this course at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((session, index) => {
                    const sessionStatus = getSessionStatus(session)
                    const StatusIcon = sessionStatus.icon

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${sessionStatus.bgColor} ${sessionStatus.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="capitalize">{sessionStatus.status}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {session.title}
                        </h3>
                        
                        {session.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {session.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarDaysIcon className="h-4 w-4 mr-2" />
                            <span>{formatDate(session.meetingDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            <span>Deadline: {formatDate(session.expiresAt)}</span>
                          </div>
                        </div>

                        <Link
                          href={`/attendance/${session.id}?email=${encodeURIComponent(studentEmail)}`}
                          className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                            sessionStatus.status === 'expired'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-red-600 to-[#c1272d] text-white hover:shadow-lg'
                          }`}
                        >
                          {sessionStatus.status === 'expired' ? 'Expired' : 'Submit Attendance'}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
