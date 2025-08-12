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
  ExclamationTriangleIcon,
  ChartBarIcon,
  CpuChipIcon,
  PaintBrushIcon,
  LightBulbIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface AttendanceSession {
  id: string
  title: string
  description: string
  question: string
  meetingDate: string
  expiresAt: string
  isActive: boolean
}

const courses = [
  {
    id: 'data-science',
    name: 'Data Science',
    icon: ChartBarIcon,
    description: 'Data analysis, visualization, and insights extraction',
    color: 'bg-blue-600',
    keywords: ['data science', 'data analysis', 'python', 'analytics']
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: CpuChipIcon,
    description: 'Artificial intelligence and machine learning algorithms',
    color: 'bg-purple-600',
    keywords: ['ai', 'machine learning', 'artificial intelligence', 'ml', 'tensorflow', 'pytorch']
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design with Canva',
    icon: PaintBrushIcon,
    description: 'Visual design principles and Canva mastery',
    color: 'bg-pink-600',
    keywords: ['graphic design', 'canva', 'design', 'visual']
  },
  {
    id: 'creative-programming',
    name: 'Creative Programming',
    icon: LightBulbIcon,
    description: 'Creative coding and interactive art',
    color: 'bg-yellow-600',
    keywords: ['creative programming', 'creative coding', 'interactive', 'art']
  },
  {
    id: 'web-development',
    name: 'Beginner Web Development',
    icon: GlobeAltIcon,
    description: 'HTML, CSS, and modern web technologies',
    color: 'bg-green-600',
    keywords: ['web development', 'html', 'css', 'javascript', 'web', 'frontend', 'backend']
  }
]

export default function AttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [approvedCourses, setApprovedCourses] = useState<string[]>([])

  // Fetch student's approved courses when email is entered
  const fetchApprovedCourses = async (email: string) => {
    try {
      const response = await fetch(`/api/bootcamp?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        // Get approved courses for this student
        const approved = data.data
          .filter((enrollment: any) => enrollment.status === 'APPROVED' && enrollment.assignedCourse)
          .map((enrollment: any) => enrollment.assignedCourse)
        
        setApprovedCourses(approved)
        return approved
      } else {
        setApprovedCourses([])
        return []
      }
    } catch (error) {
      console.error('Error fetching approved courses:', error)
      setApprovedCourses([])
      return []
    }
  }

  const fetchCourseSessions = async (courseName: string) => {
    try {
      setLoading(true)
      setError('')

      // Fetch sessions for the specific course
      const response = await fetch(`/api/attendance/public?course=${encodeURIComponent(courseName)}`)
      const data = await response.json()

      if (data.success) {
        setSessions(data.data)
      } else {
        setError('Failed to load attendance sessions')
      }
    } catch (err) {
      setError('Failed to load attendance sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
    const course = courses.find(c => c.id === courseId)
    if (course) {
      fetchCourseSessions(course.keywords)
    }
  }

  const getSessionStatus = (session: AttendanceSession) => {
    const now = new Date()
    const expiresAt = new Date(session.expiresAt)
    
    if (!session.isActive) return { status: 'inactive', color: 'gray', text: 'Inactive', icon: XCircleIcon }
    if (now > expiresAt) return { status: 'expired', color: 'red', text: 'Expired', icon: XCircleIcon }
    
    const timeLeft = expiresAt.getTime() - now.getTime()
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    
    if (hoursLeft < 2) return { status: 'urgent', color: 'orange', text: 'Urgent', icon: ExclamationTriangleIcon }
    return { status: 'active', color: 'green', text: 'Active', icon: CheckCircleIcon }
  }

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const timeLeft = expires.getTime() - now.getTime()
    
    if (timeLeft <= 0) return 'Expired'
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
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
              Select your course to check for attendance sessions and mark your presence
            </p>
          </motion.div>
        </div>

        {!selectedCourse ? (
          /* Course Selection */
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Course</h2>
              <p className="text-gray-600 mb-8">Choose the course you're enrolled in to access attendance sessions</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const IconComponent = course.icon
                return (
                  <motion.button
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => handleCourseSelect(course.id)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-left group hover:scale-105"
                  >
                    <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#c1272d] transition-colors">
                      {course.name}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-6 flex items-center text-[#c1272d] font-medium">
                      <span>Select Course</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mt-12"
            >
              <div className="flex items-start space-x-4">
                <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">How Attendance Works</h3>
                  <div className="space-y-2 text-blue-800">
                    <p>• Select your enrolled course above</p>
                    <p>• View available attendance sessions for your course</p>
                    <p>• Answer the attendance question to mark your presence</p>
                    <p>• You must submit the correct answer before the deadline</p>
                    <p>• Each session can only be submitted once</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Course Sessions */
          <div className="space-y-8">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const course = courses.find(c => c.id === selectedCourse)
                    const IconComponent = course?.icon || AcademicCapIcon
                    return (
                      <>
                        <div className={`w-12 h-12 ${course?.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{course?.name}</h2>
                          <p className="text-gray-600">{course?.description}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(null)
                    setSessions([])
                    setError('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change Course
                </button>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c1272d] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading attendance sessions...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Sessions</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => {
                    const course = courses.find(c => c.id === selectedCourse)
                    if (course) fetchCourseSessions(course.keywords)
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Sessions List */}
            {!loading && !error && (
              <div className="space-y-6">
                {sessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200"
                  >
                    <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Attendance Sessions</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      There are no active attendance sessions for this course right now. 
                      Check back after your next class or contact your instructor.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sessions.map((session, index) => {
                      const status = getSessionStatus(session)
                      const StatusIcon = status.icon
                      
                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-6">
                            {/* Session Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
                                {session.description && (
                                  <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                                )}
                              </div>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800 ml-4`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.text}
                              </span>
                            </div>

                            {/* Session Details */}
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                <span>Meeting: {formatDate(session.meetingDate)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                <span>{formatTimeLeft(session.expiresAt)}</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-4 border-t border-gray-200">
                              {status.status === 'expired' || !session.isActive ? (
                                <button
                                  disabled
                                  className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                                >
                                  Session Expired
                                </button>
                              ) : (
                                <Link
                                  href={`/attendance/${session.id}`}
                                  className="block w-full py-3 px-4 bg-[#c1272d] text-white text-center rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                  Submit Attendance
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            Need help? Contact your instructor or{' '}
            <Link href="/contact" className="text-[#c1272d] hover:underline">
              reach out to our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
    </>
  )
}
