import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/main';
import { OrdersScreen, OrderDetailsScreen } from '../screens/orders';
import { MenuScreen } from '../screens/menu';
import { PayoutsScreen } from '../screens/payouts';
import { MoreScreen, SettingsScreen, OutletSettingsScreen, SupportScreen } from '../screens/more';
import { useTheme } from '../hooks';
import { colors, typography } from '../theme';
import { Home, Package, BookOpen, Wallet, MoreHorizontal } from 'lucide-react-native';
import { FEATURE_FLAGS } from '../constants';

// Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Menu: undefined;
  Payouts: undefined;
  More: undefined;
};

// Stack Navigators for each tab
export type HomeStackParamList = {
  HomeMain: undefined;
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetails: { orderId: string };
};

export type MenuStackParamList = {
  MenuMain: undefined;
};

export type PayoutsStackParamList = {
  PayoutsMain: undefined;
};

export type MoreStackParamList = {
  MoreMain: undefined;
  Settings: undefined;
  OutletSettings: undefined;
  Support: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const MenuStack = createNativeStackNavigator<MenuStackParamList>();
const PayoutsStack = createNativeStackNavigator<PayoutsStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
  </HomeStack.Navigator>
);

const OrdersStackNavigator: React.FC = () => (
  <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
    <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
    <OrdersStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
  </OrdersStack.Navigator>
);

const MenuStackNavigator: React.FC = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MenuMain" component={MenuScreen} />
  </MenuStack.Navigator>
);

const PayoutsStackNavigator: React.FC = () => (
  <PayoutsStack.Navigator screenOptions={{ headerShown: false }}>
    <PayoutsStack.Screen name="PayoutsMain" component={PayoutsScreen} />
  </PayoutsStack.Navigator>
);

const MoreStackNavigator: React.FC = () => (
  <MoreStack.Navigator screenOptions={{ headerShown: false }}>
    <MoreStack.Screen name="MoreMain" component={MoreScreen} />
    <MoreStack.Screen name="Settings" component={SettingsScreen} />
    <MoreStack.Screen name="OutletSettings" component={OutletSettingsScreen} />
    <MoreStack.Screen name="Support" component={SupportScreen} />
  </MoreStack.Navigator>
);

export const MainNavigator: React.FC = () => {
  const { currentColors } = useTheme();

  // Build visible tabs based on feature flags
  const visibleTabs: Array<{ name: keyof MainTabParamList; component: React.FC }> = [
    { name: 'Home', component: HomeStackNavigator },
    ...(FEATURE_FLAGS.ENABLE_ORDERS_TAB ? [{ name: 'Orders' as const, component: OrdersStackNavigator }] : []),
    ...(FEATURE_FLAGS.ENABLE_MENU_TAB ? [{ name: 'Menu' as const, component: MenuStackNavigator }] : []),
    ...(FEATURE_FLAGS.ENABLE_PAYOUTS_TAB ? [{ name: 'Payouts' as const, component: PayoutsStackNavigator }] : []),
    { name: 'More', component: MoreStackNavigator },
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentColors.card,
          borderTopColor: currentColors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary.cyan,
        tabBarInactiveTintColor: currentColors.text.muted,
        tabBarLabelStyle: {
          fontSize: typography.sizes.xs,
          fontWeight: typography.fontWeight.medium,
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Home size={24} color={color} />;
            case 'Orders':
              return <Package size={24} color={color} />;
            case 'Menu':
              return <BookOpen size={24} color={color} />;
            case 'Payouts':
              return <Wallet size={24} color={color} />;
            case 'More':
              return <MoreHorizontal size={24} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      {visibleTabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};
