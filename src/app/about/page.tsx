'use client';

import React from 'react';
import { Cpu, Terminal, BookOpen, GraduationCap, Laptop, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  const techStack = [
    { name: 'Next.js 14 (App Router)', desc: 'Modern React framework for optimized static builds and structured client-side routing.', icon: Laptop },
    { name: 'React & TypeScript', desc: 'Typed component interfaces for modular code organization, state variables, and presets.', icon: Settings },
    { name: 'Tailwind CSS v4', desc: 'CSS-in-utility styling optimized for dark theme control-room panel layouts.', icon: Terminal },
    { name: 'Recharts API', desc: 'Dynamic vector charting library for real-time stacked area, line, and status donut visuals.', icon: Cpu },
    { name: 'Framer Motion', desc: 'Declarative physics-based animations for transitions, sidebar draws, and hover cues.', icon: BookOpen }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full font-mono">
      {/* Page Title */}
      <div className="mb-10 text-center md:text-left border-b border-panel-border pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-chakra text-white">System Identification & Profile</h1>
        <p className="text-wind text-xs uppercase tracking-widest mt-2">HRES Node Profile — VSB College of Engineering</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left column - Student & College Profile */}
        <motion.div variants={item} className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-panel-border bg-panel/60 p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-solar/5 rounded-full blur-2xl" />
            <div className="flex items-center space-x-3 mb-6 border-b border-panel-border pb-4">
              <GraduationCap className="w-6 h-6 text-solar" />
              <h2 className="text-lg font-bold font-chakra text-white">Developer Profile</h2>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-500 text-xs block uppercase tracking-wider">Candidate Name</span>
                <span className="text-white font-chakra font-semibold text-lg">Jayantan</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block uppercase tracking-wider">Department</span>
                <span className="text-white text-sm">Computer Science and Engineering</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block uppercase tracking-wider">Academic Level</span>
                <span className="text-white text-sm">College Mini-Project Simulation</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block uppercase tracking-wider">Institution</span>
                <span className="text-white text-sm leading-relaxed">
                  VSB College of Engineering Technical Campus, Coimbatore
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-panel-border bg-panel/40 p-6 text-xs text-gray-500 space-y-2 leading-relaxed">
            <h3 className="font-chakra text-white font-medium mb-2 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-wind" /> System Overview</h3>
            <p>
              The Hybrid Renewable Energy Simulation (HRES) project demonstrates how micro-generation assets can cooperate dynamically. 
            </p>
            <p>
              By resolving Solar, Wind, and Storage equations locally in the browser, users can instantly assess load compliance, cost impacts, and grid balances under custom scenarios.
            </p>
          </div>
        </motion.div>

        {/* Right column - Project details, objectives, tech stack */}
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          {/* Objectives */}
          <div className="rounded-xl border border-panel-border bg-panel/60 p-6 shadow-md">
            <h2 className="text-lg font-bold font-chakra text-white mb-6 flex items-center gap-2 border-b border-panel-border pb-4">
              <span className="w-2 h-2 rounded-full bg-wind animate-pulse" />
              Project Objectives
            </h2>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-wind mt-0.5">▶</span>
                <div>
                  <strong className="text-white font-chakra block">Energy Management Optimization</strong>
                  Implement prioritizations to cover local demand using clean generation, avoiding peak grid tariffs.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wind mt-0.5">▶</span>
                <div>
                  <strong className="text-white font-chakra block">Dynamic Battery Modeling</strong>
                  Simulate lithium-ion charge/discharge dynamics while imposing safety ceilings (capacity) and tracking State of Charge (SOC) metrics.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wind mt-0.5">▶</span>
                <div>
                  <strong className="text-white font-chakra block">Cost Comparison Analysis</strong>
                  Prove economic benefits side-by-side using import/export pricing models (import at ₹8/kWh, export at ₹6/kWh).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-wind mt-0.5">▶</span>
                <div>
                  <strong className="text-white font-chakra block">Environmental Footprint Assessment</strong>
                  Quantify total CO₂ footprint offsets daily utilizing localized carbon grid-replacement factors.
                </div>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="rounded-xl border border-panel-border bg-panel/60 p-6 shadow-md">
            <h2 className="text-lg font-bold font-chakra text-white mb-6 flex items-center gap-2 border-b border-panel-border pb-4">
              <span className="w-2 h-2 rounded-full bg-battery animate-pulse" />
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStack.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <div key={idx} className="p-4 rounded-lg bg-black/40 border border-panel-border/60 hover:border-wind/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-white">
                      <Icon className="w-4 h-4 text-wind" />
                      <span className="font-chakra font-medium text-sm">{tech.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{tech.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
