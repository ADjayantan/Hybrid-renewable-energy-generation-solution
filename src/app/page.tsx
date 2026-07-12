'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Wind, BatteryCharging, ShieldAlert, ChevronRight, Zap, Play, Cpu, Server, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  const systems = [
    {
      title: 'Solar Photovoltaic',
      description: 'Converts solar irradiance into direct current (DC) electricity via a sine-wave curve model peaking at solar noon.',
      icon: Sun,
      color: 'text-solar border-solar/20 bg-solar/5',
      glow: 'shadow-solar/10',
    },
    {
      title: 'Wind Turbines',
      description: 'Generates power using a standard cubic turbine curve based on dynamic hour-to-hour wind speeds.',
      icon: Wind,
      color: 'text-wind border-wind/20 bg-wind/5',
      glow: 'shadow-wind/10',
    },
    {
      title: 'Battery Storage',
      description: 'Acts as the system buffer. Stores excess energy and discharges during solar/wind deficits.',
      icon: BatteryCharging,
      color: 'text-battery border-battery/20 bg-battery/5',
      glow: 'shadow-battery/10',
    },
    {
      title: 'Smart Utility Grid',
      description: 'Ensures system reliability. Imports deficit power and exports surplus to optimize operating costs.',
      icon: Zap,
      color: 'text-grid-export border-grid-export/20 bg-grid-export/5',
      glow: 'shadow-grid-export/10',
    },
  ];

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-panel/30 via-background to-background">
      {/* Background Matrix/Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c2530_1px,transparent_1px),linear-gradient(to_bottom,#1c2530_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Top Pill Indicator */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-panel-border bg-panel/85 text-xs text-wind font-mono uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-wind animate-pulse" />
            <span>Multi-Source Microgrid Simulator</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-chakra text-white tracking-tight mb-6"
          >
            Hybrid Renewable <br />
            <span className="bg-gradient-to-r from-solar via-wind to-battery bg-clip-text text-transparent">
              Energy Generation Solution
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-400 font-mono max-w-2xl leading-relaxed mb-10"
          >
            An interactive simulator utilizing smart EMS dispatch algorithms to combine Solar PV, Wind Turbines, Lithium-Ion storage, and Grid integration.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-lg bg-solar hover:bg-solar/90 text-black font-chakra font-bold text-base transition-all duration-300 shadow-lg shadow-solar/20 hover:scale-105"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Launch Live Dashboard</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/methodology"
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-lg bg-panel hover:bg-white/5 border border-panel-border text-white font-chakra font-medium text-base transition-colors duration-300 hover:border-wind/50"
            >
              <Cpu className="w-4 h-4 text-wind" />
              <span>Explore Math & EMS</span>
            </Link>

            <a
              href="/Hybrid-renewable-energy-generation-solution/Hybrid_Renewable_Energy_Report.docx"
              download
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-lg bg-panel hover:bg-white/5 border border-panel-border text-white font-chakra font-medium text-base transition-colors duration-300 hover:border-battery/50"
            >
              <FileDown className="w-4 h-4 text-battery" />
              <span>Download Word Report</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Problem Statement Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mt-24 max-w-5xl mx-auto rounded-2xl border border-panel-border bg-panel/50 backdrop-blur-sm p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-grid-import/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-shrink-0 p-4 rounded-xl bg-grid-import/10 border border-grid-import/20 text-grid-import">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-chakra text-white mb-3">
                The Core Problem: Renewable Intermittency
              </h2>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                Standalone solar or wind energy systems suffer from extreme reliability issues. Solar drops to zero at night and degrades on cloudy days; wind velocities fluctuate wildly and unpredictable weather shapes supply curves. Neither can dynamically match load demands without massive curtailment or costly grid penalties.
              </p>
              <div className="mt-4 flex flex-wrap gap-6 text-xs text-gray-500 font-mono">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-grid-import" /> Solar drops to 0% at night</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-grid-import" /> Wind speed unpredictability</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-battery" /> Dynamic Battery stabilization required</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Components Section */}
        <div className="mt-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-chakra text-white">How the Hybrid System Works</h2>
            <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
              Four integrated assets coordinated by the Energy Management System
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {systems.map((sys, idx) => {
              const Icon = sys.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`group relative rounded-xl border p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300 shadow-md ${sys.glow} bg-panel/40 hover:bg-panel/75`}
                >
                  <div>
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-5 ${sys.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold font-chakra text-white mb-2 group-hover:text-white transition-colors">
                      {sys.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono leading-relaxed">
                      {sys.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-[10px] text-wind font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>SYSTEM ONLINE</span>
                    <Server className="w-3 h-3 ml-1 animate-pulse" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
