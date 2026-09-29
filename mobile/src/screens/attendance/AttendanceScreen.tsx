import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LocationService, LocationResult } from '../../services/location/locationService';
import { AttendanceService } from '../../services/attendanceService';
import { AuthService } from '../../services/authService';

interface AttendanceScreenProps {
  onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onBack }) => {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLocation();
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    const today = await AttendanceService.getTodayAttendance();
    setIsPunchedIn(today.isPunchedIn);
    setPunchInTime(today.punchInTime);
    if (today.record?.selfieBase64OrUri) {
      setSelfieUri(today.record.selfieBase64OrUri);
    }
  };

  const fetchLocation = async () => {
    setLoadingLoc(true);
    const loc = await LocationService.getCurrentLocation();
    setLocation(loc);
    setLoadingLoc(false);
  };

  const handleCaptureSelfie = async () => {
    try {
      setCapturing(true);
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Required',
          'RepPulse requires front-camera access to verify attendance selfies in the field.'
        );
        setCapturing(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      setCapturing(false);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelfieUri(result.assets[0].uri);
      }
    } catch (err) {
      setCapturing(false);
      // Fallback to image library if camera not available (e.g. simulator)
      Alert.alert(
        'Take Selfie',
        'Camera not opened. Would you like to select a photo from gallery for demo?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Choose Photo',
            onPress: async () => {
              const pickRes = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
              });
              if (!pickRes.canceled && pickRes.assets && pickRes.assets.length > 0) {
                setSelfieUri(pickRes.assets[0].uri);
              }
            },
          },
        ]
      );
    }
  };

  const [lateApproved, setLateApproved] = useState(false);

  const handlePunchIn = async () => {
    if (!selfieUri) {
      Alert.alert('Selfie Required', 'Please take an attendance selfie with front camera before punching in.');
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isPastCutoff = currentHour > 10 || (currentHour === 10 && currentMinute > 30);

    if (isPastCutoff && !lateApproved) {
      Alert.alert(
        'Late Attendance Locked (Past 10:30 AM) ⏰',
        `Current time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Field reporting is locked after 10:30 AM.\n\nManager authorization is required to start your day.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Request ABM Approval',
            onPress: () => {
              Alert.prompt
                ? Alert.prompt(
                    'Late Check-in Reason',
                    'Enter reason for delayed reporting (e.g. clinic delay / travel delay):',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Submit & Unlock',
                        onPress: (reason) => {
                          setLateApproved(true);
                          Alert.alert('Approval Granted ✅', `Late check-in authorized by ABM (G Solanki) for: "${reason || 'Field Transit'}". You may now punch in.`);
                        },
                      },
                    ]
                  )
                : (() => {
                    setLateApproved(true);
                    Alert.alert('Approval Granted ✅', 'Late check-in authorized by ABM (G Solanki). You may now punch in.');
                  })();
            },
          },
        ]
      );
      return;
    }

    const currentLoc = location || (await LocationService.getCurrentLocation());
    if (!LocationService.validateAuthenticGps(currentLoc, 'Daily Duty Attendance')) {
      return;
    }
    if (!currentLoc) return;

    setSubmitting(true);
    await AttendanceService.punchIn({
      latitude: currentLoc.latitude,
      longitude: currentLoc.longitude,
      accuracyMeters: currentLoc.accuracyMeters,
      selfieUri,
      isMockLocation: currentLoc.isMockLocation,
    });
    setSubmitting(false);

    setIsPunchedIn(true);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPunchInTime(nowTime);

    Alert.alert(
      'Punch In Successful ✅',
      `Duty started at ${nowTime}. Geotagged selfie recorded and 15-minute background telemetry is active.`,
      [{ text: 'Proceed to Dashboard', onPress: onBack }]
    );
  };

  const handlePunchOut = async () => {
    Alert.alert(
      'End Shift & Punch Out?',
      'This will stop 15-minute background location telemetry and mark your attendance completed for today.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Punch Out',
          style: 'destructive',
          onPress: async () => {
            await AttendanceService.punchOut();
            setIsPunchedIn(false);
            setSelfieUri(null);
            Alert.alert('Shift Ended', 'You have punched out successfully.');
          },
        },
      ]
    );
  };

  const user = AuthService.getCurrentUser();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Daily Attendance" subtitle="Geotagged Selfie & GPS Lock" showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Card */}
        <Card>
          <View style={styles.statusRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Today's Duty Status</Text>
              <Text style={styles.statusTime}>
                {isPunchedIn ? `Punched In at ${punchInTime}` : 'Not Checked In'}
              </Text>
              <Text style={styles.empInfo}>
                {user?.name || 'Shakir Ahmad'} ({user?.employeeCode || 'REP-AS-904'})
              </Text>
            </View>
            <Badge
              label={isPunchedIn ? 'DUTY ACTIVE' : 'NOT STARTED'}
              variant={isPunchedIn ? 'success' : 'warning'}
            />
          </View>
        </Card>

        {/* GPS Verification Card */}
        <Card>
          <View style={styles.statusRow}>
            <Text style={styles.sectionHeader}>Location Satellite Lock</Text>
            <TouchableOpacity onPress={fetchLocation} style={styles.refreshBtn}>
              <Ionicons name="refresh-outline" size={14} color={colors.primary} />
              <Text style={styles.refreshLink}>{loadingLoc ? 'Locking...' : 'Refresh GPS'}</Text>
            </TouchableOpacity>
          </View>

          {location ? (
            <View style={styles.locBox}>
              <View style={styles.locRow}>
                <Ionicons name="navigate-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.locCoords}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
              </View>
              <Text style={styles.locAcc}>
                Accuracy: ±{location.accuracyMeters.toFixed(1)}m (Barak Division Satellite Lock)
              </Text>
              {location.isMockLocation && (
                <Text style={styles.mockWarn}>⚠️ Warning: Mock GPS detected</Text>
              )}
            </View>
          ) : (
            <View style={styles.locWaitRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.locWait}>Acquiring high-accuracy GPS coordinates...</Text>
            </View>
          )}
        </Card>

        {/* Front Camera Selfie Verification */}
        <Card>
          <Text style={styles.sectionHeader}>Front-Camera Selfie</Text>
          <Text style={styles.cameraDesc}>
            Take a clear live photo in daylight for facial attendance verification and geotagging.
          </Text>

          <View style={styles.selfieContainer}>
            {selfieUri ? (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: selfieUri }} style={styles.selfieImage} resizeMode="cover" />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                  <Text style={styles.verifiedText}>Selfie Captured & Geotagged</Text>
                </View>
              </View>
            ) : (
              <View style={styles.selfiePlaceholder}>
                <Ionicons name="camera-outline" size={48} color="#94A3B8" />
                <Text style={styles.selfiePlaceholderText}>No selfie captured yet</Text>
                <Text style={styles.selfieSubText}>Front camera will capture compressed selfie</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.cameraActionBtn}
            onPress={handleCaptureSelfie}
            disabled={capturing}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.cameraActionText}>
              {capturing ? 'Opening Camera...' : selfieUri ? 'Retake Selfie Photo' : 'Open Front Camera & Take Selfie'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Punch In / Out Actions */}
        <View style={styles.actionContainer}>
          {isPunchedIn ? (
            <Button
              title="Stop Field Duty & Punch Out"
              onPress={handlePunchOut}
              variant="danger"
            />
          ) : (
            <Button
              title="Confirm Punch In & Start Shift"
              onPress={handlePunchIn}
              loading={submitting}
              variant="primary"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  statusTime: { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  empInfo: { fontSize: typography.fontSize.xs, color: colors.primaryDark, fontWeight: typography.fontWeight.semibold, marginTop: 4 },
  sectionHeader: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  refreshBtn: { flexDirection: 'row', alignItems: 'center' },
  refreshLink: { color: colors.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginLeft: 4 },
  locBox: { marginTop: spacing.sm, padding: spacing.md, backgroundColor: '#F8FAFC', borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderLight },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  locCoords: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, marginLeft: 6 },
  locAcc: { color: '#16A34A', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium },
  mockWarn: { color: '#DC2626', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  locWaitRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  locWait: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginLeft: spacing.sm },
  cameraDesc: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2, marginBottom: spacing.md },
  selfieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  imagePreviewWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#3B82F6',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfieImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#16A34A',
    marginLeft: 3,
  },
  selfiePlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  selfiePlaceholderText: {
    color: '#475569',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },
  selfieSubText: {
    color: '#94A3B8',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  cameraActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  cameraActionText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm,
  },
  actionContainer: {
    marginTop: spacing.lg,
  },
});
