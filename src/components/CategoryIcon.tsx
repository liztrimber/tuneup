"use client";

import {
  Heart,
  CalendarDays,
  Scale,
  Wallet,
  Baby,
  MessageCircle,
  User,
  Home,
  HeartHandshake,
  ArrowRight,
  type LucideProps,
} from "lucide-react";

const ICONS: Record<string, React.FC<LucideProps>> = {
  Heart,
  CalendarDays,
  Scale,
  Wallet,
  Baby,
  MessageCircle,
  User,
  Home,
  HeartHandshake,
  ArrowRight,
};

export default function CategoryIcon({
  name,
  size = 14,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} style={style} />;
}
