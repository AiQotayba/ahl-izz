# 🎨 Donation Hub Dashboard Components

This directory contains all the UI components for the Donation Hub application, designed based on the vibrant green-themed Arabic dashboard interface.

## 📦 Components

### 🟢 LiveDonations
Displays a list of live donations with Arabic text "التبرعات المباشرة"
- **Features**: Real-time donation feed, Arabic donor names, amount display
- **Colors**: Gold header, green amount buttons, dark teal text
- **Usage**: `<LiveDonations donations={pledges} />`

### ⭐ TopDonations  
Shows top donations with star icon and "أعلى التبرعات" header
- **Features**: Horizontal scrollable cards, company names, large amounts
- **Colors**: Black background, teal header with yellow star, gold/teal cards
- **Usage**: `<TopDonations donations={topDonations} />`

### 💰 TotalDonations
Compact total donations display with icon
- **Features**: Hand icon, Arabic title "إجمالي التبرعات", loading state
- **Colors**: White background, teal text/icon, olive amount section
- **Usage**: `<TotalDonations totalAmount={amount} isLoading={loading} />`

### 🏢 LargeTotalDonations
Large format total donations with company branding
- **Features**: Large amount display, company name, loading state
- **Colors**: Gold amount section, teal company section
- **Usage**: `<LargeTotalDonations totalAmount={amount} companyName="شركة الجبل" />`

### 🏷️ Logo
Campaign logo with Arabic text "أهل العزملة لا ينسون"
- **Features**: Decorative Arabic typography, highlighted text
- **Colors**: Teal text with gold highlights
- **Usage**: `<Logo className="custom-class" />`

### 👥 DonorsCount
Donors count display with QR code
- **Features**: Count display, QR code placeholder, loading state
- **Colors**: Teal background, white QR code
- **Usage**: `<DonorsCount count={2000} isLoading={loading} />`

## 🎨 Color Palette

The components use a custom color palette defined in `tailwind.config.ts`:

```typescript
donation: {
  gold: "#B89B2F",      // Header backgrounds, amount sections
  teal: "#1E7B6B",      // Primary text, icons, company sections  
  darkTeal: "#2F4F4F",  // Secondary text
  yellow: "#FDD835",    // Star icons, accent elements
  olive: "#A8B02F",     // Amount backgrounds
  green: "#20B2AA",     // Amount buttons
}
```

## 📱 Responsive Design

All components are fully responsive and work on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+) 
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🌐 Arabic Support

Components include proper Arabic text support:
- RTL (Right-to-Left) text alignment
- Arabic fonts and typography
- Cultural color choices
- Proper spacing for Arabic text

## 🔧 Usage Examples

### Basic Usage
```tsx
import { LiveDonations, TopDonations, TotalDonations } from '@/components';

function HomePage() {
  return (
    <div>
      <LiveDonations />
      <TotalDonations totalAmount={1000000} />
      <TopDonations />
    </div>
  );
}
```

### With Real Data
```tsx
import { LiveDonations } from '@/components';
import { usePledges } from '@/hooks/usePledges';

function HomePage() {
  const { pledges, loading } = usePledges();
  
  return (
    <LiveDonations 
      donations={pledges} 
      isLoading={loading}
    />
  );
}
```

### Custom Styling
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <LiveDonations />
  <TotalDonations totalAmount={stats.totalAmount} />
</div>
```

## 🎯 Design Principles

1. **Accessibility**: High contrast colors, proper text sizes
2. **Performance**: Optimized rendering, lazy loading support
3. **Consistency**: Unified color scheme and spacing
4. **Cultural Sensitivity**: Arabic-first design approach
5. **Mobile-First**: Responsive design from mobile up
6. **Islamic Aesthetics**: Geometric patterns and cultural color choices
7. **Dashboard Layout**: Clean, organized information display

## 🔄 Real-time Updates

Components support real-time updates through:
- Socket.IO integration
- State management with React hooks
- Optimistic updates
- Loading states and error handling

## 📊 Data Integration

Components work with the following data structures:

```typescript
interface PledgeData {
  _id: string;
  donorName?: string;
  amount: number;
  createdAt: Date;
}

interface TopDonation {
  id: string;
  amount: number;
  companyName: string;
}
```

## 🎨 Dashboard Layout

The new dashboard layout features:

### 📐 Grid System
- **3-column layout** on large screens
- **Responsive stacking** on mobile devices
- **Islamic geometric pattern** background
- **Clean white panels** with rounded corners

### 🎯 Component Positioning
```
┌─────────────────────────────────────────┐
│                    [Logo]               │
├─────────────┬───────────────────────────┤
│             │                           │
│ Live        │      Top Donations        │
│ Donations   │                           │
│             │                           │
├─────────────┼───────────────────────────┤
│ Donors      │    Total Donations        │
│ Count       │                           │
└─────────────┴───────────────────────────┘
```

### 🌟 Visual Features
- **Islamic geometric patterns** in background
- **Vibrant green color scheme** (teal, gold, olive)
- **Arabic typography** with decorative elements
- **QR code integration** for donor count
- **Real-time data display** with loading states

## 🚀 Future Enhancements

- [ ] Animation support for real-time updates
- [ ] Dark mode support
- [ ] Customizable color themes
- [ ] Export functionality for donation data
- [ ] Advanced filtering and sorting
- [ ] Multi-language support beyond Arabic
- [ ] Interactive QR code generation
- [ ] Advanced Islamic pattern variations
- [ ] Sound effects for donations
- [ ] Social sharing integration
