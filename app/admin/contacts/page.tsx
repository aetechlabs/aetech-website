'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

interface ProjectDetails {
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  originalMessage: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<{contactId: string, newStatus: Contact['status']}>({contactId: '', newStatus: 'NEW'});
  const [customMessage, setCustomMessage] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'project' | 'general'>('all');

  // Function to parse project details from enhanced messages
  const parseProjectDetails = (message: string): ProjectDetails => {
    const projectDetailsMatch = message.match(/--- Project Details ---([\s\S]*)/);
    
    if (!projectDetailsMatch) {
      return { originalMessage: message };
    }
    
    const projectSection = projectDetailsMatch[1];
    const originalMessage = message.split('--- Project Details ---')[0].trim();
    
    const company = projectSection.match(/Company: (.+)/)?.[1]?.replace('Not specified', '') || '';
    const projectType = projectSection.match(/Project Type: (.+)/)?.[1]?.replace('Not specified', '') || '';
    const budget = projectSection.match(/Budget: (.+)/)?.[1]?.replace('Not specified', '') || '';
    const timeline = projectSection.match(/Timeline: (.+)/)?.[1]?.replace('Not specified', '') || '';
    
    return {
      company: company || undefined,
      projectType: projectType || undefined,
      budget: budget || undefined,
      timeline: timeline || undefined,
      originalMessage
    };
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      console.log('Contacts API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Contacts data:', data);
        setContacts(data);
      } else {
        console.error('Failed to fetch contacts, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status'], customMessage?: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, message: customMessage }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        ));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
        
        // Show success message
        console.log('✅ Contact status updated and notification sent');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleStatusChange = (contactId: string, newStatus: Contact['status']) => {
    setStatusUpdate({ contactId, newStatus });
    setCustomMessage('');
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    await updateContactStatus(statusUpdate.contactId, statusUpdate.newStatus, customMessage);
    setShowStatusModal(false);
    setCustomMessage('');
  };

  const exportContacts = () => {
    const csvData = contacts.map(contact => {
      const projectDetails = parseProjectDetails(contact.message);
      return {
        'Date': new Date(contact.createdAt).toLocaleDateString(),
        'Name': contact.name,
        'Email': contact.email,
        'Phone': contact.phone || '',
        'Country': contact.country || '',
        'Subject': contact.subject,
        'Message': projectDetails.originalMessage,
        'Company': projectDetails.company || '',
        'Project Type': projectDetails.projectType || '',
        'Budget': projectDetails.budget || '',
        'Timeline': projectDetails.timeline || '',
        'Status': contact.status
      };
    });

    const headers = Object.keys(csvData[0]) as Array<keyof typeof csvData[0]>;
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const deleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== id));
        console.log('✅ Contact deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getStatusColor = (status: Contact['status']) => {
    const colors = {
      NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse shadow-lg">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with beautiful gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-8"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 opacity-20">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26c.3.16.67.16.97 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Contact Messages</h1>
              <p className="text-white/80 mt-1">Manage and respond to customer inquiries</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26c.3.16.67.16.97 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              No contact messages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              When visitors use your contact form, their messages will appear here for you to review and respond to.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">📧 Contact Form</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Messages from your website's contact form will appear here
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">🔄 Status Tracking</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Track message status from new to resolved
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {contacts.length} Contact Messages
              </h2>
              
              {/* Export Button */}
              <button
                onClick={exportContacts}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
            
            {/* Filter and Statistics */}
            <div className="flex items-center justify-between mb-6">
              {/* Contact Statistics */}
              <div className="flex items-center space-x-4">
                {(() => {
                  const enhancedContacts = contacts.filter(contact => 
                    contact.message.includes('--- Project Details ---')
                  );
                  const simpleContacts = contacts.filter(contact => 
                    !contact.message.includes('--- Project Details ---')
                  );
                  
                  return (
                    <>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'project' | 'general')}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-800"
                      >
                        <option value="all">All Messages ({contacts.length})</option>
                        <option value="project">Project Inquiries ({enhancedContacts.length})</option>
                        <option value="general">General Messages ({simpleContacts.length})</option>
                      </select>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                          📋 {enhancedContacts.length} Project Inquiries
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400">
                          📧 {simpleContacts.length} General Messages
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {(() => {
              // Filter contacts based on selected filter type
              const filteredContacts = contacts.filter(contact => {
                if (filterType === 'all') return true;
                if (filterType === 'project') return contact.message.includes('--- Project Details ---');
                if (filterType === 'general') return !contact.message.includes('--- Project Details ---');
                return true;
              });

              return filteredContacts.map((contact, index) => {
                const projectDetails = parseProjectDetails(contact.message);
                
                return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {contact.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.email}
                      </p>
                      {(contact.phone || contact.country) && (
                        <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {contact.phone && (
                            <span>📞 {contact.phone}</span>
                          )}
                          {contact.country && (
                            <span>🌍 {contact.country}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Subject: {contact.subject}
                  </p>
                  
                  {/* Original Message */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 mb-4">
                    <p className="text-gray-700 dark:text-gray-300">{projectDetails.originalMessage}</p>
                  </div>

                  {/* Project Details if available */}
                  {(projectDetails.company || projectDetails.projectType || projectDetails.budget || projectDetails.timeline) && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Project Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {projectDetails.company && (
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 dark:text-blue-400">🏢</span>
                            <span className="text-sm">
                              <strong>Company:</strong> {projectDetails.company}
                            </span>
                          </div>
                        )}
                        {projectDetails.projectType && (
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 dark:text-blue-400">📋</span>
                            <span className="text-sm">
                              <strong>Type:</strong> {projectDetails.projectType}
                            </span>
                          </div>
                        )}
                        {projectDetails.budget && (
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 dark:text-blue-400">💰</span>
                            <span className="text-sm">
                              <strong>Budget:</strong> {projectDetails.budget}
                            </span>
                          </div>
                        )}
                        {projectDetails.timeline && (
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 dark:text-blue-400">⏰</span>
                            <span className="text-sm">
                              <strong>Timeline:</strong> {projectDetails.timeline}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value as Contact['status'])}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-800"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <button
                    onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`, '_blank')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
                        deleteContact(contact.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
                );
              });
            })()}
          </div>
        )}
      </motion.div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Update Contact Status
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Updating status to: <span className="font-medium">{statusUpdate.newStatus.replace('_', ' ')}</span>
            </p>
            
            <div className="mb-4">
              <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Optional message to customer:
              </label>
              <textarea
                id="customMessage"
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Add a personal message (optional)..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Update & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
