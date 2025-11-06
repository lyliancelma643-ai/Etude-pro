import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface GlassTabContentProps {
  children: ReactNode;
  value: string;
  activeValue: string;
}

export function GlassTabContent({ children, value, activeValue }: GlassTabContentProps) {
  const isActive = value === activeValue;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -30, scale: 0.95, filter: 'blur(10px)' }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative"
        >
          <motion.div 
            className="glass-morphism rounded-[1.75rem] p-8 md:p-10 shadow-2xl shine-effect relative overflow-hidden"
            initial={{ boxShadow: '0 0 0 rgba(99, 102, 241, 0)' }}
            animate={{ boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)' }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
