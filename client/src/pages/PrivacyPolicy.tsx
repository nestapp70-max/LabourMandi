import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
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

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Labour Mandi ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our marketplace platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">2.1 Personal Information</h3>
                <p>We collect personal information you voluntarily provide, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Name, phone number, and email address</li>
                  <li>Location information (city, PIN code)</li>
                  <li>Professional qualifications and experience (for technicians)</li>
                  <li>Payment and wallet information</li>
                  <li>Profile pictures and portfolio images</li>
                  <li>Communication preferences and messages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">2.2 Automatically Collected Information</h3>
                <p>When you use our platform, we automatically collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Device information (device type, operating system, browser)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Log data (IP address, access times, referring URLs)</li>
                  <li>Location data (approximate location based on IP address)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Creating and maintaining your account</li>
              <li>Facilitating connections between customers and technicians</li>
              <li>Processing payments and wallet transactions</li>
              <li>Sending you relevant service notifications and updates</li>
              <li>Improving our platform and user experience</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
              <li>Marketing purposes (only with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Information Sharing</h2>
            <div className="space-y-3">
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party services that help us operate our platform (hosting, payment processors, analytics)</li>
                <li><strong>Other Users:</strong> Profile information, ratings, and contact details are shared as necessary to facilitate services</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Partners:</strong> With your consent for marketing and partnership opportunities</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information, including encryption, secure socket layer (SSL) technology, and access controls. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
              <li>Restrict processing of your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, remember preferences, and analyze platform usage. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">9. Policy Changes</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Your continued use of the platform constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">10. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p><strong>Email:</strong> privacy@labourmandi.com</p>
              <p><strong>Address:</strong> Labour Mandi, India</p>
              <p><strong>Response Time:</strong> We respond to inquiries within 30 days</p>
            </div>
          </section>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
            <strong>Last Updated:</strong> November 24, 2024
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
