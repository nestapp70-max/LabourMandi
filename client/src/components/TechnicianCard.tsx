import { useState } from "react";
import { Star, MapPin, Briefcase, ChevronDown, ChevronUp, MessageCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { TechnicianProfile, User, PortfolioItem } from "@shared/schema";

interface TechnicianCardProps {
  technician: User & { profile: TechnicianProfile; portfolio: PortfolioItem[] };
  onWhatsAppClick: (technicianId: string) => void;
  onBidClick: (technicianId: string) => void;
  currentUserId?: string;
}

export function TechnicianCard({
  technician,
  onWhatsAppClick,
  onBidClick,
  currentUserId,
}: TechnicianCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isContactUnlocked = currentUserId && technician.profile.whatsappUnlockedBy?.includes(currentUserId);

  return (
    <Card className="overflow-hidden transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="p-2 sm:p-4">
          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 sm:h-16 w-12 sm:w-16 rounded-lg">
                <AvatarImage src={technician.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                  {getInitials(technician.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 border-card ${
                  technician.isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
                title={technician.isOnline ? 'Online' : 'Offline'}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate" data-testid={`text-technician-name-${technician.id}`}>
                {technician.name}
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-2.5 sm:h-3 w-2.5 sm:w-3 flex-shrink-0" />
                <span className="truncate text-xs">{technician.city}, {technician.pin}</span>
              </div>
            </div>

            <CollapsibleTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 sm:h-8 w-7 sm:w-8 flex-shrink-0" data-testid={`button-expand-${technician.id}`}>
                {isExpanded ? <ChevronUp className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> : <ChevronDown className="h-3.5 sm:h-4 w-3.5 sm:w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Category & Experience */}
          <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm font-medium">{technician.profile.category}</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Briefcase className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
              <span>{technician.profile.yearsExperience} years exp.</span>
            </div>
          </div>

          {/* Wages */}
          <div className="bg-muted/30 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Daily</p>
                <p className="text-base sm:text-lg font-semibold text-primary" data-testid={`text-daily-wage-${technician.id}`}>
                  ₹{technician.profile.dailyWage}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Hourly</p>
                <p className="text-base sm:text-lg font-semibold text-primary">
                  ₹{technician.profile.hourlyWage}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Rating & Skills */}
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md">
              <Star className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-current" />
              <span className="text-xs sm:text-sm font-medium">{(technician.profile.rating / 10).toFixed(1)}</span>
            </div>
            {technician.profile.subcategories?.slice(0, 2).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0.5">
                {skill.length > 8 ? skill.slice(0, 8) : skill}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 sm:gap-2">
            <Button
              className="flex-1 gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white"
              onClick={() => onWhatsAppClick(technician.id)}
              data-testid={`button-whatsapp-${technician.id}`}
            >
              <MessageCircle className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-1 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => onBidClick(technician.id)}
              data-testid={`button-bid-${technician.id}`}
            >
              <DollarSign className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="hidden sm:inline">Bid</span>
              <span className="sm:hidden">$</span>
            </Button>
          </div>

          {/* Expanded Portfolio */}
          <CollapsibleContent className="mt-4 pt-4 border-t border-border">
            {/* Bio */}
            {technician.bio && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{technician.bio}</p>
              </div>
            )}

            {/* Portfolio Gallery */}
            {technician.portfolio && technician.portfolio.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Portfolio</h4>
                <div className="grid grid-cols-3 gap-2">
                  {technician.portfolio.map((item) => (
                    <div key={item.id} className="relative rounded-lg overflow-hidden aspect-square bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Briefcase className="h-6 w-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <p className="text-xs text-white font-medium truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {technician.profile.certifications && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Certifications</h4>
                <p className="text-sm text-muted-foreground">{technician.profile.certifications}</p>
              </div>
            )}

            {/* Contact Info (if unlocked) */}
            {isContactUnlocked && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-green-600 mb-1">Contact Unlocked</h4>
                <p className="text-sm">WhatsApp: {technician.profile.whatsappNumber}</p>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </Card>
  );
}
