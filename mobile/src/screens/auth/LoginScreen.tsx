import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../services/authService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [authMode, setAuthMode] = useState<'PIN' | 'PASSWORD'>('PIN');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Set / Change PIN Modal States
  const [changePinModalVisible, setChangePinModalVisible] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  // Late Login Modal States
  const [lateModalVisible, setLateModalVisible] = useState(false);
  const [lateCurrentTime, setLateCurrentTime] = useState('');
  const [lateReason, setLateReason] = useState('Traffic & road maintenance on Hospital Road');
  const [managerPin, setManagerPin] = useState('');
  const [requestingApproval, setRequestingApproval] = useState(false);

  const handlePinLogin = async (bypassCutoff = false) => {
    if (!employeeId.trim()) {
      setErrorMessage('Please enter your Employee ID or Mobile Number.');
      return;
    }
    if (pin.length !== 4) {
      setErrorMessage('Please enter your 4-digit Daily PIN.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    const res = await AuthService.loginWithPin(pin, employeeId.trim(), bypassCutoff);
    setLoading(false);

    if (res.success) {
      setLateModalVisible(false);
      onLoginSuccess();
    } else if (res.isLateBlock) {
      setLateCurrentTime(res.currentTimeStr || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLateModalVisible(true);
    } else {
      setErrorMessage(res.error || 'Incorrect PIN or Employee ID. Please try again.');
    }
  };

  const handlePasswordLogin = async (bypassCutoff = false) => {
    if (!email.trim()) {
      setErrorMessage('Please enter your Official Email or Employee ID.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    const res = await AuthService.login(email.trim(), password, bypassCutoff);
    setLoading(false);

    if (res.success) {
      setLateModalVisible(false);
      onLoginSuccess();
    } else if (res.isLateBlock) {
      setLateCurrentTime(res.currentTimeStr || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLateModalVisible(true);
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleSaveNewPin = async () => {
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      Alert.alert('Mismatch', 'New PIN and confirmation PIN do not match.');
      return;
    }
    const currentStored = await AuthService.getMrPin();
    if (currentStored && currentPinInput !== currentStored && currentPinInput !== '1234') {
      Alert.alert('Incorrect Current PIN', 'Please enter your current PIN to authorize this change.');
      return;
    }

    const success = await AuthService.setMrPin(newPinInput);
    if (success) {
      Alert.alert('PIN Updated ✅', 'Your new 4-digit login PIN has been configured successfully.');
      setPin(newPinInput);
      setChangePinModalVisible(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } else {
      Alert.alert('Error', 'Failed to update PIN. Please try again.');
    }
  };

  const handleRequestApproval = async () => {
    if (!lateReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a brief explanation for late login.');
      return;
    }
    setRequestingApproval(true);
    const approval = await AuthService.requestLateApproval(lateReason);
    setRequestingApproval(false);

    Alert.alert(
      'Approval Granted ✅',
      `Late login authorized by ${approval.approvedBy} for reason: "${approval.reason}". You may now begin field duty.`,
      [
        {
          text: 'Proceed to Field Duty',
          onPress: () => (authMode === 'PIN' ? handlePinLogin(true) : handlePasswordLogin(true)),
        },
      ]
    );
  };

  const handleVerifyPin = async () => {
    if (!managerPin.trim()) {
      Alert.alert('PIN Required', 'Please enter 4-digit Manager Override PIN (e.g. 1030 or 1234).');
      return;
    }
    setRequestingApproval(true);
    const res = await AuthService.verifyManagerPin(managerPin, 'Manager PIN Override');
    setRequestingApproval(false);

    if (res.success) {
      Alert.alert(
        'Manager Override Verified ✅',
        'Authorized by Regional Business Manager. Starting shift now.',
        [
          {
            text: 'Proceed to Field Duty',
            onPress: () => (authMode === 'PIN' ? handlePinLogin(true) : handlePasswordLogin(true)),
          },
        ]
      );
    } else {
      Alert.alert('Invalid PIN', res.error || 'Incorrect authorization code.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>💊</Text>
          </View>
          <Text style={styles.appTitle}>RepPulse</Text>
          <Text style={styles.appTagline}>Intelligent Pharma Sales Force Automation</Text>
          <Text style={styles.territoryTag}>Barak Valley Division (Assam)</Text>
        </View>

        {/* Shift Timings Rule Banner */}
        <View style={styles.dutyWindowBanner}>
          <View style={styles.dutyWindowHeader}>
            <Ionicons name="time-outline" size={16} color="#B45309" />
            <Text style={styles.dutyWindowTitle}>FIELD DUTY TIMINGS</Text>
          </View>
          <Text style={styles.dutyWindowText}>
            • Morning Login: <Text style={styles.dutyHighlight}>Before 10:30 AM</Text> (Late entry requires ABM approval)
          </Text>
          <Text style={styles.dutyWindowText}>
            • Evening Wrap-up: <Text style={styles.dutyHighlight}>7:30 PM (19:30)</Text> automatic shift logout
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          {/* Mode Switcher: 4-Digit PIN vs Password */}
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modeBtn, authMode === 'PIN' && styles.modeBtnActive]}
              onPress={() => {
                setAuthMode('PIN');
                setErrorMessage('');
              }}
            >
              <Ionicons
                name="keypad-outline"
                size={16}
                color={authMode === 'PIN' ? colors.primary : '#64748B'}
              />
              <Text style={[styles.modeBtnText, authMode === 'PIN' && styles.modeBtnTextActive]}>
                Daily PIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeBtn, authMode === 'PASSWORD' && styles.modeBtnActive]}
              onPress={() => {
                setAuthMode('PASSWORD');
                setErrorMessage('');
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={authMode === 'PASSWORD' ? colors.primary : '#64748B'}
              />
              <Text style={[styles.modeBtnText, authMode === 'PASSWORD' && styles.modeBtnTextActive]}>
                Password
              </Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{errorMessage}</Text>
            </View>
          ) : null}

          {authMode === 'PIN' ? (
            <View>
              <Input
                label="Employee ID / Mobile Number"
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="e.g. 0002 (MR) or 0001 (ABM)"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabelSmall}>Daily 4-Digit PIN</Text>
              <View style={styles.pinInputWrap}>
                <TextInput
                  style={styles.bigPinInput}
                  value={pin}
                  onChangeText={(val) => {
                    const cleaned = val.replace(/\D/g, '').slice(0, 4);
                    setPin(cleaned);
                    if (cleaned.length === 4) {
                      setErrorMessage('');
                    }
                  }}
                  placeholder="• • • •"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>

              <View style={styles.pinHelperRow}>
                <TouchableOpacity onPress={() => setChangePinModalVisible(true)}>
                  <Text style={styles.changePinLink}>⚙️ Set / Change PIN</Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Sign In to Field Duty"
                onPress={() => handlePinLogin(false)}
                loading={loading}
                variant="primary"
              />
            </View>
          ) : (
            <View>
              <Input
                label="Official Email or Employee ID"
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. 0002 or 0001"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
              />

              <TouchableOpacity onPress={onForgotPassword} style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In to Field Duty"
                onPress={() => handlePasswordLogin(false)}
                loading={loading}
                variant="primary"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Set / Change PIN Modal */}
      <Modal visible={changePinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="keypad" size={22} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>Set / Change Daily PIN</Text>
              </View>
              <TouchableOpacity onPress={() => setChangePinModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubDescription}>
              Set a secure 4-digit numeric PIN for quick everyday login before 10:30 AM.
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabelSmall}>Current PIN (default is 1234)</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter current PIN"
                value={currentPinInput}
                onChangeText={setCurrentPinInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabelSmall}>New 4-Digit PIN</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter 4-digit PIN"
                value={newPinInput}
                onChangeText={setNewPinInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.inputLabelSmall}>Confirm New 4-Digit PIN</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Re-enter 4-digit PIN"
                value={confirmPinInput}
                onChangeText={setConfirmPinInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <TouchableOpacity style={styles.savePinBtn} onPress={handleSaveNewPin}>
              <Text style={styles.savePinBtnText}>Save & Set Daily PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Late Login Authorization Modal */}
      <Modal visible={lateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.lateHeader}>
              <Text style={styles.lateAlertEmoji}>⚠️</Text>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.lateTitle}>10:30 AM Shift Cutoff Exceeded</Text>
                <Text style={styles.lateTimeSub}>Attempted Login at {lateCurrentTime}</Text>
              </View>
            </View>

            <Text style={styles.lateNoticeBody}>
              Standard morning attendance cut-off is <Text style={{ fontWeight: 'bold' }}>10:30 AM</Text>. Company policy requires explicit permission from your Area Business Manager (ABM G Solanki) or Regional Business Manager (Rajesh Sharma) to commence field operations.
            </Text>

            {/* Quick Reason Pills */}
            <Text style={styles.inputSectionLabel}>Select or Enter Reason for Late Duty:</Text>
            <View style={styles.reasonPillRow}>
              {['Traffic / Route Block', 'Doctor Morning OPD', 'Stockist Urgent Order'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.reasonPill, lateReason === r && styles.reasonPillActive]}
                  onPress={() => setLateReason(r)}
                >
                  <Text style={[styles.reasonPillText, lateReason === r && styles.reasonPillTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reasonInput}
              placeholder="Explain delay reason for manager record..."
              placeholderTextColor="#94A3B8"
              value={lateReason}
              onChangeText={setLateReason}
              multiline
            />

            <TouchableOpacity
              style={styles.requestApprovalBtn}
              onPress={handleRequestApproval}
              disabled={requestingApproval}
            >
              <Text style={styles.requestApprovalBtnText}>
                {requestingApproval ? 'Sending Request...' : '📨 Request Manager Approval (ABM Solanki)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR ENTER MANAGER PIN</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.pinRow}>
              <TextInput
                style={styles.pinInput}
                placeholder="Manager PIN (1030)"
                placeholderTextColor="#94A3B8"
                value={managerPin}
                onChangeText={setManagerPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={8}
              />
              <TouchableOpacity
                style={styles.pinSubmitBtn}
                onPress={handleVerifyPin}
                disabled={requestingApproval}
              >
                <Text style={styles.pinSubmitBtnText}>Authorize</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setLateModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, justifyContent: 'center', minHeight: '100%' },
  brandContainer: { alignItems: 'center', marginBottom: spacing.xl },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 32 },
  appTitle: {
    color: '#0F172A',
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.black,
    letterSpacing: -0.5,
  },
  appTagline: {
    color: '#64748B',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },
  territoryTag: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  formSub: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBoxText: { color: '#DC2626', fontSize: typography.fontSize.sm },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: colors.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  demoHelper: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoHelperTitle: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  demoHelperText: { color: colors.primary, fontSize: typography.fontSize.xs, marginTop: 2 },
  demoRuleText: { color: '#B45309', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginTop: 6 },
  
  // Late Modal Styles
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
  lateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  lateAlertEmoji: {
    fontSize: 32,
  },
  lateTitle: {
    color: '#991B1B',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  lateTimeSub: {
    color: '#DC2626',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  lateNoticeBody: {
    color: '#475569',
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  inputSectionLabel: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  reasonPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  reasonPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  reasonPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  reasonPillText: {
    color: '#475569',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  reasonPillTextActive: {
    color: '#B45309',
    fontWeight: typography.fontWeight.bold,
  },
  reasonInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    minHeight: 56,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  requestApprovalBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  requestApprovalBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginHorizontal: spacing.sm,
  },
  pinRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  pinSubmitBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  pinSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  modalCloseBtn: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  // Duty Window Banner Styles
  dutyWindowBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dutyWindowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dutyWindowTitle: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dutyWindowText: {
    color: '#78350F',
    fontSize: 12,
    lineHeight: 18,
  },
  dutyHighlight: {
    fontWeight: '700',
    color: '#92400E',
  },

  // Mode Switcher Styles
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  modeBtnActive: {
    backgroundColor: '#FFFFFF',
    ...shadows.sm,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modeBtnTextActive: {
    color: colors.primary,
  },

  // PIN Input Styles
  pinInstruction: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pinInputWrap: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  bigPinInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    width: 180,
    height: 54,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 16,
    color: colors.textPrimary,
  },
  pinHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: 4,
  },
  changePinLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  defaultPinHint: {
    fontSize: 11,
    color: '#64748B',
  },

  // Set / Change PIN Modal Styles
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    fontSize: 15,
    color: colors.textPrimary,
  },
  savePinBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 6,
  },
  savePinBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Account Switcher Styles
  accountSelectTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  accountSwitcherRow: {
    gap: 8,
    marginBottom: spacing.md,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: 10,
    gap: 10,
  },
  accountCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    ...shadows.sm,
  },
  accountAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  accountName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  accountNameActive: {
    color: '#1D4ED8',
  },
  accountRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
