import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  BackHandler,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import { colors, typography, spacing } from '../constants/theme';
import { AuthService } from '../services/authService';
import { NetworkBanner } from '../components/common/NetworkBanner';
import { DrawerMenu } from '../components/navigation/DrawerMenu';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { AttendanceScreen } from '../screens/attendance/AttendanceScreen';
import { DoctorListScreen } from '../screens/doctors/DoctorListScreen';
import { DoctorDetailsScreen } from '../screens/doctors/DoctorDetailsScreen';
import { VisitExecutionScreen } from '../screens/visits/VisitExecutionScreen';
import { POBBookingScreen } from '../screens/orders/POBBookingScreen';
import { SyncCenterScreen } from '../screens/sync/SyncCenterScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { RoutePlanScreen } from '../screens/routes/RoutePlanScreen';
import { HospitalDirectoryScreen } from '../screens/hospitals/HospitalDirectoryScreen';
import { FirmDirectoryScreen } from '../screens/firms/FirmDirectoryScreen';
import { CommandsScreen } from '../screens/commands/CommandsScreen';
import { AuxScreen } from '../screens/auxiliary/AuxScreens';

import { Doctor, UserProfile } from '../types';

export type ScreenName =
  | 'LOGIN'
  | 'DASHBOARD'
  | 'ATTENDANCE'
  | 'DOCTORS'
  | 'DOCTOR_DETAILS'
  | 'VISIT_EXECUTION'
  | 'VISIT_EXECUTION_LIST'
  | 'ORDERS'
  | 'SYNC'
  | 'PROFILE'
  | 'ROUTES'
  | 'HOSPITALS'
  | 'FIRMS'
  | 'COMMANDS'
  | 'NOTIFICATIONS'
  | 'EXPENSES'
  | 'LEAVES'
  | 'FILES'
  | 'TOUR_PLAN'
  | 'HOLIDAYS'
  | 'BUSINESS_PLAN'
  | 'REPORTS'
  | 'MONTHLY_SUMMARY';

interface StackEntry {
  screen: ScreenName;
  params?: any;
}

