'use client';

import React from 'react';
import { Sun, Wind, Battery, Zap, ChevronRight, Calculator, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Methodology() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full font-mono">
      {/* Header */}
      <div className="mb-10 text-center md:text-left border-b border-panel-border pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-chakra text-white">Mathematical Modeling & EMS Logic</h1>
        <p className="text-wind text-xs uppercase tracking-widest mt-2">Formal Equation Matrix and Optimization Strategy</p>
      </div>

      {/* Grid Layout */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Intro */}
        <motion.div variants={item} className="rounded-xl border border-panel-border bg-panel/60 p-6 md:p-8">
          <h2 className="text-xl font-bold font-chakra text-solar mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5" /> Executive Summary
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            The hybrid system operates as a zero-inertia microgrid simulator. At each hour {"\\(h \\in [0, 23]\\)"}, the engine re-evaluates environmental inputs (irradiance, wind speed, load profile) and applies a greedy Energy Management System (EMS) control flow to balance localized generation against a dual-peak demand curve.
          </p>
        </motion.div>

        {/* The Math Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solar PV Model */}
          <div className="rounded-xl border border-panel-border bg-panel/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-panel-border/50 pb-2">
                <Sun className="w-5 h-5 text-solar" />
                <h3 className="font-chakra text-white font-bold">1. Solar PV Math</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Solar irradiance follows a diurnal sine curve representing sun movement. It is throttled by cloud cover factor.
              </p>
              <div className="bg-black/50 rounded-lg p-3 text-[11px] space-y-3 border border-panel-border/40 font-mono">
                <div>
                  <span className="text-wind font-semibold">Shape Factor:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(S_{solar}(h) = \\max\\left(0, \\sin\\left(\\frac{h-6}{12}\\pi\\right)\\right)\\)"}
                  </div>
                </div>
                <div>
                  <span className="text-wind font-semibold">Final Output:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(P_{sol}(h) = C_{sol} \\cdot S_{solar}(h) \\cdot \\left(1 - \\frac{Cloud\\%}{100}\\right)\\)"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 italic">
              Active between 06:00 and 18:00 hrs.
            </div>
          </div>

          {/* Wind turbine Model */}
          <div className="rounded-xl border border-panel-border bg-panel/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-panel-border/50 pb-2">
                <Wind className="w-5 h-5 text-wind" />
                <h3 className="font-chakra text-white font-bold">2. Wind Turbine Math</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Wind speed fluctuates dynamically. Turbine output follows a cubic power curve bounded by cut-in, rated, and cut-out limits.
              </p>
              <div className="bg-black/50 rounded-lg p-3 text-[11px] space-y-3 border border-panel-border/40 font-mono">
                <div>
                  <span className="text-wind font-semibold">Wind Speed Curve:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(v(h) = v_{avg} + 2.5\\sin\\left(\\frac{h}{24}2\\pi + 1.2\\right) + 1.2\\sin(1.7h)\\)"}
                  </div>
                </div>
                <div>
                  <span className="text-wind font-semibold">Power Fraction:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(f_p(v) = \\begin{cases} 0 & v < 3 \\\\ (\\frac{v-3}{9})^3 & 3 \\le v < 12 \\\\ 1 & 12 \\le v < 25 \\\\ 0 & v \\ge 25 \\end{cases}\\)"}
                  </div>
                </div>
                <div>
                  <span className="text-wind font-semibold">Final Power:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(P_{wnd}(h) = C_{wnd} \\cdot f_p(v(h))\\)"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 italic">
              Cut-in: 3 m/s, Rated: 12 m/s, Cut-out: 25 m/s.
            </div>
          </div>

          {/* Load Model */}
          <div className="rounded-xl border border-panel-border bg-panel/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-panel-border/50 pb-2">
                <Zap className="w-5 h-5 text-grid-import" />
                <h3 className="font-chakra text-white font-bold">3. Load Demand Math</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Represents a typical industrial-residential dual-peak demand pattern (morning commute peak & evening domestic peak).
              </p>
              <div className="bg-black/50 rounded-lg p-3 text-[11px] space-y-3 border border-panel-border/40 font-mono">
                <div>
                  <span className="text-wind font-semibold">Shape Factor:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(S_{load}(h) = 0.35 + 0.45e^{-\\frac{(h-8)^2}{4}} + 0.55e^{-\\frac{(h-19)^2}{6}}\\)"}
                  </div>
                </div>
                <div>
                  <span className="text-wind font-semibold">Final Load:</span>
                  <div className="mt-1 text-gray-300">
                    {"\\(P_{load}(h) = C_{peak} \\cdot S_{load}(h)\\)"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 italic">
              Peaks occur at 08:00 (work start) and 19:00 (residential peak).
            </div>
          </div>
        </motion.div>

        {/* EMS Priority Flowchart */}
        <motion.div variants={item} className="rounded-xl border border-panel-border bg-panel/60 p-6 md:p-8">
          <h2 className="text-xl font-bold font-chakra text-white mb-6 border-b border-panel-border pb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-battery animate-spin-slow" />
            Energy Management System (EMS) Dispatch Logic
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Written description */}
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                At each hour, the EMS calculates net energy: 
                <br />
                <code className="text-solar bg-black/40 px-2 py-0.5 rounded border border-panel-border">
                  net = (Solar + Wind) - Load
                </code>
              </p>

              <div className="space-y-3 mt-4">
                <div className="p-3 rounded-lg bg-black/30 border-l-2 border-battery">
                  <strong className="text-white font-chakra text-xs block mb-1">Scenario A: Net Power &ge; 0 (Surplus)</strong>
                  <p className="text-xs text-gray-400">
                    1. Direct local demand is fully satisfied by renewables.
                    <br />
                    2. Excess energy is routed to charge the battery: 
                    <code className="text-[10px] text-battery bg-black/50 block p-1 mt-1 rounded border border-panel-border">
                      SOC(h) = min(Cap_bat, SOC(h-1) + net)
                    </code>
                    3. Any remaining surplus after charging the battery is exported to the grid at ₹6/kWh.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/30 border-l-2 border-grid-import">
                  <strong className="text-white font-chakra text-xs block mb-1">Scenario B: Net Power &lt; 0 (Deficit)</strong>
                  <p className="text-xs text-gray-400">
                    1. Generation is insufficient to meet local demand.
                    <br />
                    2. The battery discharges to cover the deficit:
                    <code className="text-[10px] text-battery bg-black/50 block p-1 mt-1 rounded border border-panel-border">
                      Discharge = min(|net|, SOC(h-1))
                    </code>
                    3. Any remaining deficit after battery depletion is imported from the grid at ₹8/kWh.
                  </p>
                </div>
              </div>
            </div>

            {/* SVG Flowchart */}
            <div className="flex justify-center p-4 bg-black/30 rounded-xl border border-panel-border/60">
              <svg viewBox="0 0 420 480" className="w-full max-w-[380px] font-mono h-auto">
                {/* Start Block */}
                <rect x="150" y="10" width="120" height="35" rx="5" fill="#1c2530" stroke="#22d3ee" strokeWidth="1" />
                <text x="210" y="32" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Hourly Step h</text>

                {/* Arrow */}
                <path d="M 210 45 L 210 75" fill="none" stroke="#22d3ee" strokeWidth="1" />
                <polygon points="210,75 206,68 214,68" fill="#22d3ee" />

                {/* Calculate Gen and Load */}
                <rect x="110" y="75" width="200" height="40" rx="4" fill="#0f1620" stroke="#1c2530" strokeWidth="1" />
                <text x="210" y="93" fill="#8892b0" fontSize="10" textAnchor="middle">Compute Solar(h) & Wind(h)</text>
                <text x="210" y="107" fill="#8892b0" fontSize="10" textAnchor="middle">Compute Load(h)</text>

                {/* Arrow */}
                <path d="M 210 115 L 210 145" fill="none" stroke="#22d3ee" strokeWidth="1" />
                <polygon points="210,145 206,138 214,138" fill="#22d3ee" />

                {/* Decision Block (Diamond) */}
                <polygon points="210,145 270,185 210,225 150,185" fill="#0a0e13" stroke="#f5a623" strokeWidth="1" />
                <text x="210" y="181" fill="#f5a623" fontSize="10" textAnchor="middle" fontWeight="bold">Is Net &ge; 0?</text>
                <text x="210" y="195" fill="#f5a623" fontSize="9" textAnchor="middle">Gen &ge; Load?</text>

                {/* Yes Arrow (Right) */}
                <path d="M 270 185 L 340 185 L 340 240" fill="none" stroke="#34d399" strokeWidth="1" />
                <polygon points="340,240 336,233 344,233" fill="#34d399" />
                <text x="295" y="177" fill="#34d399" fontSize="10" fontWeight="bold">YES</text>

                {/* No Arrow (Left) */}
                <path d="M 150 185 L 80 185 L 80 240" fill="none" stroke="#fb7185" strokeWidth="1" />
                <polygon points="80,240 76,233 84,233" fill="#fb7185" />
                <text x="125" y="177" fill="#fb7185" fontSize="10" fontWeight="bold">NO</text>

                {/* Scenario A (Right Node) */}
                <rect x="260" y="240" width="150" height="75" rx="4" fill="#0f1620" stroke="#34d399" strokeWidth="1" />
                <text x="335" y="258" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">Surplus Dispatch</text>
                <text x="335" y="275" fill="#8892b0" fontSize="9" textAnchor="middle">1. Charge Battery</text>
                <text x="335" y="290" fill="#8892b0" fontSize="9" textAnchor="middle">2. Grid Export Surplus</text>
                <text x="335" y="303" fill="#8892b0" fontSize="9" textAnchor="middle">(Earn ₹6/kWh credit)</text>

                {/* Scenario B (Left Node) */}
                <rect x="10" y="240" width="140" height="75" rx="4" fill="#0f1620" stroke="#fb7185" strokeWidth="1" />
                <text x="80" y="258" fill="#fb7185" fontSize="10" textAnchor="middle" fontWeight="bold">Deficit Dispatch</text>
                <text x="80" y="275" fill="#8892b0" fontSize="9" textAnchor="middle">1. Discharge Battery</text>
                <text x="80" y="290" fill="#8892b0" fontSize="9" textAnchor="middle">2. Grid Import Deficit</text>
                <text x="80" y="303" fill="#8892b0" fontSize="9" textAnchor="middle">(Pay ₹8/kWh rate)</text>

                {/* Confluence Arrows */}
                <path d="M 335 315 L 335 365 L 210 365" fill="none" stroke="#34d399" strokeWidth="1" />
                <path d="M 80 315 L 80 365 L 210 365" fill="none" stroke="#fb7185" strokeWidth="1" />
                <polygon points="210,365 217,361 217,369" fill="#1c2530" />

                {/* Accumulate State */}
                <rect x="120" y="380" width="180" height="40" rx="4" fill="#0f1620" stroke="#22d3ee" strokeWidth="1" />
                <text x="210" y="398" fill="#fff" fontSize="9" textAnchor="middle">Save SOC & Costs</text>
                <text x="210" y="411" fill="#8892b0" fontSize="9" textAnchor="middle">Advance h = h + 1</text>

                {/* Arrow to Accumulate */}
                <path d="M 210 365 L 210 380" fill="none" stroke="#22d3ee" strokeWidth="1" />
                <polygon points="210,380 206,373 214,373" fill="#22d3ee" />

                {/* End/Loop */}
                <path d="M 210 420 L 210 445" fill="none" stroke="#22d3ee" strokeWidth="1" />
                <polygon points="210,445 206,438 214,438" fill="#22d3ee" />
                <rect x="150" y="445" width="120" height="25" rx="4" fill="#1c2530" stroke="#22d3ee" strokeWidth="1" />
                <text x="210" y="461" fill="#fff" fontSize="10" textAnchor="middle">End 24h Cycle</text>
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
