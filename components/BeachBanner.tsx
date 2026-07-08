"use client";

import { motion } from "framer-motion";

/**
 * Beach Mode greeting — a warm seaside "postcard" shown while Yana is on her
 * holiday. It speaks straight to her: nothing is late, the streak is paused (not
 * broken), badges are safe. All about her enjoying the sea.
 */
export function BeachBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="clay relative overflow-hidden p-5 sm:p-7"
      style={{ background: "linear-gradient(165deg,#c6ecff 0%,#e6f6ff 42%,#ffe9c4 100%)" }}
      aria-label="Holiday message for Yana"
    >
      {/* bobbing sun */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-5 top-3 select-none text-5xl sm:right-8 sm:top-5 sm:text-6xl"
        style={{ filter: "drop-shadow(0 6px 14px rgba(255,180,60,0.45))" }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        ☀️
      </motion.div>

      <div className="relative z-10 max-w-2xl">
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.22em] text-sky-700/80">
          Beach mode
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Enjoy the sea, Yana! 🏖️
        </h2>
        <p className="mt-3 text-base font-semibold leading-relaxed text-ink/75 sm:text-lg">
          You&rsquo;re on holiday — so maths is on holiday too. Nothing is late and nothing is lost.
          Your streak is <span className="font-extrabold text-ink">paused, not broken</span>, and every
          badge you&rsquo;ve earned is yours to keep. Splash, rest, and have the best time. 🌊 ❤️
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "🔥 Streak paused, safe",
            "🏅 Badges all kept",
            "🐚 The maths will wait",
          ].map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/60 px-3 py-1 text-sm font-bold text-ink/80 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* gentle drifting waves along the bottom */}
      <motion.svg
        aria-hidden
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-[200%] sm:h-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <path d="M0 30 Q150 6 300 30 T600 30 T900 30 T1200 30 V60 H0 Z" fill="#7ecbee" opacity="0.55" />
        <path d="M0 40 Q150 20 300 40 T600 40 T900 40 T1200 40 V60 H0 Z" fill="#4aa9d6" opacity="0.6" />
      </motion.svg>
    </motion.section>
  );
}
