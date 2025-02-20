import { cn } from "@/lib/utils";
import { Sword, Shield, HardHat, Footprints } from 'lucide-react';

interface TilePrototypeProps {
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory';
  variation: string;
  level: number;
  subLevel?: number;
}

// Color mapping for variations
const variationColors: Record<string, string> = {
  'A': 'text-yellow-500',  // Gold
  'B': 'text-blue-500',    // Blue
  'C': 'text-red-500',     // Red
  'D': 'text-green-500',   // Green
  'E': 'text-purple-500',  // Purple
  'F': 'text-orange-500',  // Orange
};

// Custom ring icon component
function RingIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Diamond */}
      <path d="M12 4L14 8L12 10L10 8L12 4" />
      {/* Ring band */}
      <path d="M8 12C8 8 16 8 16 12C16 16 8 16 8 12Z" />
    </svg>
  );
}

const typeIcons = {
  weapon: <Sword className="w-6 h-6" />,      // Sword icon
  armor: <Shield className="w-6 h-6" />,      // Shield/armor icon
  helmet: <HardHat className="w-6 h-6" />,    // Hard hat icon for helmet
  boots: <Footprints className="w-6 h-6" />,  // Footprints icon
  accessory: <RingIcon className="w-6 h-6" />, // Custom ring icon with diamond
};

export function TilePrototype({ type, variation, level, subLevel = 0 }: TilePrototypeProps) {
  const colorClass = variationColors[variation] || 'text-gray-500'; // Default to gray if variation not found

  return (
    <div className="relative w-16 h-16 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
      {/* Background Icon (centered, large and faded) */}
      <div className={cn("absolute inset-0 flex items-center justify-center opacity-70", colorClass)}>
        {typeIcons[type]}
      </div>

      {/* Variation Letter (top-left) */}
      <div className={cn("absolute top-1 left-1 text-xs font-bold", colorClass)}>
        {variation}
      </div>

      {/* Sub-level Counter (top-right) */}
      {subLevel > 0 && (
        <div className="absolute top-1 right-1 text-xs font-medium text-blue-600">
          {subLevel}/10
        </div>
      )}

      {/* Level (bottom center) */}
      <div className="absolute bottom-1 inset-x-0 text-center text-sm font-bold">
        Lvl {level}
      </div>
    </div>
  );
} 