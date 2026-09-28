import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { AuthService } from '../../services/authService';
import { RouteService } from '../../services/routeService';
import { SyncService } from '../../services/sync/syncService';
import { AttendanceService } from '../../services/attendanceService';
import { UserProfile, RoutePlan, MTPDayPlan } from '../../types';

interface DashboardScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  onOpenDrawer: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenDrawer,
}) => {
  const [user, setUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);
  const [todayMTP, setTodayMTP] = useState<MTPDayPlan | null>(null);
  const [isWorking, setIsWorking] = useState(true);
  const [punchInTime, setPunchInTime] = useState<string | null>('10:14 AM');
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    const usr = AuthService.getCurrentUser();
    setUser(usr);
    const route = await RouteService.getActiveRoute();
    setActiveRoute(route);
    const mtpDay = await RouteService.getTodayMTPDay();
    setTodayMTP(mtpDay);

    const att = await AttendanceService.getTodayAttendance();
    setIsWorking(att.isPunchedIn);
    if (att.punchInTime) {
      setPunchInTime(att.punchInTime);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleDutyPress = async () => {
    if (isWorking) {
      Alert.alert(
        'Stop Working',
        'Mark shift punch-out and conclude field operations for today?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Stop Working',
            style: 'destructive',
            onPress: async () => {
              await AttendanceService.punchOut();
              setIsWorking(false);
            },
          },
        ]
      );
    } else {
      onNavigate('ATTENDANCE');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Green Brand Header */}
      <View style={styles.topGreenHeader}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={onOpenDrawer}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.companyTitle} numberOfLines={1}>
          PROGRESSIVE MOLECULES PRIVATE...
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Subheader Status Bar (Dark Overlay) */}
      <View style={styles.statusSubHeader}>
        <TouchableOpacity
          style={styles.dutyToggleBtn}
          onPress={handleDutyPress}
          activeOpacity={0.8}
        >
          <Text style={styles.dutyToggleText}>
            {isWorking ? 'Stop Working' : 'Start Working'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statusRightCol}>
          <Text style={styles.sinceTimeText}>
            Since : {punchInTime || '10:14 AM'}
          </Text>
          <Text style={styles.hoCityText}>HO : Sribhumi</Text>
        </View>
      </View>

      {/* Dark Charcoal Action Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollGridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#34C759']} />
        }
      >
        <View style={styles.gridContainer}>
          {/* Tile 1: VISITS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('VISIT_EXECUTION_LIST')}
            activeOpacity={0.75}
          >
            <Ionicons name="location-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>VISITS</Text>
          </TouchableOpacity>

          {/* Tile 2: DOCTORS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('DOCTORS')}
            activeOpacity={0.75}
          >
            <Ionicons name="people-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>DOCTORS</Text>
          </TouchableOpacity>

          {/* Tile 3: FIRMS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('FIRMS')}
            activeOpacity={0.75}
          >
            <Ionicons name="cube-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>FIRMS</Text>
          </TouchableOpacity>

          {/* Tile 4: CALENDAR (TOUR PLAN) */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('TOUR_PLAN')}
            activeOpacity={0.75}
          >
            <Ionicons name="calendar-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>CALENDAR</Text>
          </TouchableOpacity>

          {/* Tile 5: EXPENSES */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('EXPENSES')}
            activeOpacity={0.75}
          >
            <Text style={styles.rupeeIcon}>₹</Text>
            <Text style={styles.tileTitle}>EXPENSES</Text>
          </TouchableOpacity>

          {/* Tile 6: FILES */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('FILES')}
            activeOpacity={0.75}
          >
            <Ionicons name="document-text-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>FILES</Text>
          </TouchableOpacity>

          {/* Tile 7: LEAVES */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('LEAVES')}
            activeOpacity={0.75}
          >
            <Ionicons name="airplane-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>LEAVES</Text>
          </TouchableOpacity>

          {/* Tile 8: REPORTS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('REPORTS')}
            activeOpacity={0.75}
          >
            <Ionicons name="bar-chart-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>REPORTS</Text>
          </TouchableOpacity>

          {/* Tile 9: BUSINESS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('BUSINESS_PLAN')}
            activeOpacity={0.75}
          >
            <Ionicons name="trending-up-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>BUSINESS</Text>
          </TouchableOpacity>

          {/* Tile 10: BIRTHDAYS ANNIVERSARIES */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => {
              Alert.alert('Celebrations & Greetings', 'No doctor birthdays or clinic anniversaries scheduled for today in Barak Division.');
            }}
            activeOpacity={0.75}
          >
            <Ionicons name="gift-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitleCenter}>BIRTHDAYS{"\n"}ANNIVERSARIES</Text>
          </TouchableOpacity>

          {/* Tile 11: NOTIFICATIONS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('NOTIFICATIONS')}
            activeOpacity={0.75}
          >
            <Ionicons name="notifications-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>NOTIFICATIONS</Text>
          </TouchableOpacity>

          {/* Tile 12: APP TUTORIAL */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => {
              Alert.alert('RepPulse SFA Guide', '1. Complete morning selfie attendance by 10:30 AM.\n2. Execute DCR doctor visits within 100m geofence.\n3. Submit monthly tour plan in Calendar.');
            }}
            activeOpacity={0.75}
          >
            <Ionicons name="help-circle-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>APP TUTORIAL</Text>
          </TouchableOpacity>

          {/* Tile 13: MONTHLY SUMMARY */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('MONTHLY_SUMMARY')}
            activeOpacity={0.75}
          >
            <Ionicons name="pie-chart-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitleCenter}>MONTHLY{"\n"}SUMMARY</Text>
          </TouchableOpacity>

          {/* Tile 14: HOLIDAYS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('HOLIDAYS')}
            activeOpacity={0.75}
          >
            <Ionicons name="sunny-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>HOLIDAYS</Text>
          </TouchableOpacity>

          {/* Tile 15: ORDERS */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => onNavigate('ORDERS')}
            activeOpacity={0.75}
          >
            <Ionicons name="cube-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>ORDERS</Text>
          </TouchableOpacity>

          {/* Tile 16: COURSEWORK */}
          <TouchableOpacity
            style={styles.tileCard}
            onPress={() => {
              Alert.alert('Medical Product Training', 'Product detailing coursework for CardioPulse & CefoPulse series is complete.');
            }}
            activeOpacity={0.75}
          >
            <Ionicons name="document-text-outline" size={32} color="#FFFFFF" />
            <Text style={styles.tileTitle}>COURSEWORK</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#374151',
  },
  topGreenHeader: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  hamburgerBtn: {
    padding: spacing.xs,
  },
  hamburgerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyTitle: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  statusSubHeader: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dutyToggleBtn: {
    paddingVertical: spacing.xs,
  },
  dutyToggleText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  statusRightCol: {
    alignItems: 'flex-end',
  },
  sinceTimeText: {
    color: '#CBD5E1',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  hoCityText: {
    color: '#94A3B8',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  scrollGridContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tileCard: {
    width: '48.5%',
    height: 105,
    backgroundColor: '#52525B',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
    ...shadows.card,
  },
  tileTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tileTitleCenter: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  rupeeIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
