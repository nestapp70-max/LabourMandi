import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RefundPolicy() {
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

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Refund Policy</h1>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Overview</h2>
            <p>
              Labour Mandi is committed to ensuring customer satisfaction. This Refund Policy outlines the circumstances under which refunds are provided for transactions on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Refundable Scenarios</h2>
            <p>Refunds may be issued in the following cases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-3">
              <li>
                <strong>Service Not Provided:</strong> If a technician fails to provide the requested service on the agreed date and time without valid reason
              </li>
              <li>
                <strong>Work Quality Issues:</strong> If the work completed does not meet agreed specifications and cannot be resolved with the technician within 7 days
              </li>
              <li>
                <strong>Duplicate Charges:</strong> If you are incorrectly charged twice for the same service
              </li>
              <li>
                <strong>Unauthorized Transactions:</strong> If your wallet or payment was used without authorization
              </li>
              <li>
                <strong>Wallet Recharge Errors:</strong> If funds were not credited to your wallet after a successful transaction
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Non-Refundable Scenarios</h2>
            <p>Refunds will NOT be issued for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-3">
              <li>Work completed satisfactorily as per agreement</li>
              <li>Customer-initiated cancellations after technician has begun work</li>
              <li>Disputes over pricing that were agreed upon before service</li>
              <li>Services delayed due to customer unavailability or access issues</li>
              <li>Customer changing their mind about the service</li>
              <li>Wallet funds transferred by user (as these are fund transfers, not purchases)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Refund Request Process</h2>
            <div className="space-y-3">
              <p>To request a refund, follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact Labour Mandi support within 7 days of the transaction</li>
                <li>Provide detailed information about the issue (with photos if applicable)</li>
                <li>Attempt resolution with the technician first (we'll facilitate communication)</li>
                <li>If resolution fails, submit your refund request formally</li>
                <li>Our team will investigate and respond within 5-7 business days</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Refund Timeline</h2>
            <div className="space-y-2">
              <p><strong>Refund Request Investigation:</strong> 5-7 business days</p>
              <p><strong>Wallet Reversal:</strong> Upon approval, immediate reversal to wallet</p>
              <p><strong>Bank Transfer (if requested):</strong> 5-10 business days (varies by bank)</p>
              <p><strong>Deduction for Third-party Charges:</strong> Labour Mandi may deduct payment gateway charges if applicable</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Partial Refunds</h2>
            <p>
              In cases where work is partially completed or partially satisfactory, Labour Mandi may issue partial refunds. The amount will be determined based on the percentage of work completed and its quality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">7. WhatsApp Contact Unlock Refunds</h2>
            <p>
              WhatsApp contact unlock charges (₹10) are non-refundable. Once purchased, the contact remains unlocked for your account. If you believe the charge was unauthorized, please report within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">8. Appeal Process</h2>
            <p>
              If you disagree with our refund decision, you may appeal within 15 days by providing additional evidence or information. A senior team member will review your appeal and respond within 7 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">9. Dispute Escalation</h2>
            <p>
              If you remain unsatisfied after the appeal process, you may escalate your case to our dispute resolution team for final determination. This decision is binding and cannot be appealed further.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">10. Fraudulent Refund Attempts</h2>
            <p>
              Labour Mandi reserves the right to permanently suspend accounts that attempt to fraudulently obtain refunds or exploit this policy. Customers attempting fraud may face legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">11. Contact Support</h2>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2">
              <p><strong>Email:</strong> refunds@labourmandi.com</p>
              <p><strong>Phone:</strong> Available during business hours (9 AM - 6 PM IST)</p>
              <p><strong>Response Time:</strong> Within 24 business hours</p>
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
