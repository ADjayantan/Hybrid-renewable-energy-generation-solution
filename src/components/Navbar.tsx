'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X, Activity, Cpu, BookOpen, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/', icon: Activity },
    { name: 'Simulation Dashboard', href: '/dashboard', icon: Cpu },
    { name: 'EMS Methodology', href: '/methodology', icon: BookOpen },
    { name: 'About Project', href: '/about', icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-panel/95 backdrop-blur-md border-b border-panel-border/80 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-black border border-panel-border group-hover:border-solar transition-colors duration-300">
                <Zap className="w-5 h-5 text-solar fill-solar/10 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-lg bg-solar/10 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-chakra text-lg font-bold text-white tracking-wider leading-none">HRES</span>
                <span className="text-[10px] text-wind font-mono tracking-widest uppercase mt-1">TELEMETRY NETWORK</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-md font-chakra font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-solar'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-solar' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-solar"
                      transition={{ type: 'spring' as const, stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-panel-border/50 bg-panel/98"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md font-chakra font-medium text-base transition-colors ${
                      isActive
                        ? 'text-solar bg-solar/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
