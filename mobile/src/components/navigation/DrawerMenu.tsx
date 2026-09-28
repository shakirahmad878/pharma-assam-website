import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { UserProfile } from '../../types';

interface DrawerMenuProps {
  visible: boolean;
  user: UserProfile | null;
  activeScreen: string;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

interface MenuItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  visible,
  user,
  activeScreen,
  onClose,
  onNavigate,
  onLogout,
}) => {
  const menuItems: MenuItem[] = [
    { key: 'DASHBOARD', label: 'Home', icon: 'home-outline' },
    { key: 'VISIT_EXECUTION_LIST', label: 'Visits', icon: 'medkit-outline' },
    { key: 'TOUR_PLAN', label: 'Tour Plan Calendar', icon: 'calendar-outline' },
    { key: 'DOCTORS', label: 'Clients / Doctors', icon: 'people-outline' },
    { key: 'FIRMS', label: 'Firms & Stockists', icon: 'storefront-outline' },
    { key: 'BUSINESS_PLAN', label: 'Business Planning', icon: 'trending-up-outline' },
    { key: 'MONTHLY_SUMMARY', label: 'Monthly Summary', icon: 'pie-chart-outline' },
    { key: 'REPORTS', label: 'Reports & Analytics', icon: 'bar-chart-outline' },
    { key: 'EXPENSES', label: 'Expenses & SFC', icon: 'receipt-outline' },
    { key: 'LEAVES', label: 'Leave Balance', icon: 'airplane-outline' },
    { key: 'HOLIDAYS', label: 'Holiday List (Assam)', icon: 'sunny-outline' },
    { key: 'ORDERS', label: 'POB Orders', icon: 'cart-outline' },
    { key: 'HOSPITALS', label: 'Hospitals Directory', icon: 'business-outline' },
    { key: 'SYNC', label: 'Synchronize', icon: 'cloud-upload-outline' },
    { key: 'NOTIFICATIONS', label: 'Notification', icon: 'notifications-outline' },
    { key: 'FILES', label: 'Files & e-Detailing', icon: 'folder-open-outline' },
    { key: 'COMMANDS', label: 'Commands', icon: 'terminal-outline' },
    { key: 'PROFILE', label: 'My Info', icon: 'person-outline' },
  ];

  const handleSelect = (key: string) => {
    onClose();
    onNavigate(key);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          {/* User Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || 'Shakir Ahmad'}</Text>
            <Text style={styles.userRole}>
              {user?.role === 'MEDICAL_REP' ? 'Medical Representative (MR)' : user?.role || 'Representative'}
            </Text>
            <View style={styles.territoryRow}>
              <Ionicons name="location-outline" size={14} color="#1E3A8A" />
              <Text style={styles.userTerritory}>{user?.territory || 'Barak Division, Assam'}</Text>
            </View>
            <View style={styles.divider} />
          </View>

          {/* Menu Items List */}
          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            {menuItems.map(item => {
              const isActive = activeScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleSelect(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={isActive ? '#1D4ED8' : '#1E3A8A'}
                    />
                  </View>
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
              <View style={styles.logoutIconBox}>
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              </View>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Version Tag */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>RepPulse v1.3.1 (Barak Division)</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#93C5FD',
    zIndex: 99999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  profileHeader: {
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#93C5FD',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: '#0F172A',
  },
  userRole: {
    fontSize: typography.fontSize.xs,
    color: '#1E3A8A',
    fontWeight: typography.fontWeight.semibold,
    marginTop: 2,
  },
  territoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userTerritory: {
    fontSize: 11,
    color: '#1E3A8A',
    fontWeight: typography.fontWeight.medium,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginTop: spacing.md,
  },
  menuScroll: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: 1,
  },
  menuItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {},
  menuText: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.medium,
    color: '#1E3A8A',
    marginLeft: spacing.sm,
    flex: 1,
  },
  menuTextActive: {
    color: '#1D4ED8',
    fontWeight: typography.fontWeight.bold,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1D4ED8',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    borderRadius: radius.md,
    backgroundColor: 'rgba(254, 226, 226, 0.7)',
  },
  logoutIconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#DC2626',
    marginLeft: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#1E3A8A',
    fontWeight: typography.fontWeight.semibold,
  },
});
