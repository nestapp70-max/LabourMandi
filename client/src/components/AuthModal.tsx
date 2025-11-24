import { useState } from "react";
import { Phone, User, Mail, MapPin, Briefcase, DollarSign } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (phone: string, otp: string) => Promise<void>;
  onSignUp: (data: any) => Promise<void>;
}

export function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup-customer' | 'signup-technician' | 'verify-otp'>('signin');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Signup form data
  const [signupData, setSignupData] = useState({
    userType: 'customer' as 'customer' | 'technician',
    name: '',
    email: '',
    city: '',
    pin: '',
    bio: '',
    category: '',
    subcategories: [] as string[],
    yearsExperience: '',
    dailyWage: '',
    hourlyWage: '',
    certifications: '',
    whatsappNumber: '',
  });

  const handlePhoneSubmit = async () => {
    if (!phone || phone.length < 10) return;

    setIsProcessing(true);
    try {
      // Generate mock OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(generatedOtp);
      console.log('🔐 Mock OTP Generated:', generatedOtp);
      
      // Show OTP verification screen
      setMode('verify-otp');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp !== mockOtp) {
      alert('Invalid OTP. Check console for mock OTP.');
      return;
    }

    setIsProcessing(true);
    try {
      await onSignIn(phone, otp);
      resetForm();
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignup = async () => {
    if (!signupData.name || !phone) return;

    setIsProcessing(true);
    try {
      await onSignUp({
        ...signupData,
        phone,
      });
      resetForm();
    } catch (error) {
      console.error('Failed to sign up:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setMode('signin');
    setPhone('');
    setOtp('');
    setMockOtp('');
    setSignupData({
      userType: 'customer',
      name: '',
      email: '',
      city: '',
      pin: '',
      bio: '',
      category: '',
      subcategories: [],
      yearsExperience: '',
      dailyWage: '',
      hourlyWage: '',
      certifications: '',
      whatsappNumber: '',
    });
  };

  const toggleSubcategory = (sub: string) => {
    setSignupData(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(sub)
        ? prev.subcategories.filter(s => s !== sub)
        : [...prev.subcategories, sub],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); }}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {mode === 'signin' && (
          <>
            <DialogHeader>
              <DialogTitle>Sign In / Sign Up</DialogTitle>
              <DialogDescription>
                Enter your phone number to continue
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePhoneSubmit}
                  disabled={isProcessing || phone.length < 10}
                  data-testid="button-send-otp"
                >
                  {isProcessing ? 'Sending OTP...' : 'Send OTP'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  New user? Switch to Sign Up tab
                </p>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={signupData.userType === 'customer' ? 'default' : 'outline'}
                    onClick={() => setSignupData(prev => ({ ...prev, userType: 'customer' }))}
                    className="h-20 flex-col gap-2"
                    data-testid="button-signup-customer"
                  >
                    <User className="h-5 w-5" />
                    <span>Customer</span>
                  </Button>
                  <Button
                    variant={signupData.userType === 'technician' ? 'default' : 'outline'}
                    onClick={() => setSignupData(prev => ({ ...prev, userType: 'technician' }))}
                    className="h-20 flex-col gap-2"
                    data-testid="button-signup-technician"
                  >
                    <Briefcase className="h-5 w-5" />
                    <span>Technician</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      data-testid="input-signup-phone"
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setMode(signupData.userType === 'customer' ? 'signup-customer' : 'signup-technician')}
                  disabled={phone.length < 10}
                  data-testid="button-continue-signup"
                >
                  Continue
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}

        {mode === 'verify-otp' && (
          <>
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to {phone}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <p className="text-sm font-medium mb-1">Mock OTP (Dev Mode)</p>
                <p className="text-2xl font-mono font-bold text-primary">{mockOtp}</p>
                <p className="text-xs text-muted-foreground mt-2">Check console for OTP</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  className="text-center text-2xl font-mono tracking-wider"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  data-testid="input-otp"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMode('signin')}
                  data-testid="button-back"
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleVerifyOtp}
                  disabled={isProcessing || otp.length !== 6}
                  data-testid="button-verify-otp"
                >
                  {isProcessing ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
              </div>
            </div>
          </>
        )}

        {(mode === 'signup-customer' || mode === 'signup-technician') && (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
              <DialogDescription>
                {mode === 'signup-customer' ? 'Customer' : 'Technician'} Registration
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Your city"
                    value={signupData.city}
                    onChange={(e) => setSignupData(prev => ({ ...prev, city: e.target.value }))}
                    data-testid="input-city"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="pin">PIN Code</Label>
                  <Input
                    id="pin"
                    placeholder="6-digit PIN"
                    value={signupData.pin}
                    onChange={(e) => setSignupData(prev => ({ ...prev, pin: e.target.value }))}
                    maxLength={6}
                    data-testid="input-pin"
                  />
                </div>

                {mode === 'signup-technician' && (
                  <>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={signupData.category}
                        onValueChange={(value) => setSignupData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger data-testid="select-technician-category">
                          <SelectValue placeholder="Select your category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {signupData.category && (
                      <div className="space-y-2 col-span-2">
                        <Label>Skills / Subcategories</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                          {CATEGORIES.find(c => c.name === signupData.category)?.subcategories.map((sub) => (
                            <Badge
                              key={sub}
                              variant={signupData.subcategories.includes(sub) ? 'default' : 'outline'}
                              className="cursor-pointer hover-elevate"
                              onClick={() => toggleSubcategory(sub)}
                            >
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="e.g., 5"
                        value={signupData.yearsExperience}
                        onChange={(e) => setSignupData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                        data-testid="input-experience"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="10-digit number"
                        value={signupData.whatsappNumber}
                        onChange={(e) => setSignupData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        maxLength={10}
                        data-testid="input-whatsapp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyWage">Daily Wage (₹)</Label>
                      <Input
                        id="dailyWage"
                        type="number"
                        placeholder="e.g., 500"
                        value={signupData.dailyWage}
                        onChange={(e) => setSignupData(prev => ({ ...prev, dailyWage: e.target.value }))}
                        data-testid="input-daily-wage"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyWage">Hourly Wage (₹)</Label>
                      <Input
                        id="hourlyWage"
                        type="number"
                        placeholder="e.g., 50"
                        value={signupData.hourlyWage}
                        onChange={(e) => setSignupData(prev => ({ ...prev, hourlyWage: e.target.value }))}
                        data-testid="input-hourly-wage"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="certifications">Certifications (Optional)</Label>
                      <Textarea
                        id="certifications"
                        placeholder="List your certifications..."
                        rows={2}
                        value={signupData.certifications}
                        onChange={(e) => setSignupData(prev => ({ ...prev, certifications: e.target.value }))}
                        data-testid="input-certifications"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={3}
                    value={signupData.bio}
                    onChange={(e) => setSignupData(prev => ({ ...prev, bio: e.target.value }))}
                    data-testid="input-bio"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMode('signin')}
                  data-testid="button-cancel-signup"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSignup}
                  disabled={isProcessing || !signupData.name || !phone}
                  data-testid="button-complete-signup"
                >
                  {isProcessing ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
