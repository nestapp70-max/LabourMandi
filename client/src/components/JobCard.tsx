import { useState } from "react";
import { MapPin, DollarSign, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Job, User, Bid } from "@shared/schema";

interface JobCardProps {
  job: Job & { customer: User; bids: Array<Bid & { technician: User }> };
  onViewBids: (jobId: string) => void;
  onContactClick: (customerId: string) => void;
  onBidOnJob?: (jobId: string) => void;
  onAcceptBid?: (bidId: string) => void;
  currentUserId?: string;
  currentUserType?: string;
}

export function JobCard({
  job,
  onViewBids,
  onContactClick,
  onBidOnJob,
  onAcceptBid,
  currentUserId,
  currentUserType,
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColors: Record<string, string> = {
    open: 'bg-green-500/10 text-green-600 border-green-500/20',
    in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    completed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 border border-transparent hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="p-2 sm:p-4">
          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="relative flex-shrink-0">
              <Avatar className="h-8 sm:h-10 w-8 sm:w-10">
                <AvatarImage src={job.customer.avatarUrl} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs sm:text-sm">
                  {getInitials(job.customer.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-card ${
                  job.customer.isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs sm:text-sm truncate" data-testid={`text-customer-name-${job.id}`}>
                {job.customer.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className={`text-xs ${job.customer.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {job.customer.isOnline ? 'Online' : 'Off'}
                </span>
              </div>
            </div>

            <Badge className={`text-xs px-1.5 py-0.5 ${statusColors[job.status || 'open']}`}>
              {job.status?.slice(0, 4) || 'open'}
            </Badge>
          </div>

          {/* Job Title */}
          <h4 className="font-semibold text-sm mb-1 sm:mb-2 line-clamp-1" data-testid={`text-job-title-${job.id}`}>{job.title}</h4>

          {/* Description (truncated) */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
            {job.description}
          </p>

          {/* Budget & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-1 text-primary font-semibold text-xs sm:text-sm">
              <DollarSign className="h-3 sm:h-4 w-3 sm:w-4" />
              <span data-testid={`text-budget-${job.id}`} className="text-xs sm:text-base">₹{job.budgetMin}-₹{job.budgetMax}</span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
              <span className="text-xs">{job.city}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 sm:gap-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                onClick={() => onViewBids(job.id)}
                data-testid={`button-view-bids-${job.id}`}
              >
                <span className="hidden sm:inline">Bids</span>
                <span className="sm:hidden">({job.bids?.length || 0})</span>
                <span className="hidden sm:inline">({job.bids?.length || 0})</span>
                {isExpanded ? <ChevronUp className="h-3 sm:h-4 w-3 sm:w-4" /> : <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            {currentUserType === 'technician' && onBidOnJob ? (
              <Button
                className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                onClick={() => onBidOnJob(job.id)}
                data-testid={`button-bid-on-job-${job.id}`}
              >
                <DollarSign className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">Bid</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm"
                onClick={() => onContactClick(job.customer.id)}
                data-testid={`button-contact-${job.id}`}
              >
                <Lock className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
            )}
          </div>

          {/* Expanded Bids List */}
          <CollapsibleContent className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-3">Bids Received ({job.bids?.length || 0})</h4>
            
            {job.bids && job.bids.length > 0 ? (
              <div className="space-y-2">
                {job.bids.map((bid) => (
                  <Card key={bid.id} className="p-3 bg-muted/30">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={bid.technician.avatarUrl} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(bid.technician.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{bid.technician.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary">₹{bid.amount}</span>
                          <span>{bid.deliveryTime}</span>
                        </div>
                        {bid.note && (
                          <p className="text-xs text-muted-foreground mt-1">{bid.note}</p>
                        )}
                      </div>

                      {onAcceptBid && currentUserId === job.customerId && bid.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => onAcceptBid(bid.id)}
                          data-testid={`button-accept-bid-${bid.id}`}
                        >
                          Accept
                        </Button>
                      )}
                      {bid.status === 'accepted' && (
                        <Badge className="bg-green-500/10 text-green-600">Accepted</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No bids yet. Be the first to bid!
              </p>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </Card>
  );
}
