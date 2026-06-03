"use client";

import {
  Heart,
  CalendarDays,
  Scale,
  Wallet,
  Baby,
  MessageCircle,
  User,
  Users,
  Home,
  HeartHandshake,
  ArrowRight,
  UtensilsCrossed,
  Sparkles,
  Wrench,
  PawPrint,
  TreePine,
  Brain,
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
  Users,
  Home,
  HeartHandshake,
  ArrowRight,
  UtensilsCrossed,
  Sparkles,
  Wrench,
  PawPrint,
  TreePine,
  Brain,
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
