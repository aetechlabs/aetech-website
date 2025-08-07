'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'AUTHOR';
  createdAt: string;
  posts?: { id: string }[];
  comments?: { id: string }[];
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      console.log('Users API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users data:', data);
        setUsers(data);
      } else {
        console.error('Failed to fetch users, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: string, role: User['role']) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === id ? updatedUser : user));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleColor = (role: User['role']) => {
    const colors = {
      USER: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      AUTHOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[role];
  };

  const getRoleIcon = (role: User['role']) => {
    const icons = {
      USER: '👤',
      AUTHOR: '✍️',
      ADMIN: '👑',
    };
    return icons[role];
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header with beautiful gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 text-white p-4 sm:p-6 lg:p-8"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 opacity-20 hidden sm:block">
          <svg className="w-24 h-24 lg:w-32 lg:h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">User Management</h1>
              <p className="text-white/80 mt-1 text-sm sm:text-base">Manage user accounts and permissions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {(['ADMIN', 'AUTHOR', 'USER'] as const).map((role, index) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg ${getRoleColor(role)} bg-opacity-20`}>
                <span className="text-xl sm:text-2xl">{getRoleIcon(role)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{role}S</h3>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {users.filter(user => user.role === role).length}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {role === 'ADMIN' && 'Full system access and management'}
              {role === 'AUTHOR' && 'Can create and edit blog posts'}
              {role === 'USER' && 'Standard user permissions'}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {users.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              No users yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto px-4">
              Users will appear here when they sign up or are added to the system. You can manage their roles and permissions from this page.
            </p>
            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto px-4">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
                <h4 className="font-medium text-violet-800 dark:text-violet-300 mb-2 text-sm sm:text-base">🔐 Role Management</h4>
                <p className="text-xs sm:text-sm text-violet-700 dark:text-violet-400">
                  Assign and modify user roles and permissions
                </p>
              </div>
              <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-fuchsia-200 dark:border-fuchsia-800">
                <h4 className="font-medium text-fuchsia-800 dark:text-fuchsia-300 mb-2 text-sm sm:text-base">📊 User Analytics</h4>
                <p className="text-xs sm:text-sm text-fuchsia-700 dark:text-fuchsia-400">
                  Track user activity and engagement
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {users.length} Users
              </h2>
            </div>
            
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                        {user.name || 'No name provided'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} bg-opacity-20 text-center sm:text-left`}>
                      {user.role}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Posts</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        {user.posts?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Comments</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        {user.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Role</span>
                      <span className={`px-1 sm:px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)} bg-opacity-20`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as User['role'])}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800 w-full sm:w-auto"
                  >
                    <option value="USER">User</option>
                    <option value="AUTHOR">Author</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete user ${user.name || user.email}?`)) {
                        // Add delete functionality
                        console.log('Delete user:', user.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
