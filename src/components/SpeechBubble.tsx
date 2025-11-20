import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
  typing?: boolean;
}

export const SpeechBubble = ({ text, visible, typing = false }: SpeechBubbleProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visible && text) {
      setIsTyping(true);
      setDisplayedText("");
      
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText((prev) => prev + text[currentIndex]);
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [text, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative">
            {/* Speech bubble */}
            <div className="glass rounded-2xl px-6 py-4 min-w-[200px] max-w-[400px] glow-primary">
              <p className="text-foreground text-sm leading-relaxed">
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-1 h-4 bg-primary ml-1"
                  />
                )}
              </p>
            </div>

            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card/70" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
