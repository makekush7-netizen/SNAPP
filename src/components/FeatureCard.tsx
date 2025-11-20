import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  detailedDescription: string;
  icon: LucideIcon;
  index: number;
}

export const FeatureCard = ({
  title,
  description,
  detailedDescription,
  icon: Icon,
  index,
}: FeatureCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="perspective-1000"
    >
      <motion.div
        className="relative w-full h-[280px] cursor-pointer hover-lift"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 glass rounded-2xl p-6 flex flex-col items-start justify-between backface-hidden glow-primary"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold gradient-text">{title}</h3>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
            {description}
          </p>
          
          <div className="text-xs text-primary font-medium mt-4">
            Click to learn more →
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 glass rounded-2xl p-6 flex flex-col justify-between backface-hidden glow-secondary"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <h3 className="text-xl font-bold gradient-text-secondary mb-4">{title}</h3>
            <p className="text-foreground text-sm leading-relaxed">
              {detailedDescription}
            </p>
          </div>
          
          <div className="text-xs text-secondary font-medium mt-4">
            Click to go back ←
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
