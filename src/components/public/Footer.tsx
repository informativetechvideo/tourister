import Link from 'next/link'
import { MapPin, Phone, Mail, Globe, Heart, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Tourister</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Creating unforgettable travel experiences with handpicked destinations and personalized service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/packages" className="text-sm hover:text-white transition-colors">All Packages</Link></li>
              <li><Link href="/enquiry" className="text-sm hover:text-white transition-colors">Send Enquiry</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-blue-400" />
                +91 99999 99999
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                info@tourister.com
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Heart className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Tourister. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
