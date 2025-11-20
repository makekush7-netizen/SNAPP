import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { TopNavbar } from "@/components/TopNavbar";
import { Hero3DCharacter } from "@/components/Hero3DCharacter";
import { FeatureCard } from "@/components/FeatureCard";
import { ParticleBackground } from "@/components/ParticleBackground";
import { CustomCursor } from "@/components/CustomCursor";
import {
  BookOpen,
  FileText,
  FileQuestion,
  Lightbulb,
  Code,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Smart Notes",
    description:
      "Upload handwritten or typed notes and let Gemini organize, enhance, and make them searchable.",
    detailedDescription:
      "Our AI analyzes your handwriting, converts it to digital format, and creates an organized, searchable knowledge base. Add tags, highlights, and smart summaries automatically.",
  },
  {
    icon: FileText,
    title: "Auto Summaries",
    description:
      "Take a screenshot of any content and get instant AI-powered summaries tailored to your learning style.",
    detailedDescription:
      "Whether it's a textbook page, lecture slide, or article, our AI extracts key concepts and generates concise summaries. Save hours of reading time while retaining more information.",
  },
  {
    icon: FileQuestion,
    title: "MCQs & Practice",
    description:
      "Generate unlimited multiple-choice questions and practice papers from your study materials.",
    detailedDescription:
      "Test your knowledge with AI-generated questions that adapt to your learning pace. Get instant feedback, track your progress, and identify weak areas for improvement.",
  },
  {
    icon: Lightbulb,
    title: "Syllabus Q&A",
    description:
      "Ask any question about your syllabus and get detailed, context-aware answers instantly.",
    detailedDescription:
      "Our AI understands your curriculum and provides comprehensive answers with examples, explanations, and relevant resources. Like having a personal tutor available 24/7.",
  },
  {
    icon: Code,
    title: "Coding Help",
    description:
      "Debug code, understand algorithms, and get step-by-step programming guidance.",
    detailedDescription:
      "From syntax errors to complex algorithms, get expert coding assistance. Learn best practices, optimize your code, and understand programming concepts with clear explanations.",
  },
  {
    icon: TrendingUp,
    title: "Exam Tips",
    description:
      "Receive personalized study strategies, time management tips, and exam preparation guidance.",
    detailedDescription:
      "Based on your study patterns and upcoming exams, get tailored advice on what to focus on, how to manage your time, and techniques to boost your performance.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <ParticleBackground />
      <CustomCursor />
      <TopNavbar />
      <Navigation />

      {/* Main Content */}
      <div className="ml-20 md:ml-64 pt-28">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-8 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Meet Your AI Study Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform the way you learn with AI-powered homework help, smart notes, and personalized guidance.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-full animate-pulse"
              onClick={() => {
                (window as any).speak?.(
                  "Hi! I'm your Gemini AI assistant. Ready to ace your homework together? 🎯",
                  undefined
                );
              }}
            >
              Say Hello! 👋
            </Button>
          </motion.div>

          {/* 3D Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-2xl glass rounded-3xl p-8 glow-primary"
          >
            <Hero3DCharacter />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your studies, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center glow-secondary"
          >
            <h2 className="text-4xl font-bold gradient-text-secondary mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who are already using Gemini Engine to achieve their academic goals.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-full"
            >
              Get Started Free
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Index;
