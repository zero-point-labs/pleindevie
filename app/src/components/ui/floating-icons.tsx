"use client";

import { motion } from "framer-motion";
import {
  Hammer,
  Wrench,
  PaintBucket,
  Home,
  Lightbulb,
  Ruler,
  Drill,
  Palette,
  HardHat,
  Zap,
} from "lucide-react";

interface FloatingIconProps {
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  x: string;
  y: string;
  delay: number;
  duration: number;
  size?: number;
  color?: string;
  glowColor?: string;
}

const FloatingIcon = ({
  icon: Icon,
  x,
  y,
  delay,
  duration,
  size = 24,
  color = "#fbbf24",
  glowColor = "#fbbf24",
}: FloatingIconProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.5, 0.3, 0.7, 0.2, 0.4],
        scale: [0, 1, 1.1, 0.9, 1.05, 1],
        y: [0, -15, 3, -12, 6, 0],
        x: [0, 3, -2, 5, -3, 0],
        rotate: [0, 5, -3, 8, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-60"
        style={{
          background: `radial-gradient(circle, ${glowColor}30 0%, transparent 70%)`,
          width: size * 1.5,
          height: size * 1.5,
          left: -size / 4,
          top: -size / 4,
        }}
      />
      {/* Icon */}
      <Icon
        size={size}
        color={color}
        className="relative drop-shadow-md opacity-80"
      />
    </motion.div>
  );
};

export const FloatingIcons = () => {
  const icons = [
    // Top area icons - positioned to avoid header and main title
    {
      icon: Hammer,
      x: "8%",
      y: "12%",
      delay: 0,
      duration: 8,
      size: 24,
      color: "#fbbf24",
      glowColor: "#fcd34d",
    },
    {
      icon: Wrench,
      x: "92%",
      y: "18%",
      delay: 1.5,
      duration: 10,
      size: 22,
      color: "#fcd34d",
      glowColor: "#fbbf24",
    },
    {
      icon: Drill,
      x: "15%",
      y: "8%",
      delay: 1,
      duration: 7,
      size: 20,
      color: "#fcd34d",
      glowColor: "#fbbf24",
    },
    
    // Left side icons - positioned to avoid text content area
    {
      icon: Lightbulb,
      x: "3%",
      y: "35%",
      delay: 4,
      duration: 11,
      size: 20,
      color: "#f59e0b",
      glowColor: "#fbbf24",
    },
    {
      icon: PaintBucket,
      x: "6%",
      y: "65%",
      delay: 3,
      duration: 12,
      size: 22,
      color: "#fbbf24",
      glowColor: "#fcd34d",
    },
    
    // Right side icons - positioned around the image area but not overlapping
    {
      icon: Palette,
      x: "88%",
      y: "35%",
      delay: 3.5,
      duration: 10,
      size: 24,
      color: "#fbbf24",
      glowColor: "#fcd34d",
    },
    {
      icon: Ruler,
      x: "85%",
      y: "55%",
      delay: 2.5,
      duration: 13,
      size: 22,
      color: "#fbbf24",
      glowColor: "#fcd34d",
    },
    {
      icon: Zap,
      x: "95%",
      y: "45%",
      delay: 4.5,
      duration: 8,
      size: 18,
      color: "#fcd34d",
      glowColor: "#fbbf24",
    },
    
    // Bottom area icons - positioned to avoid buttons and footer content
    {
      icon: HardHat,
      x: "12%",
      y: "88%",
      delay: 0.5,
      duration: 14,
      size: 24,
      color: "#f59e0b",
      glowColor: "#fbbf24",
    },
    {
      icon: Home,
      x: "88%",
      y: "82%",
      delay: 2,
      duration: 9,
      size: 26,
      color: "#fcd34d",
      glowColor: "#fbbf24",
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((iconProps, index) => (
        <FloatingIcon key={index} {...iconProps} />
      ))}
    </div>
  );
};
