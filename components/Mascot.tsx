"use client";

import { motion } from "framer-motion";

/** stage: 0 egg · 1 kitten · 2 cool cat · 3 champion */
export function Mascot({ stage, size = 132 }: { stage: number; size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg viewBox="0 0 220 220" width={size} height={size}>
        <defs>
          <radialGradient id="fur" cx="42%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#f4f0ff" />
            <stop offset="100%" stopColor="#ddd4fb" />
          </radialGradient>
        </defs>

        {/* soft shadow */}
        <ellipse cx="110" cy="198" rx="56" ry="12" fill="#4a3f86" opacity="0.12" />

        {stage === 0 ? (
          <Egg />
        ) : (
          <g>
            {/* ears */}
            <path d="M64 86 L50 30 L112 74 Z" fill="url(#fur)" stroke="#4a3f86" strokeWidth="6" strokeLinejoin="round" />
            <path d="M156 86 L170 30 L108 74 Z" fill="url(#fur)" stroke="#4a3f86" strokeWidth="6" strokeLinejoin="round" />
            <path d="M70 78 L62 47 L96 70 Z" fill="#ffb4c6" />
            <path d="M150 78 L158 47 L124 70 Z" fill="#ffb4c6" />
            {/* head */}
            <circle cx="110" cy="124" r="64" fill="url(#fur)" stroke="#4a3f86" strokeWidth="6" />
            {/* blush */}
            <ellipse cx="74" cy="140" rx="12" ry="8" fill="#ffb4c6" opacity="0.8" />
            <ellipse cx="146" cy="140" rx="12" ry="8" fill="#ffb4c6" opacity="0.8" />

            {stage >= 2 ? (
              // cool sunglasses
              <g stroke="#2c2550" strokeWidth="5">
                <rect x="64" y="106" width="36" height="26" rx="11" fill="#2c2550" />
                <rect x="120" y="106" width="36" height="26" rx="11" fill="#2c2550" />
                <path d="M100 116 q10 -6 20 0" fill="none" />
                <circle cx="76" cy="115" r="3" fill="#fff" stroke="none" />
                <circle cx="132" cy="115" r="3" fill="#fff" stroke="none" />
              </g>
            ) : (
              // big eyes
              <g>
                <circle cx="86" cy="120" r="11" fill="#2c2550" />
                <circle cx="134" cy="120" r="11" fill="#2c2550" />
                <circle cx="90" cy="116" r="3.6" fill="#fff" />
                <circle cx="138" cy="116" r="3.6" fill="#fff" />
              </g>
            )}

            {/* nose + mouth */}
            <path d="M104 142 L116 142 L110 150 Z" fill="#ff7a9c" />
            <path d="M110 150 q0 10 -10 10 M110 150 q0 10 10 10" fill="none" stroke="#4a3f86" strokeWidth="4.5" strokeLinecap="round" />
            {/* whiskers */}
            <g stroke="#4a3f86" strokeWidth="4" strokeLinecap="round">
              <path d="M58 134 L34 130 M58 144 L36 146 M162 134 L186 130 M162 144 L184 146" />
            </g>

            {stage >= 3 && (
              // champion crown + sparkles
              <g>
                <path d="M74 58 L88 78 L110 52 L132 78 L146 58 L142 86 L78 86 Z" fill="#ffcb45" stroke="#d98613" strokeWidth="5" strokeLinejoin="round" />
                <circle cx="110" cy="50" r="5" fill="#ff7a3d" />
                <Sparkle x={40} y={70} /><Sparkle x={178} y={64} /><Sparkle x={188} y={132} />
              </g>
            )}
          </g>
        )}
      </svg>
    </motion.div>
  );
}

function Egg() {
  return (
    <g>
      <path d="M62 76 L52 36 L104 70 Z" fill="#ece7ff" stroke="#4a3f86" strokeWidth="6" strokeLinejoin="round" />
      <path d="M158 76 L168 36 L116 70 Z" fill="#ece7ff" stroke="#4a3f86" strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="110" cy="132" rx="68" ry="74" fill="#fff7e6" stroke="#4a3f86" strokeWidth="6" />
      <path
        d="M42 120 L62 112 L80 122 L100 110 L120 122 L140 110 L160 122 L178 114"
        fill="none"
        stroke="#4a3f86"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="98" r="7" fill="#2c2550" />
      <circle cx="128" cy="98" r="7" fill="#2c2550" />
      <ellipse cx="78" cy="108" rx="9" ry="6" fill="#ffb4c6" opacity="0.7" />
      <ellipse cx="142" cy="108" rx="9" ry="6" fill="#ffb4c6" opacity="0.7" />
    </g>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y - 9} L${x + 2.5} ${y - 2.5} L${x + 9} ${y} L${x + 2.5} ${y + 2.5} L${x} ${y + 9} L${x - 2.5} ${y + 2.5} L${x - 9} ${y} L${x - 2.5} ${y - 2.5} Z`}
      fill="#ffcb45"
    />
  );
}
