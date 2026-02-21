import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'darkblue';
  onClick?: () => void;
}

export function ModuleCard({ title, icon: Icon, color, onClick }: ModuleCardProps) {
  const colorClasses = {
    blue: 'from-[#4A6FA5] to-[#2C4875] hover:from-[#5A7FB5] hover:to-[#3C5885]',
    green: 'from-[#6B8E4E] to-[#4A6F35] hover:from-[#7B9E5E] hover:to-[#5A7F45]',
    darkblue: 'from-[#3D5A80] to-[#2C4058] hover:from-[#4D6A90] hover:to-[#3C5068]'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full max-w-sm rounded-3xl bg-gradient-to-br ${colorClasses[color]} p-8 shadow-2xl transition-all duration-300 overflow-hidden group`}
    >
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
        <div className="w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-30 transition-opacity">
        <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
          <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>
        <h3 className="text-3xl font-bold text-white tracking-wide">
          {title}
        </h3>
      </div>

      {/* Sparkles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
      </div>
    </motion.button>
  );
}
