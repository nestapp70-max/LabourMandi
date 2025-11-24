import { Briefcase, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CTACardsProps {
  onPostJob: () => void;
}

export function CTACards({ onPostJob }: CTACardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Post Your Job */}
      <Card className="p-6 bg-card hover-elevate transition-all border-primary/20 hover:border-primary/40">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Step 1
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Post Your Job</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            Describe what work you need done and where. Get started in under 2 minutes.
          </p>
          <Button onClick={onPostJob} className="w-full" data-testid="button-cta-post-job">
            Create Job Posting
          </Button>
        </div>
      </Card>

      {/* Get Bids */}
      <Card className="p-6 bg-card hover-elevate transition-all border-primary/20 hover:border-primary/40">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Step 2
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Get Bids</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            Receive bids from qualified technicians in your area. Compare prices and delivery times.
          </p>
          <div className="text-center py-2 text-sm text-muted-foreground">
            Automatic after posting
          </div>
        </div>
      </Card>

      {/* Connect & Hire */}
      <Card className="p-6 bg-card hover-elevate transition-all border-primary/20 hover:border-primary/40">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Step 3
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect & Hire</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            Unlock contact details for ₹10 and connect directly via WhatsApp to finalize the work.
          </p>
          <div className="text-center py-2 text-sm font-medium text-primary">
            Only ₹10 per contact
          </div>
        </div>
      </Card>
    </div>
  );
}
