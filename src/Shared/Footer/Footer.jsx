import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaNewspaper } from 'react-icons/fa'

const Footer = () => {
  // Footer navigation sections
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { to: "/", label: "Home" },
        { to: "/all-articles", label: "All Articles" },
        { to: "/subscription", label: "Subscription" },
        { to: "/premium-articles", label: "Premium Articles" }
      ]
    },
    {
      title: "Categories",
      links: [
        { to: "/category/technology", label: "Technology" },
        { to: "/category/business", label: "Business" },
        { to: "/category/sports", label: "Sports" },
        { to: "/category/entertainment", label: "Entertainment" }
      ]
    },
    {
      title: "Support",
      links: [
        { to: "/help", label: "Help Center" },
        { to: "/contact", label: "Contact Us" },
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/terms", label: "Terms of Service" }
      ]
    }
  ]

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/md.rijoanmaruf",
      icon: <FaFacebook className="w-5 h-5" />
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/rijoanmaruf",
      icon: <FaInstagram className="w-5 h-5" />
    },
    {
      name: "GitHub",
      url: "https://github.com/mdrijoanmaruf",
      icon: <FaGithub className="w-5 h-5" />
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mdrijoanmaruf/",
      icon: <FaLinkedin className="w-5 h-5" />
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v12h12V5H4zm2 2h8v2H6V7zm0 4h8v2H6v-2z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-blue-400">News</span>Daily
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted source for breaking news, trending articles, and premium content. 
              Stay informed with the latest updates from around the world.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} NewsDaily. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm">
              Developed by{' '}
              <a
                href="https://rijoan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                Md Rijoan Maruf
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer