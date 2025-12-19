import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-800 to-red-900 text-white border-t border-red-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left - Branding */}
          <div className="flex items-center">
            <div className="relative bg-white rounded-full p-1.5 mr-3">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full"></div>
              <svg className="relative w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">भारतीय डाक</h3>
              <p className="text-yellow-300 text-xs font-medium">INDIA POST</p>
            </div>
          </div>
          
          {/* Center - Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/register-complaint" className="text-yellow-100 hover:text-white hover:underline transition-colors">
              Register Complaint
            </a>
            <span className="text-red-400">•</span>
            <a href="/track-complaint" className="text-yellow-100 hover:text-white hover:underline transition-colors">
              Track Status
            </a>
            <span className="text-red-400">•</span>
            <a href="/faq" className="text-yellow-100 hover:text-white hover:underline transition-colors">
              FAQ
            </a>
            <span className="text-red-400">•</span>
            <a href="/contact" className="text-yellow-100 hover:text-white hover:underline transition-colors">
              Contact
            </a>
          </div>
          
          {/* Right - Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-yellow-100">
              © 2025 India Post
            </p>
            <p className="text-xs text-yellow-200/70">
              Ministry of Communications
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-4 pt-4 border-t border-red-700/50 text-center">
          <p className="text-xs text-yellow-200/60">
            Helpline: 1800-266-6868 • Email: support@indiapost.gov.in
          </p>
          <p className="text-xs text-yellow-200/40 mt-1 italic">
            Prototype for academic and demonstration purposes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;