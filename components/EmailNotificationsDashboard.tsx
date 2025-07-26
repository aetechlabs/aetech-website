'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface NotificationStatus {
  name: string;
  description: string;
  status: 'active' | 'configured' | 'testing';
  trigger: string;
  recipients: string;
}

export default function EmailNotificationsDashboard() {
  const [notifications] = useState<NotificationStatus[]>([
    {
      name: 'Contact Form Submissions',
      description: 'Admin notification when new contact form is submitted',
      status: 'active',
      trigger: 'New contact form submission',
      recipients: 'Admin (support@nxditechsolutions.com.ng)'
    },
    {
      name: 'Contact Confirmations',
      description: 'Confirmation email sent to customers after contact submission',
      status: 'active',
      trigger: 'Contact form submitted',
      recipients: 'Customer (form submitter)'
    },
    {
      name: 'New Blog Comments',
      description: 'Admin notification when new comments or replies are posted',
      status: 'active',
      trigger: 'New comment/reply on blog post',
      recipients: 'Admin'
    },
    {
      name: 'Comment Approvals',
      description: 'Notification to commenter when their comment is approved',
      status: 'active',
      trigger: 'Comment approved by admin',
      recipients: 'Comment author'
    },
    {
      name: 'Reply Notifications',
      description: 'Notification when someone replies to your comment',
      status: 'active',
      trigger: 'New reply to existing comment',
      recipients: 'Original commenter'
    },
    {
      name: 'Contact Status Updates',
      description: 'Notification when contact request status changes',
      status: 'active',
      trigger: 'Admin updates contact status',
      recipients: 'Original contact submitter'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'configured':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'configured':
        return '⚙️';
      case 'testing':
        return '🧪';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          📧 Email Notifications
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          ZeptoMail SMTP Integration
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {notification.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                    {getStatusIcon(notification.status)} {notification.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {notification.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Trigger:</span>
                    <div className="text-gray-600 dark:text-gray-400">{notification.trigger}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Recipients:</span>
                    <div className="text-gray-600 dark:text-gray-400">{notification.recipients}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
          🛠️ SMTP Configuration
        </h4>
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p>✅ ZeptoMail SMTP configured</p>
          <p>✅ HTML email templates ready</p>
          <p>✅ Error handling implemented</p>
          <p>✅ Connection testing active</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">
          ✨ Features Ready
        </h4>
        <div className="text-sm text-green-800 dark:text-green-300 space-y-1">
          <p>📧 Contact form submissions → Admin + Customer notifications</p>
          <p>💬 Blog comments/replies → Admin + Author notifications</p>
          <p>✅ Comment approvals → Author notifications</p>
          <p>📊 Contact status updates → Customer notifications with custom messages</p>
        </div>
      </div>
    </div>
  );
}
