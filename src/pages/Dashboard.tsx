import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { TopNavbar } from "@/components/TopNavbar";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full relative">
      <ParticleBackground />
      <CustomCursor />
      <TopNavbar />
      <Navigation />

      <div className="ml-20 md:ml-64 pt-28 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Your Learning Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your progress and achievements
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Study Streak</h3>
                <Flame className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-4xl font-bold gradient-text">7 Days</p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep it up! 🔥
              </p>
            </Card>

            <Card className="glass p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total XP</h3>
                <Star className="w-6 h-6 text-accent" />
              </div>
              <p className="text-4xl font-bold gradient-text">2,450</p>
              <p className="text-sm text-muted-foreground mt-2">
                Level 12 Student
              </p>
            </Card>

            <Card className="glass p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Achievements</h3>
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <p className="text-4xl font-bold gradient-text">15</p>
              <p className="text-sm text-muted-foreground mt-2">
                Badges earned
              </p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="glass p-6 mb-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                { title: "Completed Biology Notes", progress: 100, badge: "Expert" },
                { title: "Math Practice MCQs", progress: 75, badge: "In Progress" },
                { title: "History Summary", progress: 100, badge: "Completed" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <Badge variant="secondary">{item.badge}</Badge>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Badges Section */}
          <Card className="glass p-6">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Your Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "First Steps", emoji: "🌱" },
                { name: "Speed Reader", emoji: "⚡" },
                { name: "Quiz Master", emoji: "🧠" },
                { name: "Code Ninja", emoji: "💻" },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-6 rounded-xl text-center hover-lift cursor-pointer"
                >
                  <div className="text-5xl mb-2">{badge.emoji}</div>
                  <p className="text-sm font-medium">{badge.name}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
