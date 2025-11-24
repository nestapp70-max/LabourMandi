# LabourMandi Design Guidelines

## Design Approach
**System-Based with Custom Aesthetic**: Dark, modern marketplace UI inspired by the provided screenshots, emphasizing professional service marketplace patterns with matte material treatment.

## Color System
- **Background**: Matte Black (#0A0A0A to #121212 range)
- **Primary Accent**: Green (#00A86B) - teal-green for CTAs, status indicators, active states
- **Surface Cards**: Dark gray (#1A1A1A to #1F1F1F) with soft shadows
- **Text Hierarchy**: 
  - Primary: White (#FFFFFF)
  - Secondary: Light gray (#A0A0A0)
  - Tertiary: Medium gray (#666666)
- **Status Indicators**: 
  - Online: Green (#00A86B)
  - Offline: Gray (#666666)
  - Success: Same green
  - Warning: Amber (#FFA500)
- **Shadows**: Soft, subtle - `shadow-md` to `shadow-lg` with low opacity black

## Typography
- **Font Family**: Modern sans-serif (Inter, Plex Sans, or system default)
- **Hierarchy**:
  - Logo: 24px, bold, green accent
  - Headers (H1): 32px, semi-bold
  - Card Titles: 18px, medium weight
  - Body Text: 14-16px, regular
  - Labels/Meta: 12-14px, medium, secondary color
  - Button Text: 14px, medium weight

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, gap-6, m-8)

### Main Structure
1. **Header** (sticky, dark background):
   - Height: 64px (h-16)
   - Padding: px-6
   - Items: Logo (left) → Search bar (center-left) → Category dropdown → Post Job button → Sign In button (all flex with gap-4)

2. **First Block** (below header):
   - Max-width: max-w-7xl, mx-auto
   - Padding: p-6
   - **Left Section** (w-1/4): Filter panel with input, dropdown, mic icon
   - **Middle Section** (flex-1): 
     - Horizontal SVG icon slider (scrollable chips, gap-3, each icon 48x48px in rounded card)
   - **Below Icons**: Two large CTA cards (grid-cols-2, gap-4):
     - Card A: "Post Your Job" with description, CTA button
     - Card B: "Get Bids / Connect & Hire" with CTA
   - Each CTA card: p-6, rounded-xl, dark surface with green accent border on hover

3. **Main Dual Column** (max-w-7xl, gap-6):
   - **Left Column** (w-2/5): Customer job profiles list
   - **Right Column** (w-3/5): Technician cards grid

## Component Library

### Technician Cards
- **Dimensions**: Uniform height, rounded-lg, p-4
- **Layout**: 
  - Top: Square DP (64x64px, rounded-lg) + Name + Online badge (8px dot)
  - City/PIN + Category (text-sm, secondary color)
  - Experience years
  - **Wages**: Two-line display - "Base ₹299/day · ₹8/hr" (prominent, medium weight)
  - Rating badge (star icon + number)
  - 1-3 skill tags (rounded chips, text-xs, py-1 px-2, green/10 background)
  - **Buttons row**: WhatsApp (green bg, white text) + Bid (green outline)
- **Expanded Portfolio** (accordion):
  - Gallery grid (grid-cols-3, gap-2, rounded thumbnails)
  - Bio section (p-4)
  - Certifications list
  - Past jobs cards (title, summary, price in rounded boxes)
  - Full contact (if unlocked)

### Job Profile Cards (Left Column)
- **Layout**: p-4, rounded-lg, mb-3
- Customer DP (40px circle) + Name + Status dot
- Job title (font-medium, 16px)
- Budget range: ₹X-Y (green text, semi-bold)
- PIN/City (text-sm)
- Buttons: "View Bids" + "Contact" (if contact locked, show lock icon)
- **Expanded View**: Bids list with bid cards showing technician, amount, time, message, "Accept" button

### Bid Submission Modal
- Dark overlay (bg-black/80)
- Centered card (max-w-lg, p-6)
- **Bid Row**: Amount input + Delivery time + Note textarea + Default checkbox
- "Add another bid" link (green text)
- Submit button (full-width, green bg)

### Wallet Unlock Modal
- Same overlay treatment
- Card showing: "Unlock contact for ₹10"
- Current balance display (large, green if sufficient)
- Two buttons: "Unlock via Wallet" + "Recharge Wallet"
- Recharge options: Three amount chips (₹50, ₹100, ₹500)

### Forms (Signup/Profile)
- Input fields: h-12, px-4, rounded-lg, dark surface, green focus ring
- Labels: text-sm, mb-2, secondary color
- File upload: Dashed border box, centered icon + text
- Dropdowns: Same height as inputs, chevron icon
- Multi-select: Chip-based with remove icons

### Buttons
- **Primary (Green)**: bg-[#00A86B], text-white, px-6, py-3, rounded-lg, font-medium
- **Secondary (Outline)**: border-2 border-green, text-green, same padding
- **Icon Buttons**: Square (40x40px), rounded-lg, centered icon
- All buttons: Blur background if on images, consistent hover states

## Search & Navigation
- **Search Bar**: h-12, rounded-full, dark surface, placeholder gray, green focus ring
- **Category Dropdown**: Same height, rounded-lg, chevron down icon
- **Icon Slider**: Horizontal scroll (overflow-x-auto, hide scrollbar), each icon in 48x48px rounded card with label below

## Cards & Surfaces
- **Main Cards**: rounded-xl, p-4 to p-6, dark surface (#1A1A1A)
- **Nested Cards**: rounded-lg, p-3, slightly lighter (#222222)
- **Shadows**: shadow-md for main cards, shadow-lg for modals
- **Borders**: Subtle borders (border-white/5) or none, rely on shadows

## Status & Badges
- **Online/Offline**: 8px circle, absolute positioned on avatar
- **Rating**: Star icon + number in small rounded badge
- **Skill Tags**: Rounded-full, py-1 px-3, text-xs, green/10 bg, green text

## Spacing Patterns
- **Section Padding**: py-8 to py-12
- **Card Gaps**: gap-4 to gap-6
- **Input Spacing**: mb-4 between form fields
- **Button Groups**: gap-3

## Responsive Behavior
- **Desktop** (lg:): Full dual-column layout
- **Tablet** (md:): Stacked columns, maintain card grids
- **Mobile**: Single column, full-width cards, collapse icon slider to vertical

## Animations
**Minimal Only**: 
- Accordion expand/collapse (max-height transition)
- Toast notifications (slide-in from top)
- No distracting effects

## Images
- **Avatar Fallbacks**: Gradient background with white initials (centered, text-lg, bold)
- **Portfolio Images**: Maintain aspect ratio, rounded corners, lazy load
- **No hero image** - This is a functional marketplace, not marketing page

## Accessibility
- Focus rings on all interactive elements (ring-2 ring-green/50)
- aria-labels on icon buttons
- Sufficient contrast ratios (white on dark meets WCAG AA)
- Keyboard navigation support for modals and accordions