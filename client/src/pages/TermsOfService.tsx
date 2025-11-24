import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
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

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using Labour Mandi ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on Labour Mandi for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software on Labour Mandi</li>
              <li>Remove any copyright or other proprietary notations</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Harass, threaten, or intimidate any user</li>
              <li>Engage in fraudulent or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. User Registration</h2>
            <div className="space-y-3">
              <p>To use certain features of the Platform, you must register and provide accurate information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account information</li>
                <li>You agree to accept responsibility for all activities that occur under your account</li>
                <li>You must be at least 18 years old to use this Platform</li>
                <li>You must provide valid contact information and keep it updated</li>
                <li>You agree not to create multiple accounts or accounts for others</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Technician Responsibilities</h2>
            <p>Technicians using Labour Mandi agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate information about qualifications and experience</li>
              <li>Respond professionally to job opportunities within 24 hours</li>
              <li>Maintain professional conduct and punctuality</li>
              <li>Complete work to the highest standards</li>
              <li>Comply with all safety and legal requirements</li>
              <li>Not share contact information outside the Platform without consent</li>
              <li>Accept responsibility for work quality and customer satisfaction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Customer Responsibilities</h2>
            <p>Customers using Labour Mandi agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide clear and accurate job descriptions</li>
              <li>Respect technician time and expertise</li>
              <li>Pay agreed-upon fees in a timely manner</li>
              <li>Maintain a clean and safe working environment</li>
              <li>Provide necessary access and information for job completion</li>
              <li>Rate and review technicians fairly and honestly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Payment and Wallet</h2>
            <div className="space-y-3">
              <p>Our wallet system operates under the following terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users can add funds to their wallet through supported payment methods</li>
                <li>Wallet funds are non-refundable except as specified in our Refund Policy</li>
                <li>Inactive wallet accounts (no transactions for 2 years) may be closed</li>
                <li>Labour Mandi does not charge maintenance fees on wallet accounts</li>
                <li>Unauthorized wallet transactions should be reported within 24 hours</li>
                <li>All currency transactions are in Indian Rupees (₹)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">7. Dispute Resolution</h2>
            <div className="space-y-3">
              <p>In case of disputes between users:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users should attempt to resolve disputes directly</li>
                <li>Labour Mandi offers dispute mediation services</li>
                <li>Labour Mandi is not liable for disputes but will attempt fair resolution</li>
                <li>Disputes must be reported within 7 days of service completion</li>
                <li>Labour Mandi's decision on disputes is final and binding</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              Labour Mandi and its owners are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">9. Intellectual Property Rights</h2>
            <p>
              All content on Labour Mandi, including text, graphics, logos, images, and software, is the property of Labour Mandi or its content suppliers and is protected by international copyright laws. Your use of the Platform grants you no rights to the intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">10. Account Termination</h2>
            <p>
              Labour Mandi reserves the right to terminate your account without notice if you violate these Terms of Service. Account termination may result in loss of access to all services and content on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              Labour Mandi reserves the right to modify these Terms of Service at any time. Changes become effective upon posting to the Platform. Your continued use constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">12. Contact Information</h2>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p><strong>Email:</strong> support@labourmandi.com</p>
              <p><strong>Address:</strong> Labour Mandi, India</p>
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
