'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PaperAirplaneIcon, 
  UserGroupIcon, 
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import RichTextEditor from '../../../components/RichTextEditor'

interface EmailConfig {
  senderEmail: string
  senderName: string
  replyTo: string
}

interface EmailCampaign {
  id: string
  subject: string
  content: string
  recipients: string[]
  status: 'draft' | 'sent' | 'scheduled'
  sentAt?: string
  createdAt: string
}

export default function EmailMarketingPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'campaigns' | 'settings'>('compose')
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    senderEmail: 'noreply@aetechlabs.com',
    senderName: 'AETech Research Labs',
    replyTo: 'info@aetechlabs.com'
  })
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [recipientType, setRecipientType] = useState<'bulk_list' | 'all_users' | 'all_contacts' | 'custom'>('bulk_list')
  const [customEmails, setCustomEmails] = useState('')
  const [bulkEmailList, setBulkEmailList] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null)
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContacts: 0,
    campaignsSent: 0
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchCampaigns()
    loadEmailConfig()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersRes, contactsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/contacts')
      ])
      
      if (usersRes.ok && contactsRes.ok) {
        const users = await usersRes.json()
        const contacts = await contactsRes.json()
        setStats(prev => ({
          ...prev,
          totalUsers: users.length || 0,
          totalContacts: contacts.length || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchCampaigns = async () => {
    // Mock data for now - you can implement actual API later
    setCampaigns([
      {
        id: '1',
        subject: 'Welcome to AETech Labs',
        content: '<p>Welcome to our community!</p>',
        recipients: ['user1@example.com', 'user2@example.com'],
        status: 'sent',
        sentAt: '2025-08-07T10:30:00Z',
        createdAt: '2025-08-07T10:00:00Z'
      }
    ])
  }

  const loadEmailConfig = () => {
    const saved = localStorage.getItem('emailConfig')
    if (saved) {
      setEmailConfig(JSON.parse(saved))
    }
  }

  const saveEmailConfig = () => {
    localStorage.setItem('emailConfig', JSON.stringify(emailConfig))
    setMessage({ type: 'success', text: 'Email configuration saved successfully!' })
    setTimeout(() => setMessage(null), 3000)
  }

  // Convert markdown-like content to HTML for preview
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return ''
    
    let html = markdown
      // Convert headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      
      // Convert italic text
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      
      // Convert links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #c1272d; text-decoration: none;">$1</a>')
      
      // Convert images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />')
      
      // Convert line breaks
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>')
      
      // Convert lists
      .replace(/^\* (.+$)/gim, '<li>$1</li>')
      .replace(/^- (.+$)/gim, '<li>$1</li>')
      
      // Convert blockquotes
      .replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>')
      
      // Convert code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0; overflow-x: auto;"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')

    // Wrap in paragraphs if not already wrapped
    if (!html.includes('<p>') && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>') && !html.includes('<ul>') && !html.includes('<ol>')) {
      html = `<p>${html}</p>`
    }

    // Fix list wrapping
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
    
    return html
  }

  const generateEmailPreview = () => {
    const htmlContent = convertMarkdownToHtml(emailContent)
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject || 'Email Preview'}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #c1272d;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            color: #c1272d;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .footer a {
            color: #c1272d;
            text-decoration: none;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          blockquote {
            border-left: 4px solid #c1272d;
            margin: 0;
            padding: 0 0 0 20px;
            font-style: italic;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #c1272d;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">AETech Research Labs</div>
          <p>Advanced Engineering & Technology Solutions</p>
        </div>
        
        <div class="content">
          ${htmlContent}
        </div>
        
        <div class="footer">
          <p>
            <strong>AETech Research Labs</strong><br>
            Suite 30, Es-Em Plaza, Utako<br>
            Abuja, Nigeria<br>
            <a href="tel:+2347044400347">+234 704 440 0347</a> | 
            <a href="mailto:info@aetechlabs.com">info@aetechlabs.com</a>
          </p>
          <p>
            <a href="https://www.aetechlabs.com">Visit our website</a> | 
            <a href="https://www.aetechlabs.com/privacy">Privacy Policy</a> | 
            <a href="mailto:${emailConfig.replyTo}?subject=Unsubscribe">Unsubscribe</a>
          </p>
          <p><small>This email was sent from ${emailConfig.senderEmail}</small></p>
        </div>
      </body>
      </html>
    `
  }

  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both subject and content' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setIsLoading(true)
    
    try {
      let recipients: string[] = []
      
      if (recipientType === 'bulk_list') {
        recipients = bulkEmailList.split(/[\n,]/).map(email => email.trim()).filter(Boolean)
      } else if (recipientType === 'all_users') {
        const response = await fetch('/api/users')
        if (response.ok) {
          const users = await response.json()
          recipients = users.map((user: any) => user.email).filter(Boolean)
        }
      } else if (recipientType === 'all_contacts') {
        const response = await fetch('/api/contacts')
        if (response.ok) {
          const contacts = await response.json()
          recipients = contacts.map((contact: any) => contact.email).filter(Boolean)
        }
      } else {
        recipients = customEmails.split(',').map(email => email.trim()).filter(Boolean)
      }

      if (recipients.length === 0) {
        setMessage({ type: 'error', text: 'No valid recipients found' })
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/emails/send-marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          recipients,
          senderConfig: emailConfig
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: `Email sent successfully to ${recipients.length} recipients!` })
        setEmailSubject('')
        setEmailContent('')
        setCustomEmails('')
        setBulkEmailList('')
        fetchCampaigns()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to send email' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while sending the email' })
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const getRecipientCount = () => {
    if (recipientType === 'bulk_list') {
      return bulkEmailList.split(/[\n,]/).filter(email => email.trim()).length
    }
    if (recipientType === 'all_users') return stats.totalUsers
    if (recipientType === 'all_contacts') return stats.totalContacts
    return customEmails.split(',').filter(email => email.trim()).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Email Marketing
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Send marketing emails to your users and contacts
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : message.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
          }`}
        >
          {message.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
          {message.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5" />}
          {message.type === 'info' && <InformationCircleIcon className="h-5 w-5" />}
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max" aria-label="Tabs">
            {[
              { id: 'compose', name: 'Compose Email', icon: PaperAirplaneIcon },
              { id: 'campaigns', name: 'Campaign History', icon: EnvelopeIcon },
              { id: 'settings', name: 'Email Settings', icon: Cog6ToothIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-[#c1272d] text-[#c1272d]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {/* Compose Tab */}
          {activeTab === 'compose' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Contacts</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalContacts}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center">
                    <PaperAirplaneIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Campaigns Sent</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{campaigns.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Current Recipients</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{getRecipientCount()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipients
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="recipients"
                          value="bulk_list"
                          checked={recipientType === 'bulk_list'}
                          onChange={(e) => setRecipientType(e.target.value as any)}
                          className="mr-3 text-[#c1272d] focus:ring-[#c1272d]"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bulk Email List</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Paste or type multiple emails</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="recipients"
                          value="custom"
                          checked={recipientType === 'custom'}
                          onChange={(e) => setRecipientType(e.target.value as any)}
                          className="mr-3 text-[#c1272d] focus:ring-[#c1272d]"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom List (CSV)</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Comma-separated emails</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="recipients"
                          value="all_users"
                          checked={recipientType === 'all_users'}
                          onChange={(e) => setRecipientType(e.target.value as any)}
                          className="mr-3 text-[#c1272d] focus:ring-[#c1272d]"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Users ({stats.totalUsers})</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Registered website users</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="recipients"
                          value="all_contacts"
                          checked={recipientType === 'all_contacts'}
                          onChange={(e) => setRecipientType(e.target.value as any)}
                          className="mr-3 text-[#c1272d] focus:ring-[#c1272d]"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Contacts ({stats.totalContacts})</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Contact form submissions</p>
                        </div>
                      </label>
                    </div>
                    
                    {recipientType === 'bulk_list' && (
                      <div className="space-y-2">
                        <textarea
                          value={bulkEmailList}
                          onChange={(e) => setBulkEmailList(e.target.value)}
                          placeholder={`Paste your email list here. Supports multiple formats:

Email per line:
john@example.com
jane@example.com
bob@company.com

Or comma-separated:
john@example.com, jane@example.com, bob@company.com

Or with names:
John Doe <john@example.com>
Jane Smith <jane@example.com>`}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-mono text-sm"
                        />
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <div className="flex">
                            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              <p className="font-medium">Bulk Import Tips:</p>
                              <ul className="mt-1 space-y-1">
                                <li>• One email per line or comma-separated</li>
                                <li>• Supports formats: email@domain.com or "Name &lt;email@domain.com&gt;"</li>
                                <li>• Invalid emails will be automatically filtered out</li>
                                <li>• Duplicates will be removed automatically</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {recipientType === 'custom' && (
                      <textarea
                        value={customEmails}
                        onChange={(e) => setCustomEmails(e.target.value)}
                        placeholder="Enter email addresses separated by commas: john@example.com, jane@example.com, bob@company.com"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                      />
                    )}
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        📧 Recipients: <span className="text-[#c1272d] font-bold">{getRecipientCount()}</span> email{getRecipientCount() !== 1 ? 's' : ''}
                      </p>
                      {getRecipientCount() > 100 && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          ⚠️ Large recipient list - emails will be sent in batches of 50
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Content
                  </label>
                  <RichTextEditor
                    value={emailContent}
                    onChange={setEmailContent}
                    placeholder="Write your email content here..."
                  />
                </div>

                {/* Send Button */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowPreview(true)}
                    disabled={!emailSubject.trim() || !emailContent.trim()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Preview Email
                  </button>
                  <button
                    onClick={sendEmail}
                    disabled={isLoading || !emailSubject.trim() || !emailContent.trim()}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#c1272d] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Campaign History</h3>
              
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No campaigns sent yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Recipients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Sent At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {campaign.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {campaign.recipients.length} recipients
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === 'sent' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : campaign.status === 'draft'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {campaign.sentAt ? new Date(campaign.sentAt).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Email Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sender Email (Alias)
                  </label>
                  <select
                    id="senderEmail"
                    value={emailConfig.senderEmail}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, senderEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="noreply@aetechlabs.com">noreply@aetechlabs.com - No-reply emails</option>
                    <option value="jonathan@aetechlabs.com">jonathan@aetechlabs.com - Personal/CEO</option>
                    <option value="yipmong@aetechlabs.com">yipmong@aetechlabs.com - Yipmong</option>
                    <option value="marketing@aetechlabs.com">marketing@aetechlabs.com - Marketing campaigns</option>
                    <option value="sales@aetechlabs.com">sales@aetechlabs.com - Sales outreach</option>
                    <option value="support@aetechlabs.com">support@aetechlabs.com - Technical support</option>
                    <option value="info@aetechlabs.com">info@aetechlabs.com - General inquiries</option>
                    <option value="admin@aetechlabs.com">admin@aetechlabs.com - Administrative</option>
                    <option value="ceo@aetechlabs.com">ceo@aetechlabs.com - Chief Executive Officer</option>
                    <option value="team@aetechlabs.com">team@aetechlabs.com - Team communications</option>
                    <option value="newsletter@aetechlabs.com">newsletter@aetechlabs.com - Newsletter campaigns</option>
                    <option value="updates@aetechlabs.com">updates@aetechlabs.com - Product updates</option>
                    <option value="partnerships@aetechlabs.com">partnerships@aetechlabs.com - Business partnerships</option>
                    <option value="research@aetechlabs.com">research@aetechlabs.com - Research communications</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose which email alias to send from
                  </p>
                </div>

                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    value={emailConfig.senderName}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, senderName: e.target.value }))}
                    placeholder="AETech Research Labs"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Display name for the sender
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="replyTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reply-To Email
                  </label>
                  <select
                    id="replyTo"
                    value={emailConfig.replyTo}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, replyTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d] focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="info@aetechlabs.com">info@aetechlabs.com - General inquiries</option>
                    <option value="jonathan@aetechlabs.com">jonathan@aetechlabs.com - Personal/CEO</option>
                    <option value="yipmong@aetechlabs.com">yipmong@aetechlabs.com - Yipmong</option>
                    <option value="marketing@aetechlabs.com">marketing@aetechlabs.com - Marketing team</option>
                    <option value="sales@aetechlabs.com">sales@aetechlabs.com - Sales team</option>
                    <option value="support@aetechlabs.com">support@aetechlabs.com - Technical support</option>
                    <option value="admin@aetechlabs.com">admin@aetechlabs.com - Administrative</option>
                    <option value="ceo@aetechlabs.com">ceo@aetechlabs.com - Chief Executive Officer</option>
                    <option value="team@aetechlabs.com">team@aetechlabs.com - Team communications</option>
                    <option value="partnerships@aetechlabs.com">partnerships@aetechlabs.com - Business partnerships</option>
                    <option value="research@aetechlabs.com">research@aetechlabs.com - Research communications</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Where replies will be sent when recipients respond to your emails
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium">Email alias setup:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• All aliases use the same ZeptoMail configuration</li>
                      <li>• Choose the appropriate alias for your campaign type</li>
                      <li>• Recipients will see the email coming from the selected alias</li>
                      <li>• Replies will go to the Reply-To address you specify</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveEmailConfig}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#c1272d] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d]"
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Email Preview
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Subject: {emailSubject || 'No subject'}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <strong>From:</strong> {emailConfig.senderName} &lt;{emailConfig.senderEmail}&gt;
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <strong>Reply-To:</strong> {emailConfig.replyTo}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <strong>Recipients:</strong> {getRecipientCount()} email{getRecipientCount() !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Email Preview */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Email Preview
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800">
                  <iframe
                    srcDoc={generateEmailPreview()}
                    className="w-full h-96 border-0"
                    title="Email Preview"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  sendEmail()
                }}
                disabled={isLoading || !emailSubject.trim() || !emailContent.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#c1272d] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c1272d] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Send Email
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
