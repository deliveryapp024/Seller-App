# Seller App - React Native

## 📱 Project Overview
A React Native seller app for restaurant/food outlet management, designed with the same UI/UX as the delivery app.

## 🎨 Design System
- **Theme**: Dark mode primary (as shown in delivery app)
- **Primary Color**: Cyan/Teal (`#00E5CC`)
- **Background**: Deep teal-black (`#0D1F1F`)
- **Cards**: Dark teal (`#1A2F2F`)

## 📁 Project Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Card, Input, Toggle, Badge)
│   ├── charts/          # Chart components (LineChart)
│   └── seller/          # Seller-specific components (OrderCard, MenuItemCard, MetricCard)
├── screens/
│   ├── auth/            # Login, OTP screens
│   ├── main/            # Home screen
│   ├── orders/          # Orders list, Order details
│   ├── menu/            # Menu management
│   ├── payouts/         # Payouts and earnings
│   └── more/            # Settings, Profile, Support
├── navigation/          # Navigation setup (Auth, Main, Root)
├── theme/               # Design tokens (colors, typography, spacing, shadows)
├── hooks/               # Custom hooks (useTheme)
├── types/               # TypeScript types
└── data/                # Mock data
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment setup
- Android Studio (for Android) or Xcode (for iOS)

### Installation
```bash
# Navigate to project directory
cd "C:\Users\arali\C A Aralimatti Project\DeliveryAppSeller"

# Install dependencies (already installed)
npm install

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## 📱 Screens Implemented (Phase 1)

### Auth Screens
- ✅ Login (Mobile number input)
- ✅ OTP Verification (6-digit code)

### Main Screens (Bottom Navigation)
1. **Home** 🏠
   - Online/Offline toggle
   - Today's earnings with chart
   - Daily goal progress
   - Performance metrics (Acceptance, On-Time, Completion, Rating)
   - Quick actions grid

2. **Orders** 📦
   - Tab navigation (New, Active, History)
   - Order cards with status
   - Order details screen
   - Accept/Decline actions

3. **Menu** 📋
   - Category tabs
   - Menu items list
   - Availability toggle
   - Veg/Non-veg indicators

4. **Payouts** 💰
   - Available balance
   - Earnings summary
   - Payout history
   - Fee breakdown

5. **More** ⚙️
   - Profile information
   - Outlet settings
   - Preferences (Dark mode, Notifications, Language)
   - Support
   - Logout

## 🛠️ Tech Stack
- React Native 0.83.1
- TypeScript
- React Navigation v6
- React Native Reanimated (animations)
- React Native Gifted Charts
- Lucide React Native (icons)

## 📊 Mock Data
All screens are populated with realistic mock data:
- Orders with various statuses
- Menu categories and items
- Payout history
- Earnings data with chart

## ⚙️ Features Implemented
- ✅ Dark/Light theme toggle
- ✅ Smooth animations
- ✅ Line charts for earnings
- ✅ Bottom tab navigation
- ✅ Stack navigation
- ✅ Toggle switches
- ✅ Cards with shadows
- ✅ Responsive layout

## 🔮 Coming in Phase 2
- Discounts & Promotions
- Ads Campaign management
- Growth insights
- Reviews & Ratings
- Complaints workflow

## 📝 Notes
- All data is mock data - no API integration
- Authentication is UI only - no backend
- Dark mode is the default theme
- Printer integration planned for later
- Multi-outlet support planned for later
- Language support (Hindi, Kannada, Marathi) planned for later

## 👨‍💻 Developer
Created by following the exact design language of the delivery app with all features from the SELLER_APP_PRODUCT_MAP.md
