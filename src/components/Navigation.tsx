import { NavLink } from "react-router-dom";
import { BookOpen, FileText, Code, FileQuestion, Lightbulb, Settings, HelpCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Smart Notes", href: "#notes", icon: BookOpen },
  { name: "Summaries", href: "#summaries", icon: FileText },
  { name: "MCQs & Practice", href: "#practice", icon: FileQuestion },
  { name: "Q&A", href: "#qa", icon: Lightbulb },
  { name: "Coding Help", href: "#coding", icon: Code },
];

export const Navigation = () => {
  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-24 h-[calc(100vh-6rem)] w-20 md:w-64 glass border-r border-border z-50 flex flex-col"
    >
      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <motion.a
            key={item.name}
            href={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300 group hover-lift"
          >
            <item.icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
            <span className="text-sm font-medium hidden md:block group-hover:text-secondary transition-colors">
              {item.name}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Bottom Action Buttons */}
      <div className="p-4 border-t border-border space-y-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center md:justify-start gap-3 hover:bg-accent/10 text-accent hover:text-accent transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium hidden md:block">Help</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink to="#settings">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center md:justify-start gap-3 hover:bg-primary/10 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium hidden md:block">Settings</span>
            </Button>
          </NavLink>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center md:justify-start gap-3 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium hidden md:block">Logout</span>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};
