import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Zap, Users, Globe } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Header />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-6 text-red-600 dark:text-yellow-400"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                About Labour Mandi
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Connecting skilled technicians with customers across India
              </p>
            </section>

            {/* Founder Section */}
            <section className="bg-red-50 dark:bg-slate-800 rounded-lg p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-red-700 dark:from-yellow-500 dark:to-yellow-600 flex items-center justify-center text-white text-3xl font-bold">
                    SN
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Sachida Nand Sharma
                  </h2>
                  <p className="text-lg text-red-600 dark:text-yellow-400 font-semibold mb-4">
                    Founder & Creator
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    A passionate entrepreneur committed to solving real-world problems. Sachida Nand Sharma created Labour Mandi to bridge the gap between skilled technicians and customers across India, making quality services accessible and affordable to everyone.
                  </p>
                </div>
              </div>
            </section>

            {/* Mission Section */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Labour Mandi is built on a simple yet powerful vision: to create a transparent, trustworthy marketplace where skilled technicians can showcase their expertise and find meaningful work, while customers get reliable, quality services at fair prices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-red-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Efficiency</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Quick job posting and bidding process that connects customers with technicians in minutes
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-red-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Trust</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Verified profiles, ratings, and secure payments ensure both parties feel confident
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-red-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Community</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Supporting skilled workers and helping them build sustainable livelihoods
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-red-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pan-India Reach</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Connecting technicians and customers across 100+ categories nationwide
                  </p>
                </div>
              </div>
            </section>

            {/* Why Created Section */}
            <section className="space-y-6 border-t border-slate-200 dark:border-slate-700 pt-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Labour Mandi Was Created</h2>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  In India, finding a reliable, skilled technician is often a challenge. Many customers struggle to find trustworthy professionals, while skilled workers find it difficult to reach customers directly.
                </p>
                <p>
                  Labour Mandi was born from a desire to solve this real problem. By creating a digital marketplace that respects both the customer and the technician, we aim to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Empower skilled workers to showcase their expertise and earn fair compensation</li>
                  <li>Enable customers to find qualified professionals quickly and easily</li>
                  <li>Build a transparent system where quality and reliability are rewarded</li>
                  <li>Create economic opportunities across rural and urban India</li>
                  <li>Support the growth of small businesses and individual technicians</li>
                </ul>
              </div>
            </section>

            {/* Vision Section */}
            <section className="space-y-6 bg-gradient-to-br from-red-600 to-red-700 dark:from-yellow-500 dark:to-yellow-600 p-8 rounded-lg text-white">
              <h2 className="text-3xl font-bold">Our Vision for the Future</h2>
              <p className="text-lg leading-relaxed">
                We envision Labour Mandi becoming the most trusted platform for connecting customers with skilled technicians across India. By leveraging technology, we'll continue to expand our reach, improve our services, and create meaningful impact in the lives of technicians and customers alike.
              </p>
            </section>

            {/* CTA Section */}
            <section className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Get Started?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = "/"}
                  className="bg-red-600 hover:bg-red-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-slate-900"
                  data-testid="button-browse-jobs"
                >
                  Find a Technician
                </Button>
                <Button
                  onClick={() => window.location.href = "/post-job"}
                  className="bg-red-600 hover:bg-red-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-slate-900"
                  data-testid="button-post-job"
                >
                  Post a Job
                </Button>
              </div>
            </section>

            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              <strong>Last Updated:</strong> November 24, 2024
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
