import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className={`fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] ${
          theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply"
        }`}
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
        }}
      >
        <div
          className={`w-full h-full rounded-full blur-sm ${
            theme === "dark"
              ? "bg-primary/50"
              : "bg-gradient-to-r from-primary/70 to-secondary/70"
          }`}
        />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className={`fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998] ${
          theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply"
        }`}
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 2 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
        }}
      >
        <div
          className={`w-full h-full rounded-full blur-xl ${
            theme === "dark"
              ? "bg-secondary/30"
              : "bg-gradient-to-r from-primary/40 to-accent/40"
          }`}
        />
      </motion.div>
    </>
  );
};