export const RootNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('DASHBOARD');
  const [currentParams, setCurrentParams] = useState<any>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Explicit LIFO Navigation History Stack to fix the Auto-Back bug permanently
  const historyRef = useRef<StackEntry[]>([]);
  const lastBackPressRef = useRef<number>(0);

  useEffect(() => {
    AuthService.restoreSession().then(user => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
    });

    // Check for 11:59 PM auto-logout every 30 seconds
    const timer = setInterval(async () => {
      const check = await AuthService.checkAutoLogout();
      if (check.autoLoggedOut) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        historyRef.current = [];
        if (Platform.OS === 'android') {
          ToastAndroid.show('Shift Concluded (11:59 PM). Automatically logged out.', ToastAndroid.LONG);
        }
      }
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Hardware Back Button Handler
  useEffect(() => {
    const onHardwareBack = () => {
      if (drawerVisible) {
        setDrawerVisible(false);
        return true;
      }

      if (!isAuthenticated) return false;

      // If we have screen history to pop
      if (historyRef.current.length > 0) {
        pop();
        return true;
      }

      // If we are on DASHBOARD with empty history, double-tap to exit
      if (currentScreen === 'DASHBOARD') {
        const now = Date.now();
        if (now - lastBackPressRef.current < 2000) {
          BackHandler.exitApp();
          return false;
        }
        lastBackPressRef.current = now;
        if (Platform.OS === 'android') {
          ToastAndroid.show('Press back again to exit RepPulse', ToastAndroid.SHORT);
        }
        return true;
      }

      // Fallback: Return to Dashboard
      replace('DASHBOARD');
      return true;
    };

    const handler = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => handler.remove();
  }, [currentScreen, isAuthenticated, drawerVisible]);

  const push = (screen: ScreenName, params?: any) => {
    if (screen === currentScreen && JSON.stringify(params) === JSON.stringify(currentParams)) {
      return;
    }
    historyRef.current.push({ screen: currentScreen, params: currentParams });
    setCurrentScreen(screen);
    setCurrentParams(params || null);
  };

  const pop = () => {
    if (historyRef.current.length > 0) {
      const prev = historyRef.current.pop();
      if (prev) {
        setCurrentScreen(prev.screen);
        setCurrentParams(prev.params || null);
      }
    } else {
      setCurrentScreen('DASHBOARD');
      setCurrentParams(null);
    }
  };

  const replace = (screen: ScreenName, params?: any) => {
    historyRef.current = [];
    setCurrentScreen(screen);
    setCurrentParams(params || null);
  };

  const handleNavigate = (screen: string, params?: any) => {
    if (screen === 'DASHBOARD') {
      replace('DASHBOARD');
      return;
    }
    push(screen as ScreenName, params);
  };

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Initializing RepPulse Enterprise SFA...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentUser(AuthService.getCurrentUser());
          replace('DASHBOARD');
        }}
        onForgotPassword={() => alert('Password reset link sent to your registered regional manager.')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NetworkBanner />

      {/* Slide-in Drawer Menu matching Screenshot 2 */}
      <DrawerMenu
        visible={drawerVisible}
        user={currentUser}
        activeScreen={currentScreen}
        onClose={() => setDrawerVisible(false)}
        onNavigate={handleNavigate}
        onLogout={() => {
          AuthService.logout().then(() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
          });
        }}
      />

      {/* Screen Viewport */}
      <View style={styles.screenContainer}>
        {currentScreen === 'DASHBOARD' && (
          <DashboardScreen
            onNavigate={handleNavigate}
            onOpenDrawer={() => setDrawerVisible(true)}
          />
        )}

        {currentScreen === 'ATTENDANCE' && (
          <AttendanceScreen onBack={pop} />
        )}

        {currentScreen === 'DOCTORS' && (
          <DoctorListScreen
            mode="MASTER"
            onBack={pop}
            onOpenDrawer={() => setDrawerVisible(true)}
            onNavigateToFirms={() => push('FIRMS')}
            onSelectDoctor={docId => push('DOCTOR_DETAILS', { doctorId: docId })}
          />
        )}

        {currentScreen === 'DOCTOR_DETAILS' && currentParams?.doctorId && (
          <DoctorDetailsScreen
            doctorId={currentParams.doctorId}
            onBack={pop}
            onStartVisit={(doc, ok, dist) =>
              push('VISIT_EXECUTION', { doctor: doc, isGeofenceOk: ok, distanceMeters: dist })
            }
          />
        )}

        {currentScreen === 'VISIT_EXECUTION' && currentParams && (
          <VisitExecutionScreen
            doctor={currentParams.doctor}
            isGeofenceVerified={currentParams.isGeofenceOk}
            distanceMeters={currentParams.distanceMeters}
            onBack={pop}
            onVisitComplete={() => replace('DASHBOARD')}
          />
        )}

        {currentScreen === 'VISIT_EXECUTION_LIST' && (
          <DoctorListScreen
            mode="VISITS"
            onBack={pop}
            onOpenDrawer={() => setDrawerVisible(true)}
            onNavigateToFirms={() => push('FIRMS')}
            onSelectDoctor={docId => push('DOCTOR_DETAILS', { doctorId: docId })}
          />
        )}

        {currentScreen === 'ORDERS' && (
          <POBBookingScreen
            onBack={pop}
            onOrderSuccess={() => replace('DASHBOARD')}
          />
        )}

        {currentScreen === 'ROUTES' && (
          <RoutePlanScreen onBack={pop} />
        )}

        {currentScreen === 'HOSPITALS' && (
          <HospitalDirectoryScreen onBack={pop} />
        )}

        {currentScreen === 'FIRMS' && (
          <FirmDirectoryScreen onBack={pop} />
        )}

        {currentScreen === 'COMMANDS' && (
          <CommandsScreen onBack={pop} />
        )}

        {currentScreen === 'SYNC' && (
          <SyncCenterScreen onBack={pop} />
        )}

        {currentScreen === 'PROFILE' && (
          <ProfileScreen
            onBack={pop}
            onLogout={() => {
              AuthService.logout().then(() => {
                setIsAuthenticated(false);
                setCurrentUser(null);
              });
            }}
          />
        )}

        {currentScreen === 'EXPENSES' && (
          <AuxScreen
            title="Daily Expenses & TA/DA"
            subtitle="Barak Division Allowance Claims"
            onBack={pop}
            type="EXPENSES"
          />
        )}

        {currentScreen === 'LEAVES' && (
          <AuxScreen
            title="Leave Management"
            subtitle="Casual & Sick Leave Balance"
            onBack={pop}
            type="LEAVES"
          />
        )}

        {currentScreen === 'TOUR_PLAN' && (
          <AuxScreen
            title="Tour Plan Calendar"
            subtitle="Barak Valley Monthly Programme"
            onBack={pop}
            type="TOUR_PLAN"
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'HOLIDAYS' && (
          <AuxScreen
            title="Holiday List"
            subtitle="Assam Regional Calendar 2026"
            onBack={pop}
            type="HOLIDAYS"
          />
        )}

        {currentScreen === 'BUSINESS_PLAN' && (
          <AuxScreen
            title="Business Planning"
            subtitle="Barak Valley Monthly Targets"
            onBack={pop}
            type="BUSINESS_PLAN"
          />
        )}

        {currentScreen === 'REPORTS' && (
          <AuxScreen
            title="Reports & Analytics"
            subtitle="18+ Strategic MIS Reports"
            onBack={pop}
            type="REPORTS"
          />
        )}

        {currentScreen === 'MONTHLY_SUMMARY' && (
          <AuxScreen
            title="Monthly Summary"
            subtitle="Barak Division Field Performance"
            onBack={pop}
            type="MONTHLY_SUMMARY"
          />
        )}

        {currentScreen === 'FILES' && (
          <AuxScreen
            title="Product Literature"
            subtitle="Visual Aids & Clinical Brochures"
            onBack={pop}
            type="FILES"
          />
        )}

        {currentScreen === 'NOTIFICATIONS' && (
          <AuxScreen
            title="Field Notifications"
            subtitle="Regional HQ Announcements"
            onBack={pop}
            type="NOTIFICATIONS"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.md,
  },
  screenContainer: {
    flex: 1,
  },
});
