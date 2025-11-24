import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface BidOption {
  amount: string;
  deliveryTime: string;
  note: string;
  isDefault: boolean;
}

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  technicianId: string;
  onSubmit: (bids: BidOption[]) => Promise<void>;
}

export function BidModal({
  isOpen,
  onClose,
  jobId,
  technicianId,
  onSubmit,
}: BidModalProps) {
  const [bids, setBids] = useState<BidOption[]>([
    { amount: '', deliveryTime: '', note: '', isDefault: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBid = () => {
    setBids([...bids, { amount: '', deliveryTime: '', note: '', isDefault: false }]);
  };

  const handleRemoveBid = (index: number) => {
    if (bids.length > 1) {
      setBids(bids.filter((_, i) => i !== index));
    }
  };

  const handleBidChange = (index: number, field: keyof BidOption, value: any) => {
    const newBids = [...bids];
    newBids[index] = { ...newBids[index], [field]: value };
    setBids(newBids);
  };

  const handleSubmit = async () => {
    const validBids = bids.filter(bid => bid.amount && bid.deliveryTime);
    if (validBids.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(validBids);
      setBids([{ amount: '', deliveryTime: '', note: '', isDefault: false }]);
      onClose();
    } catch (error) {
      console.error('Failed to submit bids:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Submit Your Bid(s)</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Submit multiple bid options with different prices and times.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          {bids.map((bid, index) => (
            <Card key={index} className="p-3 sm:p-4 relative">
              {bids.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 sm:top-2 right-1 sm:right-2 h-6 w-6"
                  onClick={() => handleRemoveBid(index)}
                  data-testid={`button-remove-bid-${index}`}
                >
                  <X className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                </Button>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-2 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-1 sm:mt-2">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`amount-${index}`}>Bid Amount (₹) *</Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          placeholder="e.g., 5000"
                          value={bid.amount}
                          onChange={(e) => handleBidChange(index, 'amount', e.target.value)}
                          data-testid={`input-bid-amount-${index}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`deliveryTime-${index}`}>Delivery Time *</Label>
                        <Input
                          id={`deliveryTime-${index}`}
                          placeholder="e.g., 2 days"
                          value={bid.deliveryTime}
                          onChange={(e) => handleBidChange(index, 'deliveryTime', e.target.value)}
                          data-testid={`input-delivery-time-${index}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`note-${index}`}>Note (Optional)</Label>
                      <Textarea
                        id={`note-${index}`}
                        placeholder="Add any additional details or questions..."
                        rows={2}
                        value={bid.note}
                        onChange={(e) => handleBidChange(index, 'note', e.target.value)}
                        data-testid={`input-bid-note-${index}`}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`default-${index}`}
                        checked={bid.isDefault}
                        onCheckedChange={(checked) =>
                          handleBidChange(index, 'isDefault', checked)
                        }
                        data-testid={`checkbox-default-${index}`}
                      />
                      <Label htmlFor={`default-${index}`} className="text-sm cursor-pointer">
                        Set as preferred option
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleAddBid}
            data-testid="button-add-another-bid"
          >
            <Plus className="h-4 w-4" />
            Add Another Bid Option
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-bid"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting || !bids.some(b => b.amount && b.deliveryTime)}
            data-testid="button-submit-bids"
          >
            {isSubmitting ? 'Submitting...' : `Submit ${bids.filter(b => b.amount && b.deliveryTime).length} Bid(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
