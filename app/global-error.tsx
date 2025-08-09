'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        {/* Global Error Page Content */}
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <svg 
                  className="w-12 h-12 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Server Error
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We're experiencing technical difficulties. Our engineering team has been automatically 
                notified and is working to resolve this issue.
              </p>
              
              {/* Error Details (for development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left mb-6">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    Error Details (Development Mode):
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                    {error?.message || 'Unknown error'}
                  </p>
                  {error?.digest && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Illustration */}
            <div className="mb-12">
              <div className="text-6xl mb-6">🛠️</div>
              <p className="text-gray-500 dark:text-gray-500 italic">
                "We're fixing this faster than you can say 'JavaScript'"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              <a
                href="/"
                className="inline-flex items-center border border-red-500 text-red-500 hover:bg-red-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </a>
            </div>

            {/* Support Information */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm">
                Need immediate assistance?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a 
                  href="mailto:support@aetechlabs.com" 
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  Email Support
                </a>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <a 
                  href="/contact" 
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                >
                  Contact Form
                </a>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-gray-500 dark:text-gray-500">
                  Status: Investigating
                </span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
