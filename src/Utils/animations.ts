import { type Variants } from 'motion/react';

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;
const quickEase = [0.4, 0, 0.2, 1] as const;
const premiumEase = [0.16, 1, 0.3, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const pageReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: smoothEase },
  },
};

// Page wrapper fade in
export const pageFadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: smoothEase },
};

// Grid crossfade when filter/sort changes
export const gridCrossfade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.15, ease: quickEase },
};

// Course card entrance + hover effect
export const cardFadeInHover = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: quickEase },
  whileHover: {
    y: -4,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    transition: { duration: 0.2 }
  }
};

// Course card exit
export const cardExit = {
  opacity: 0,
  transition: { duration: 0.1 }
};

// Image hover zoom
export const imageHover = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.3, ease: smoothEase }
};

export const revealLeft = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, ease: premiumEase }
};

export const cinematicScale = {
  initial: { opacity: 0, scale: 1.08 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: premiumEase }
};

export const blurRevealUp = {
  initial: { opacity: 0, y: 30, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: premiumEase }
};

export const blurRevealRight = {
  initial: { opacity: 0, x: 30, filter: 'blur(6px)' },
  whileInView: { opacity: 1, x: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: premiumEase }
};

export const springScaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 150, damping: 12 }
};

export const btnHoverTap = {
  whileHover: { scale: 1.03, boxShadow: "0 8px 20px rgba(var(--primary-rgb), 0.25)" },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 200, damping: 10 }
};

export const simpleFadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export const getCurriculumItem = (index: number) => ({
  initial: { opacity: 0, x: index % 2 === 0 ? -20 : 20, scale: 0.97 },
  whileInView: { opacity: 1, x: 0, scale: 1 },
  viewport: { once: true },
  transition: {
    type: "spring" as const,
    stiffness: 100,
    damping: 12,
    delay: index * 0.07
  }
});

// Hero section premium reveal (No blur on text to prevent breaking)
export const heroReveal = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: premiumEase }
};

// Smooth reveal for complex Card wrappers (No blur!)
export const cardRevealUp = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, ease: premiumEase }
};

// Staggered reveal for workshop list items (No blur, smooth slide up)
export const getWorkshopItem = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, delay: index * 0.08, ease: premiumEase }
});

// Smooth reveal from the right (for sidebar cards)
export const revealRight = {
  initial: { opacity: 0, x: 25 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: premiumEase }
};

// Timeline agenda items staggered from left
export const getAgendaItem = (index: number) => ({
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.4, delay: index * 0.1, ease: premiumEase }
});

// Stagger reveal for profile stats
export const getStatItem = (index: number) => ({
  initial: { opacity: 0, y: 15, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.4, delay: index * 0.08, ease: premiumEase }
});

export const getFormItem = (index: number) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: 0.3 + index * 0.08, ease: premiumEase }
});