import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-8 sm:mt-12 lg:mt-16">
      <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-yellow-500 dark:to-yellow-600 text-white font-bold text-sm sm:text-base rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                LM
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Labour</span>
                <span className="font-semibold text-red-600 dark:text-yellow-400 text-xs sm:text-sm">Mandi</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              India's pan-India marketplace connecting customers with skilled technicians across 100+ categories.
            </p>
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-3 sm:mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => window.location.href = '/about'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer" data-testid="link-about">
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => window.location.href = '/'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Browse Technicians
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/post-job'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Post a Job
                </button>
              </li>
              <li>
                <button className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Become a Technician
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  FAQ
                </button>
              </li>
              <li>
                <button className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer">
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => window.location.href = '/privacy-policy'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer" data-testid="link-privacy-policy">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/terms-of-service'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer" data-testid="link-terms-of-service">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/refund-policy'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer" data-testid="link-refund-policy">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/cancellation-policy'} className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-yellow-400 text-sm transition-colors cursor-pointer" data-testid="link-cancellation-policy">
                  Cancellation Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Get Started CTA */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Get Started</h4>
            <div className="space-y-2 mb-4">
              <Button
                className="w-full h-9 bg-red-600 hover:bg-red-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-all"
                data-testid="footer-post-job-btn"
              >
                Post Your Job
              </Button>
              <Button
                className="w-full h-9 bg-red-600 hover:bg-red-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-all"
                data-testid="footer-become-tech-btn"
              >
                Join as Technician
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700 mb-4 sm:mb-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            © 2025 LabourMandi. All rights reserved.
          </p>
          <div className="flex gap-3">
            <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors" data-testid="social-facebook">
              <Facebook className="h-4 w-4" />
            </button>
            <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors" data-testid="social-twitter">
              <Twitter className="h-4 w-4" />
            </button>
            <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors" data-testid="social-linkedin">
              <Linkedin className="h-4 w-4" />
            </button>
            <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-orange-400 transition-colors" data-testid="social-instagram">
              <Instagram className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
