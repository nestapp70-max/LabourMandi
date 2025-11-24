import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CancellationPolicy() {
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

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Cancellation Policy</h1>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Purpose</h2>
            <p>
              This Cancellation Policy explains the terms and conditions under which customers and technicians can cancel jobs, bids, or services on the Labour Mandi platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Customer Job Cancellations</h2>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">2.1 Cancellation Window</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Before Any Bids:</strong> Free cancellation anytime</li>
                <li><strong>After Bids Received (Pending):</strong> Free cancellation up to 48 hours before scheduled work date/time</li>
                <li><strong>After Bid Accepted (In Progress):</strong> Cancellation incurs 20% of bid amount as service fee</li>
                <li><strong>During Active Service:</strong> Cancellation incurs 50% of bid amount as service fee</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">2.2 Reasons for Customer Cancellation</h3>
              <p>Customers may cancel for any reason, but cancellation fees apply based on the timing:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Work no longer needed</li>
                <li>Budget constraints</li>
                <li>Scheduling conflicts</li>
                <li>Found alternative service provider</li>
                <li>Service quality concerns (pre-cancellation discussion available)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Technician Bid/Job Cancellations</h2>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">3.1 Cancellation Window</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Bid Withdrawal (Before Acceptance):</strong> Free cancellation anytime before acceptance</li>
                <li><strong>Accepted Bid (Before Work Begins):</strong> Free cancellation up to 24 hours before scheduled time</li>
                <li><strong>After Work Has Begun:</strong> Cancellation results in ₹500 penalty plus negative rating impact</li>
                <li><strong>No-show (Technician Doesn't Arrive):</strong> Account suspension + ₹500 penalty + customer refund eligibility</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">3.2 Valid Reasons for Technician Cancellation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Emergency or medical issues</li>
                <li>Vehicle breakdown on the way</li>
                <li>Weather conditions making travel unsafe</li>
                <li>Customer unavailability/access issues (with proof)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">3.3 Invalid Reasons (Penalties Apply)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Received a better offer elsewhere</li>
                <li>Customer negotiating lower price</li>
                <li>Forgot about the commitment</li>
                <li>Change of mind</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Cancellation Process</h2>
            <div className="space-y-2">
              <p><strong>Customer-Initiated Cancellation:</strong> Go to Jobs → Select Job → Cancel Job button</p>
              <p><strong>Technician Bid Withdrawal:</strong> Go to My Bids → Select Bid → Withdraw Bid button</p>
              <p><strong>Technician Job Cancellation:</strong> Contact customer through platform chat first (required)</p>
              <p><strong>Emergency Cancellations:</strong> Call support hotline for immediate assistance</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Cancellation Fees and Refunds</h2>
            <table className="w-full text-sm border-collapse border border-slate-300 dark:border-slate-600 mt-3">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="border border-slate-300 dark:border-slate-600 p-2 text-left">Cancellation Type</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2 text-left">Fee</th>
                  <th className="border border-slate-300 dark:border-slate-600 p-2 text-left">Refund</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">Before Any Bids</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">None</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">100%</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">Before 48 Hours of Service</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">None</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">100%</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">After Bid Acceptance (In Progress)</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">20%</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">80%</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">During Active Service</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">50%</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">50%</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">Technician No-Show</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">₹500 + Penalty</td>
                  <td className="border border-slate-300 dark:border-slate-600 p-2">100%</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Impact on Ratings and Account</h2>
            <div className="space-y-3">
              <p><strong>Frequent Cancellations:</strong> May result in lower visibility in search results</p>
              <p><strong>Repeated No-Shows:</strong> May result in temporary or permanent account suspension</p>
              <p><strong>Reputation Impact:</strong> Cancellations are visible in user profile history</p>
              <p><strong>Technician Rating:</strong> Cancellations within 24 hours of scheduled time reduce technician rating by 1 point (minimum 1-star)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">7. Force Majeure Events</h2>
            <p>
              In cases of natural disasters, lockdowns, extreme weather, or government-mandated closures, cancellations may be allowed without penalty at Labour Mandi's discretion. Documentation may be required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">8. Dispute Resolution</h2>
            <p>
              If there's a dispute about whether a cancellation was justified, Labour Mandi will review evidence from both parties (messages, photos, timing) and make a determination within 48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">9. Account Suspension</h2>
            <p>Accounts may be suspended for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>More than 3 no-shows in 30 days</li>
              <li>More than 5 cancellations within 24 hours of service in 60 days</li>
              <li>Pattern of fraudulent cancellations</li>
              <li>Repeated refusal to provide service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">10. Contact Support</h2>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2">
              <p><strong>Email:</strong> support@labourmandi.com</p>
              <p><strong>Emergency Cancellations:</strong> Help within the app or contact support immediately</p>
              <p><strong>Appeals:</strong> Appeal cancellation decisions within 7 days</p>
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
