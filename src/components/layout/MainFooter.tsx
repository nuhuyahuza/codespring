import { Link } from 'react-router-dom';

export function MainFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Codespring</h4>
            <p className="text-gray-400">
              Empowering the next generation of developers
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-gray-400 hover:text-white">
                  Instructors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/codespring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/codespring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/codespring"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Codespring. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 