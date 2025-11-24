import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { TechnicianFilterSection } from "@/components/TechnicianFilterSection";
import { TechnicianCard } from "@/components/TechnicianCard";
import { JobCard } from "@/components/JobCard";
import { BidModal } from "@/components/BidModal";
import { WalletModal } from "@/components/WalletModal";
import { AuthModal } from "@/components/AuthModal";
import { TechnicianCardSkeleton, JobCardSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { authStorage } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [technicianPage, setTechnicianPage] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);
  const techniciansPerPage = 5;

  // Seed demo data on first load
  useEffect(() => {
    const seedDemo = async () => {
      try {
        setIsSeeding(true);
        await apiRequest('POST', '/api/seed/demo', {});
        queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
        queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      } catch (error) {
        console.log('Demo data already seeded or failed:', error);
      } finally {
        setIsSeeding(false);
      }
    };
    
    seedDemo();
  }, []);

  // Fetch technicians with polling
  const { data: technicians = [], isLoading: loadingTechnicians } = useQuery({
    queryKey: ['/api/technicians', { category: selectedCategory !== 'all' ? selectedCategory : undefined, search: searchQuery }],
  }) as { data: any[]; isLoading: boolean };

  // Fetch jobs with polling
  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ['/api/jobs'],
  }) as { data: any[]; isLoading: boolean };

  // Get current user if authenticated
  const { data: user } = useQuery({
    queryKey: ['/api/users/me'],
    enabled: authStorage.isAuthenticated(),
  });

  // Update current user from query
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Pagination
  const displayedTechnicians = technicians.slice(
    technicianPage * techniciansPerPage,
    (technicianPage + 1) * techniciansPerPage
  );
  const totalPages = Math.ceil(technicians.length / techniciansPerPage);

  const handleSignIn = async (phone: string, otp: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/verify-otp', { phone, otp });
      if (response.token) {
        authStorage.setToken(response.token);
      }
      setCurrentUser(response);
      setShowAuthModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Success!",
        description: "Signed in successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
      });
    }
  };

  const handleSignUp = async (data: any) => {
    try {
      const response = await apiRequest('POST', '/api/auth/signup', data);
      if (response.token) {
        authStorage.setToken(response.token);
      }
      setCurrentUser(response);
      setShowAuthModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      toast({
        title: "Welcome!",
        description: "Account created successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
      });
    }
  };

  const handleSignOut = () => {
    authStorage.removeToken();
    setCurrentUser(null);
    queryClient.clear();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
  };

  const handleWhatsAppClick = (technicianId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSelectedContactId(technicianId);
    setShowWalletModal(true);
  };

  const handleBidClick = (technicianId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSelectedTechnicianId(technicianId);
    setShowBidModal(true);
  };

  const handleBidOnJob = (jobId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (currentUser.userType !== 'technician') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Only technicians can submit bids",
      });
      return;
    }
    setSelectedJobId(jobId);
    setSelectedTechnicianId(currentUser.id);
    setShowBidModal(true);
  };

  const handleSubmitBids = async (bids: any[]) => {
    if (!selectedJobId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No job selected",
      });
      return;
    }

    try {
      for (const bid of bids) {
        await apiRequest('POST', '/api/bids', {
          technicianId: selectedTechnicianId || currentUser?.id,
          jobId: selectedJobId,
          amount: parseInt(bid.amount),
          deliveryTime: bid.deliveryTime,
          note: bid.note,
          isDefault: bid.isDefault,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setSelectedJobId('');
      toast({
        title: "Bids Submitted",
        description: `${bids.length} bid(s) submitted successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit bids",
      });
    }
  };

  const handleUnlockContact = async () => {
    try {
      await apiRequest('POST', '/api/wallet/unlock-contact', {
        contactId: selectedContactId,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      toast({
        title: "Contact Unlocked!",
        description: "WhatsApp number is now available",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unlock contact",
      });
    }
  };

  const handleRecharge = async (amount: number) => {
    try {
      await apiRequest('POST', '/api/wallet/recharge', { amount });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Recharge Successful!",
        description: `₹${amount} added to your wallet`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to recharge wallet",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col w-full overflow-x-hidden">
      <Header
        user={currentUser}
        onSignOut={handleSignOut}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenPostJob={() => navigate('/post-job')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="w-full flex-1 flex flex-col items-center">
        {/* Hero Carousel - Constrained Width */}
        <div className="w-full max-w-6xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <HeroCarousel onPostJob={() => navigate('/post-job')} />
        </div>

        {/* Filter Section and Content */}
        <div className="w-full max-w-6xl px-3 sm:px-4 lg:px-6 pb-8">
          <TechnicianFilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />


        {/* Dual Column Container - Equal Split */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-slate-200 dark:divide-slate-800">
            {/* Left Column: Customer Jobs */}
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">Customer Job Requests</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {loadingJobs ? (
                  <div className="text-center py-8 text-slate-400">Loading jobs...</div>
                ) : jobs.length > 0 ? (
                  jobs.slice(0, 4).map((job: any) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewBids={() => {}}
                      onContactClick={handleWhatsAppClick}
                      onBidOnJob={handleBidOnJob}
                      currentUserId={currentUser?.id}
                      currentUserType={currentUser?.userType}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No jobs posted yet
                  </div>
                )}
              </div>
              {jobs.length > 4 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                  Showing 4 of {jobs.length} jobs • Scroll for more
                </p>
              )}
            </div>

            {/* Right Column: Technicians */}
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">Available Technicians</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {loadingTechnicians ? (
                  <div className="text-center py-8 text-slate-400">Loading technicians...</div>
                ) : displayedTechnicians.length > 0 ? (
                  displayedTechnicians.slice(0, 4).map((technician: any) => (
                    <TechnicianCard
                      key={technician.id}
                      technician={technician}
                      onWhatsAppClick={handleWhatsAppClick}
                      onBidClick={handleBidClick}
                      currentUserId={currentUser?.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No technicians found
                  </div>
                )}
              </div>
              {displayedTechnicians.length > 4 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                  Showing 4 of {displayedTechnicians.length} technicians • Scroll for more
                </p>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      {showBidModal && (
        <BidModal
          isOpen={showBidModal}
          onClose={() => {
            setShowBidModal(false);
            setSelectedJobId('');
          }}
          jobId={selectedJobId}
          technicianId={selectedTechnicianId || currentUser?.id}
          onSubmit={handleSubmitBids}
        />
      )}

      {showWalletModal && (
        <WalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          walletBalance={currentUser?.walletBalance || 0}
          unlockCost={10}
          onUnlock={handleUnlockContact}
          onRecharge={handleRecharge}
        />
      )}

      <Footer />
    </div>
  );
}
