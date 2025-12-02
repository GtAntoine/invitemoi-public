import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Heart } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/10 backdrop-blur-glass border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <Logo />
            <p className="text-gray-700">
              Partagez des moments uniques avec des passionnés de culture.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/invitemoiapp/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex gap-2 items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
              >
                <InstagramIcon />
                @invitemoiapp
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-gray-700 hover:text-gray-900">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link to="/events/create/seeking-host" className="text-gray-700 hover:text-gray-900">
                  Je me fais inviter
                </Link>
              </li>
              <li>
                <Link to="/events/create/offering-host" className="text-gray-700 hover:text-gray-900">
                  J'invite
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-700">
              © {currentYear} Invite Moi. Tous droits réservés.
            </p>
            <p className="text-gray-700 flex items-center gap-1">
              Fait avec <Heart className="w-4 h-4 text-red-500" /> en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}