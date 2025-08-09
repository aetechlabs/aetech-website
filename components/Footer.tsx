import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/assets/Dark transparent logo.png"
                alt="AETech Research Labs Limited"
                width={120}
                height={40}
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/assets/Light transparent logo.png"
                alt="AETech Research Labs Limited"
                width={120}
                height={40}
                className="h-8 w-auto hidden dark:block"
              />
              <span className="text-xl font-bold">AETech Labs</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Empowering Africa through innovative technology solutions, research, and education. 
              Building the future of tech in Africa.
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>AETech Research Labs Limited</p>
              <p>RC 8627078</p>
              <p>Suite 30, 2nd Floor Es-Em Plaza</p>
              <p>No 34, Munguno Crescent, Behind Berger Yard</p>
              <p>Utako Abuja, Nigeria</p>
            </div>
          </div>
          
          {/* Quick Links and Legal sections - side by side on mobile */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/bootcamp" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Bootcamp
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Contact Info</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">info@aetechlabs.com</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">+234 704 440 0347</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 AETech Research Labs Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
