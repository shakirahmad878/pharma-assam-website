import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../services/authService';
import { UserProfile } from '../../types';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onLogout }) => {
  const [user, setUser] = useState<UserProfile>(AuthService.getCurrentUser());
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [emailInput, setEmailInput] = useState(user.email || '');
  const [hqInput, setHqInput] = useState(user.headquarter || 'Silchar HQ');

  const handleSaveContact = async () => {
    const cleanedPhone = phoneInput.trim().replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit Indian mobile number (e.g. 9435012345).');
      return;
    }

    const updated = await AuthService.updateUserProfile({
      phone: `+91 ${cleanedPhone}`,
      email: emailInput.trim(),
      headquarter: hqInput.trim() || 'Silchar HQ',
    });

    setUser(updated);
    setEditModalVisible(false);
    Alert.alert('Profile Updated ✅', 'Your contact details have been updated successfully.');
  };

  const handleLogoutConfirm = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of field operations?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await AuthService.logout();
          onLogout();
        },
      },
    ]);
  };

  const roleTitle =
    user.role === 'REGIONAL_MANAGER'
      ? 'Regional Sales Manager (RSM)'
      : user.role === 'AREA_MANAGER'
      ? 'Area Business Manager (ABM)'
      : 'Medical Representative (MR)';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Representative Profile" subtitle="Barak Valley Division (Assam)" showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Identity Card */}
        <Card>
          <View style={styles.userRow}>
            <View style={[styles.avatar, user.role === 'AREA_MANAGER' && { backgroundColor: '#16A34A' }]}>
              <Text style={styles.avatarText}>
                {user.name ? user.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase() : 'MR'}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRoleText}>{roleTitle}</Text>
              <Text style={styles.userCode}>Employee ID: #{user.employeeCode}</Text>
              <View style={styles.territoryRow}>
                <Ionicons name="location-outline" size={14} color="#1D4ED8" />
                <Text style={styles.userTerritory}>{user.territory || 'Barak Valley Division (Assam)'}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact Info Card */}
        <Card>
          <View style={styles.cardHeaderWithAction}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="call" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <TouchableOpacity
              style={styles.editContactPill}
              onPress={() => {
                setPhoneInput(user.phone ? user.phone.replace('+91 ', '') : '');
                setEmailInput(user.email || '');
                setHqInput(user.headquarter || 'Silchar HQ');
                setEditModalVisible(true);
              }}
            >
              <Ionicons name="create-outline" size={14} color="#2563EB" />
              <Text style={styles.editContactPillText}>
                {user.phone ? 'Edit Contact' : '+ Fill Contact'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile Number:</Text>
            <Text style={[styles.infoVal, !user.phone && styles.unsetText]}>
              {user.phone ? user.phone : 'Not Set (Tap + Fill Contact)'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Official Email:</Text>
            <Text style={styles.infoVal}>{user.email || 'Not configured'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Headquarter Base:</Text>
            <Text style={styles.infoVal}>{user.headquarter || 'Silchar HQ'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Routes:</Text>
            <Text style={styles.infoVal}>6 Core Corridors (Cachar, Karimganj, Hailakandi)</Text>
          </View>
        </Card>

        {/* Location & Battery Privacy Transparency */}
        <Card>
          <Text style={styles.sectionTitle}>Location Transparency & Privacy</Text>
          <Text style={styles.privacyDesc}>
            • RepPulse captures 15-minute background location pings exclusively while clocked in on field duty.
          </Text>
          <Text style={styles.privacyDesc}>
            • Real-time locations and route trails are viewable strictly by authorized Regional Managers & Super Admins.
          </Text>
          <Text style={styles.privacyDesc}>
            • Ensure App Battery is set to "Unrestricted" in Phone Settings so Doze mode does not pause background sync.
          </Text>
        </Card>

        {/* App Info */}
        <Card>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <Text style={styles.infoText}>Version: 1.2.0 (Barak Division Production Build)</Text>
          <Text style={styles.infoText}>Platform: RepPulse Enterprise SFA</Text>
          <Text style={styles.infoText}>Headquarter Base: Silchar, Assam</Text>
          <Text style={styles.infoText}>Territory: Barak Valley Division (Assam)</Text>
        </Card>

        {/* Logout Action */}
        <View style={styles.logoutBtn}>
          <Button title="🚪 Log Out of Account" onPress={handleLogoutConfirm} variant="danger" />
        </View>
      </ScrollView>

      {/* Contact Info Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="call" size={20} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>Update Contact Details</Text>
              </View>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubDescription}>
              Enter mobile phone number and contact details for {user.name} ({roleTitle}).
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabelSmall}>Mobile Phone Number *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. +91 9435012345"
                placeholderTextColor="#94A3B8"
                value={phoneInput}
                onChangeText={setPhoneInput}
                keyboardType="phone-pad"
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabelSmall}>Official Email Address</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. pranjal.mr@reppulse.com"
                placeholderTextColor="#94A3B8"
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.inputLabelSmall}>Headquarter Station Base</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Silchar / Karimganj HQ"
                placeholderTextColor="#94A3B8"
                value={hqInput}
                onChangeText={setHqInput}
              />
            </View>

            <TouchableOpacity style={styles.saveContactBtn} onPress={handleSaveContact}>
              <Text style={styles.saveContactBtnText}>Save Contact Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  userName: { color: colors.textPrimary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.black },
  userRoleText: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 1 },
  userCode: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  territoryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  userTerritory: { color: '#1D4ED8', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginLeft: 2 },
  
  cardHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold },
  editContactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editContactPillText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  infoVal: { fontSize: 12, color: colors.textPrimary, fontWeight: '700', maxWidth: '60%', textAlign: 'right' },
  unsetText: { color: '#DC2626', fontStyle: 'italic', fontWeight: '600' },

  privacyDesc: { color: colors.textSecondary, fontSize: typography.fontSize.xs, lineHeight: 18, marginVertical: 2 },
  infoText: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginVertical: 2 },
  logoutBtn: { marginTop: spacing.lg },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  inputLabelSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  saveContactBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 6,
  },
  saveContactBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
