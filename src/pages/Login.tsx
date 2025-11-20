import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { TopNavbar } from "@/components/TopNavbar";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-28">
      <ParticleBackground />
      <CustomCursor />
      <TopNavbar />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <Card className="w-full max-w-md glass glow-primary p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {isSignup ? "Join Gemini Engine" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignup
                ? "Create your account to get started"
                : "Sign in to continue your learning journey"}
            </p>
          </div>

          <form className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="glass"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="glass"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <NavLink
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Home
            </NavLink>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
