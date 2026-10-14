import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
  const [authMode, setAuthMode] = useState<'PIN' | 'OTP' | 'PASSWORD'>('PIN');
  
  // PIN Login State
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  
  // OTP 1st Time Login State
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtpHint, setGeneratedOtpHint] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  // Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Common States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Set / Change PIN Modal States
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [targetEmployeeForPin, setTargetEmployeeForPin] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);

  // Late Login Modal States
  const [lateModalVisible, setLateModalVisible] = useState(false);
  const [lateCurrentTime, setLateCurrentTime] = useState('');
  const [lateReason, setLateReason] = useState('Traffic & road maintenance on Hospital Road');
  const [managerPin, setManagerPin] = useState('');
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [showInPersonPin, setShowInPersonPin] = useState(false);




  const handlePinLogin = async (bypassCutoff = false) => {
    if (!employeeId.trim()) {
      setErrorMessage('Please enter your Employee ID or Registered Mobile Number.');
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
      setErrorMessage(res.error || 'Incorrect PIN or Employee ID. Please try again or use OTP.');
    }
  };

  const handleSendOtp = async () => {
    const cleanDigits = mobileNumber.trim().replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    const res = await AuthService.sendOtp(cleanDigits);
    setLoading(false);

    if (res.success && res.otp) {
      setOtpSent(true);
      setGeneratedOtpHint('');
      Alert.alert(
        'OTP Sent 📲',
        `A 6-digit verification code has been sent to +91 ${cleanDigits}. Please check your SMS messages and enter the code below.`,
        [{ text: 'OK' }]
      );
    } else {
      setErrorMessage(res.error || 'Failed to send OTP. Please check mobile number.');
    }
  };

  const handleVerifyOtp = async () => {
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    const res = await AuthService.verifyOtp(mobileNumber, enteredOtp);
    setLoading(false);

    if (res.success && res.user) {
      const user = res.user;
      setTargetEmployeeForPin(user.employeeCode);
      
      // If user has not set a custom PIN yet, prompt them to set their 4-digit PIN
      if (!res.hasSetPin) {
        setIsFirstTimeSetup(true);
        setPinModalVisible(true);
      } else {
        Alert.alert(
          'Login Successful ✅',
          `Welcome back, ${user.name} (${user.role === 'REGIONAL_MANAGER' ? 'RSM' : 'MR'}).`,
          [
            {
              text: 'Start Field Duty',
              onPress: () => onLoginSuccess(),
            },
          ]
        );
      }
    } else {
      setErrorMessage(res.error || 'Invalid OTP. Please check and try again.');
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

  const handleSavePin = async () => {
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      Alert.alert('Mismatch', 'New PIN and confirmation PIN do not match.');
      return;
    }

    const codeToUpdate = targetEmployeeForPin || employeeId || '0002';
    const success = await AuthService.setUserPin(codeToUpdate, newPinInput);

    if (success) {
      setPin(newPinInput);
      setPinModalVisible(false);
      setNewPinInput('');
      setConfirmPinInput('');

      if (isFirstTimeSetup) {
        setIsFirstTimeSetup(false);
        Alert.alert(
          'PIN Configured Successfully 🎉',
          'Your 4-digit Daily PIN is set! You can now use your Employee ID or Mobile Number with this PIN for daily login.',
          [
            {
              text: 'Enter Field Duty',
              onPress: () => onLoginSuccess(),
            },
          ]
        );
      } else {
        Alert.alert('PIN Updated ✅', 'Your daily 4-digit PIN has been saved successfully.');
      }
    } else {
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    }
  };

  // Auto-polling when waiting for RSM approval
  useEffect(() => {
    let interval: any = null;
    if (lateModalVisible && isWaitingForApproval) {
      interval = setInterval(async () => {
        const empCode = employeeId.trim() || '0002';
        const approval = await AuthService.getTodayLateApproval(empCode);
        if (approval && approval.isApproved) {
          setIsWaitingForApproval(false);
          setLateModalVisible(false);
          Alert.alert(
            'Late Login Approved ✅',
            `Authorized by ${approval.approvedBy} for reason: "${approval.reason}". Starting shift now!`
          );
          if (authMode === 'PIN') {
            handlePinLogin(true);
          } else {
            handlePasswordLogin(true);
          }
        }
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lateModalVisible, isWaitingForApproval, employeeId, authMode]);

  const handleRequestApproval = async () => {
    if (!lateReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a clear reason for late duty entry.');
      return;
    }
    setRequestingApproval(true);
    try {
      const code = employeeId.trim() || '0002';
      await AuthService.requestLateApproval(lateReason, {
        id: code,
        name: code === '0002' ? 'Pranjal Malakar' : `Employee ${code}`,
        employeeCode: code,
      });
      setIsWaitingForApproval(true);
      Alert.alert(
        'Request Sent to RSM 📨',
        `Your late login request has been submitted to Regional Sales Manager Bodrud Jaman Sadiol with reason: "${lateReason}".\n\nPlease wait for RSM approval.`
      );
    } catch (err) {
      Alert.alert('Submission Error', 'Failed to submit late request. Please try again.');
    } finally {
      setRequestingApproval(false);
    }
  };

  const handleCheckApprovalStatus = async () => {
    setRequestingApproval(true);
    const empCode = employeeId.trim() || '0002';
    const approval = await AuthService.getTodayLateApproval(empCode);
    setRequestingApproval(false);

    if (approval && approval.isApproved) {
      setIsWaitingForApproval(false);
      setLateModalVisible(false);
      Alert.alert(
        'Late Login Approved ✅',
        `Authorized by ${approval.approvedBy}. Starting field duty!`
      );
      if (authMode === 'PIN') {
        handlePinLogin(true);
      } else {
        handlePasswordLogin(true);
      }
    } else {
      Alert.alert(
        'Still Pending ⏳',
        'RSM Bodrud Jaman Sadiol has not approved the request yet. This screen will auto-refresh when approved.'
      );
    }
  };

  const handleVerifyManagerPin = async () => {
    if (!managerPin.trim()) {
      Alert.alert('PIN Required', 'Please enter Regional Sales Manager PIN.');
      return;
    }
    setRequestingApproval(true);
    const code = employeeId.trim() || '0002';
    const res = await AuthService.verifyManagerPin(managerPin, 'Manager In-Person Sign-off', {
      id: code,
      name: code === '0002' ? 'Pranjal Malakar' : `Employee ${code}`,
      employeeCode: code,
    });
    setRequestingApproval(false);

    if (res.success) {
      setLateModalVisible(false);
      setIsWaitingForApproval(false);
      Alert.alert(
        'Manager Override Verified ✅',
        'Authorized by Regional Sales Manager (Bodrud Jaman Sadiol). Starting shift now.',
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
            • Morning Login: <Text style={styles.dutyHighlight}>Before 10:30 AM</Text> (Late entry requires RSM approval)
          </Text>
          <Text style={styles.dutyWindowText}>
            • Evening Wrap-up: <Text style={styles.dutyHighlight}>11:59 PM (23:59)</Text> automatic shift logout
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          {/* 3 Modes Switcher: PIN vs OTP (1st Time) vs Password */}
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
                size={15}
                color={authMode === 'PIN' ? colors.primary : '#64748B'}
              />
              <Text style={[styles.modeBtnText, authMode === 'PIN' && styles.modeBtnTextActive]}>
                Daily PIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeBtn, authMode === 'OTP' && styles.modeBtnActive]}
              onPress={() => {
                setAuthMode('OTP');
                setErrorMessage('');
              }}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={15}
                color={authMode === 'OTP' ? colors.primary : '#64748B'}
              />
              <Text style={[styles.modeBtnText, authMode === 'OTP' && styles.modeBtnTextActive]}>
                OTP / 1st Time
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
                size={15}
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

          {/* MODE 1: DAILY PIN */}
          {authMode === 'PIN' && (
            <View>
              <Input
                label="Employee ID or Registered Mobile"
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="e.g. 0001 (RSM) or 0002 (MR)"
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
                <TouchableOpacity
                  onPress={() => {
                    setTargetEmployeeForPin(employeeId);
                    setIsFirstTimeSetup(false);
                    setPinModalVisible(true);
                  }}
                >
                  <Text style={styles.changePinLink}>⚙️ Set / Change PIN</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAuthMode('OTP')}>
                  <Text style={styles.otpSwitchLink}>📲 First time? Login via OTP</Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Sign In to Field Duty"
                onPress={() => handlePinLogin(false)}
                loading={loading}
                variant="primary"
              />
            </View>
          )}

          {/* MODE 2: MOBILE OTP (1ST TIME LOGIN & ACTIVATION) */}
          {authMode === 'OTP' && (
            <View>
              <Input
                label="Company Registered 10-Digit Mobile Number"
                value={mobileNumber}
                onChangeText={(val) => {
                  setMobileNumber(val.replace(/\D/g, '').slice(0, 10));
                  setOtpSent(false);
                }}
                placeholder="e.g. 9435000001 (RSM) or 9435000002 (MR)"
                keyboardType="phone-pad"
                maxLength={10}
              />

              {!otpSent ? (
                <View style={{ marginTop: spacing.sm }}>
                  <Button
                    title="Send Verification OTP"
                    onPress={handleSendOtp}
                    loading={loading}
                    variant="primary"
                  />
                  <Text style={styles.otpNoticeText}>
                    💡 Registered mobile number receives an instant 6-digit OTP code to verify identity and configure personal daily PIN.
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: spacing.xs }}>
                  <View style={styles.otpSentBanner}>
                    <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.otpSentBannerText}>
                        OTP sent to +91 {mobileNumber}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.inputLabelSmall}>Enter 6-Digit OTP</Text>
                  <View style={styles.pinInputWrap}>
                    <TextInput
                      style={styles.bigOtpInput}
                      value={enteredOtp}
                      onChangeText={(val) => {
                        const cleaned = val.replace(/\D/g, '').slice(0, 6);
                        setEnteredOtp(cleaned);
                      }}
                      placeholder="• • • • • •"
                      placeholderTextColor="#CBD5E1"
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  </View>

                  <Button
                    title="Verify OTP & Continue"
                    onPress={handleVerifyOtp}
                    loading={loading}
                    variant="primary"
                  />

                  <View style={styles.otpActionRow}>
                    <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                      <Text style={styles.resendOtpLink}>🔁 Resend Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOtpSent(false)}>
                      <Text style={styles.changePhoneLink}>✏️ Change Mobile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* MODE 3: PASSWORD */}
          {authMode === 'PASSWORD' && (
            <View>
              <Input
                label="Official Email or Employee ID"
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. 0001 or 0002"
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
      <Modal visible={pinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="keypad" size={22} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>
                  {isFirstTimeSetup ? 'Set Your Daily 4-Digit PIN' : 'Set / Update Daily PIN'}
                </Text>
              </View>
              {!isFirstTimeSetup && (
                <TouchableOpacity onPress={() => setPinModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.modalSubDescription}>
              {isFirstTimeSetup
                ? 'Welcome! Set a personal 4-digit numeric PIN for quick everyday login before 10:30 AM.'
                : `Set a new 4-digit daily PIN for Employee ${targetEmployeeForPin || employeeId}.`}
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.inputLabelSmall}>Enter New 4-Digit PIN</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. 1234"
                value={newPinInput}
                onChangeText={(v) => setNewPinInput(v.replace(/\D/g, '').slice(0, 4))}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.inputLabelSmall}>Confirm 4-Digit PIN</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Re-enter 4-digit PIN"
                value={confirmPinInput}
                onChangeText={(v) => setConfirmPinInput(v.replace(/\D/g, '').slice(0, 4))}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            <TouchableOpacity style={styles.savePinBtn} onPress={handleSavePin}>
              <Text style={styles.savePinBtnText}>Save & Proceed to Field Duty</Text>
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

            {isWaitingForApproval ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
                <View
                  style={{
                    backgroundColor: '#FEF3C7',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#F59E0B',
                    marginBottom: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <ActivityIndicator size="small" color="#D97706" />
                  <Text style={{ color: '#B45309', fontWeight: 'bold', fontSize: 13 }}>
                    Awaiting RSM Approval (Bodrud Sadiol)
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    borderRadius: radius.md,
                    padding: spacing.md,
                    marginBottom: spacing.md,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 2 }}>
                    SUBMITTED REASON:
                  </Text>
                  <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: '500' }}>
                    "{lateReason}"
                  </Text>
                  <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
                    Time Logged: {lateCurrentTime} • Auto-refreshing status...
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.requestApprovalBtn, { width: '100%', backgroundColor: '#0284C7' }]}
                  onPress={handleCheckApprovalStatus}
                  disabled={requestingApproval}
                >
                  <Text style={styles.requestApprovalBtnText}>
                    {requestingApproval ? 'Checking...' : '🔄 Check Approval Status'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginTop: spacing.sm, paddingVertical: 6 }}
                  onPress={() => setIsWaitingForApproval(false)}
                >
                  <Text style={{ color: '#64748B', fontSize: 12, textDecorationLine: 'underline' }}>
                    Edit Reason & Resubmit
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.lateNoticeBody}>
                  Standard morning attendance cut-off is <Text style={{ fontWeight: 'bold' }}>10:30 AM</Text>. Company policy requires explicit permission with a valid reason from Regional Sales Manager (Bodrud Jaman Sadiol) to commence field operations.
                </Text>

                {/* Quick Reason Pills */}
                <Text style={styles.inputSectionLabel}>Select or Enter Reason for Late Duty:</Text>
                <View style={styles.reasonPillRow}>
                  {['Traffic / Route Block', 'Doctor Morning OPD', 'Stockist Urgent Order', 'Barak Bridge Delay'].map((r) => (
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
                  placeholder="Explain delay reason for RSM record..."
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
                    {requestingApproval ? 'Submitting...' : '📨 Request RSM Approval (Bodrud Sadiol)'}
                  </Text>
                </TouchableOpacity>

                {/* In-Person RSM Override Toggle */}
                <TouchableOpacity
                  style={{ alignItems: 'center', marginTop: spacing.md, paddingVertical: 4 }}
                  onPress={() => setShowInPersonPin(!showInPersonPin)}
                >
                  <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>
                    {showInPersonPin ? '▲ Hide RSM In-Person Sign-off' : '▼ RSM Physically Present? In-Person Sign-off'}
                  </Text>
                </TouchableOpacity>

                {showInPersonPin && (
                  <View style={{ marginTop: spacing.xs }}>
                    <Text style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>
                      Regional Manager (Bodrud Jaman Sadiol) Personal Authorization PIN:
                    </Text>
                    <View style={styles.pinRow}>
                      <TextInput
                        style={styles.pinInput}
                        placeholder="RSM Personal PIN"
                        placeholderTextColor="#94A3B8"
                        value={managerPin}
                        onChangeText={setManagerPin}
                        keyboardType="numeric"
                        secureTextEntry
                        maxLength={8}
                      />
                      <TouchableOpacity
                        style={styles.pinSubmitBtn}
                        onPress={handleVerifyManagerPin}
                        disabled={requestingApproval}
                      >
                        <Text style={styles.pinSubmitBtnText}>Authorize</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => {
                setLateModalVisible(false);
                setIsWaitingForApproval(false);
              }}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, justifyContent: 'center', minHeight: '100%' },
  brandContainer: { alignItems: 'center', marginBottom: spacing.md },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  logoText: { fontSize: 28 },
  appTitle: {
    color: '#0F172A',
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.black,
    letterSpacing: -0.5,
  },
  appTagline: {
    color: '#64748B',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
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
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
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
    marginBottom: spacing.md,
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
    marginBottom: spacing.md,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  modeBtnActive: {
    backgroundColor: '#FFFFFF',
    ...shadows.sm,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modeBtnTextActive: {
    color: colors.primary,
  },

  // PIN Input Styles
  pinInputWrap: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  bigPinInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    width: 180,
    height: 52,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 16,
    color: colors.textPrimary,
  },
  bigOtpInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    width: 220,
    height: 52,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 10,
    color: colors.textPrimary,
  },
  pinHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  changePinLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  otpSwitchLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },

  // OTP Mode Styles
  otpNoticeText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  otpSentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: 8,
  },
  otpSentBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  otpCodeHint: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
  },
  otpActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: 6,
  },
  resendOtpLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  changePhoneLink: {
    fontSize: 12,
    fontWeight: '600',
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
});
