import { useState } from "react";
import { Wallet, Lock, CreditCard, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  unlockCost: number;
  onUnlock: () => Promise<void>;
  onRecharge: (amount: number) => Promise<void>;
  contactType?: string; // 'technician' or 'customer'
}

export function WalletModal({
  isOpen,
  onClose,
  walletBalance,
  unlockCost = 10,
  onUnlock,
  onRecharge,
  contactType = 'technician',
}: WalletModalProps) {
  const [showRecharge, setShowRecharge] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  const rechargeOptions = [50, 100, 500];
  const hasSufficientBalance = walletBalance >= unlockCost;

  const handleUnlock = async () => {
    if (!hasSufficientBalance) {
      setShowRecharge(true);
      return;
    }

    setIsProcessing(true);
    try {
      await onUnlock();
      onClose();
    } catch (error) {
      console.error('Failed to unlock contact:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecharge = async (amount: number) => {
    setIsProcessing(true);
    setRechargeSuccess(false);
    try {
      await onRecharge(amount);
      setRechargeSuccess(true);
      setTimeout(() => {
        setShowRecharge(false);
        setRechargeSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to recharge wallet:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {!showRecharge ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Unlock Contact Details
              </DialogTitle>
              <DialogDescription>
                Get WhatsApp number to connect with this {contactType}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Current Balance */}
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Current Balance</span>
                  </div>
                  <div className={`text-2xl font-bold ${hasSufficientBalance ? 'text-primary' : 'text-destructive'}`}>
                    ₹{walletBalance}
                  </div>
                </div>
              </Card>

              {/* Unlock Cost */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Unlock Cost</span>
                  <span className="text-xl font-bold text-primary">₹{unlockCost}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  One-time fee to access WhatsApp contact details
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {hasSufficientBalance ? (
                  <Button
                    className="w-full gap-2"
                    onClick={handleUnlock}
                    disabled={isProcessing}
                    data-testid="button-unlock-contact"
                  >
                    <Lock className="h-4 w-4" />
                    {isProcessing ? 'Unlocking...' : `Unlock for ₹${unlockCost}`}
                  </Button>
                ) : (
                  <>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-destructive font-medium">
                        Insufficient Balance
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please recharge your wallet to unlock
                      </p>
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={() => setShowRecharge(true)}
                      data-testid="button-show-recharge"
                    >
                      <CreditCard className="h-4 w-4" />
                      Recharge Wallet
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Recharge Wallet
              </DialogTitle>
              <DialogDescription>
                Select an amount to add to your wallet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Current Balance */}
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Current Balance</span>
                  </div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-current-balance">
                    ₹{walletBalance}
                  </div>
                </div>
              </Card>

              {/* Recharge Options */}
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Select Amount</p>
                <div className="grid grid-cols-3 gap-2">
                  {rechargeOptions.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-20 flex-col gap-1"
                      onClick={() => handleRecharge(amount)}
                      disabled={isProcessing}
                      data-testid={`button-recharge-${amount}`}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="text-lg font-bold">₹{amount}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Success Message */}
              {rechargeSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">Recharge Successful!</p>
                    <p className="text-xs text-muted-foreground">Your wallet has been updated</p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowRecharge(false)}
                data-testid="button-back-to-unlock"
              >
                Back to Unlock
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
