import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 pt-4 px-4 md:px-6 z-40"
    >
      <div className="h-20 glass border-b border-border rounded-b-xl flex items-center justify-between px-6 md:px-8">
      {/* Left: Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold gradient-text">
          SNAPP.AI
        </h1>
      </div>

      {/* Right: Theme Toggle + Profile */}
      <div className="flex items-center gap-4">
        {/* Stylish Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 relative overflow-hidden ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-600/20 to-primary/20 hover:from-purple-600/30 hover:to-primary/30 border border-primary/30"
              : "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/30"
          }`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {/* Background glow effect */}
          <div
            className={`absolute inset-0 opacity-0 hover:opacity-50 transition-opacity duration-300 blur-sm ${
              theme === "dark"
                ? "bg-gradient-to-r from-primary/40 to-secondary/40"
                : "bg-gradient-to-r from-amber-500/40 to-yellow-500/40"
            }`}
          />

          {/* Icon and Label */}
          <div className="relative flex items-center gap-2">
            {theme === "dark" ? (
              <>
                <Moon className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-foreground">Light</span>
              </>
            )}
          </div>
        </motion.button>

        {/* Profile Button */}
        <NavLink to="/login">
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-primary/10"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">Profile</span>
          </Button>
        </NavLink>
      </div>
      </div>
    </motion.nav>
  );
};
