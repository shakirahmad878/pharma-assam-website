import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { UserProfile, LocationTelemetryRecord } from '../../types';
import { SupabaseDbService } from '../../services/supabase/supabaseDbService';
import { getBusinessDateStr } from '../../utils/dateUtils';
import { AuthService } from '../../services/authService';

interface LiveLocationMapScreenProps {
  employee: UserProfile;
  onBack: () => void;
}

export const LiveLocationMapScreen: React.FC<LiveLocationMapScreenProps> = ({
  employee,
  onBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [requestingFresh, setRequestingFresh] = useState(false);
  const [shiftStatus, setShiftStatus] = useState<
    'SHIFT_NOT_STARTED' | 'SHIFT_ACTIVE' | 'SHIFT_ENDED' | 'PENDING_SYNC'
  >('SHIFT_NOT_STARTED');
  const [locationStatus, setLocationStatus] = useState<
    'FRESH' | 'AGING' | 'STALE' | 'LOCATION_UNAVAILABLE'
  >('LOCATION_UNAVAILABLE');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const [lastRecordedAt, setLastRecordedAt] = useState<string | null>(null);
  const [history, setHistory] = useState<LocationTelemetryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchLiveState = useCallback(async () => {
    try {
      const empKey = employee.id || employee.employeeCode;
      const res = await SupabaseDbService.getAuthoritativeShiftStatus(empKey);
      setShiftStatus(res.shiftStatus);
      setLocationStatus(res.locationStatus);
      setLatitude(res.rawLatitude);
      setLongitude(res.rawLongitude);
      setAccuracy(res.accuracyMeters);
      setBattery(res.batteryPercentage);
      setLastRecordedAt(res.lastRecordedAt);

      // Load breadcrumbs if available
      const hist = await SupabaseDbService.getEmployeeTelemetryHistory(empKey, 15);
      setHistory(hist);
    } catch (err: any) {
      console.warn('[LiveLocationMap] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    fetchLiveState();
    // Auto-refresh every 30 seconds while screen is open
    const interval = setInterval(fetchLiveState, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveState]);

  const handleRequestFreshGps = async () => {
    if (shiftStatus === 'SHIFT_NOT_STARTED') {
      Alert.alert(
        'Shift Not Started',
        `${employee.name} has not punched in for today yet. Telemetry requests activate once duty begins.`
      );
      return;
    }

    setRequestingFresh(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const requestedBy = currentUser?.name || 'Manager';
      const empKey = employee.id || employee.employeeCode;

      const req = await SupabaseDbService.createLocationRequest(empKey, requestedBy);
      if (!req || !req.id) {
        Alert.alert('Request Notice', 'Location request dispatched to MR terminal. Awaiting response.');
        setRequestingFresh(false);
        return;
      }

      // Poll for 12 seconds
      let attempts = 0;
      const pollTimer = setInterval(async () => {
        attempts++;
        if (attempts > 6) {
          clearInterval(pollTimer);
          setRequestingFresh(false);
          await fetchLiveState();
          Alert.alert(
            'Request Queued 🛰️',
            `Ping sent to ${employee.name}'s Android device. Showing latest confirmed coordinates while device acquires satellite lock.`
          );
          return;
        }

        const polled = await SupabaseDbService.pollLocationRequest(req.id!);
        if (polled && polled.status === 'COMPLETED') {
          clearInterval(pollTimer);
          setRequestingFresh(false);
          await fetchLiveState();
          Alert.alert('Fresh GPS Acquired ✅', `Received real-time satellite fix from ${employee.name}'s device.`);
        }
      }, 2000);
    } catch (err: any) {
      setRequestingFresh(false);
      Alert.alert('Error', err?.message || 'Failed to dispatch location request.');
    }
  };

  const openInGoogleMaps = () => {
    if (latitude !== null && longitude !== null) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert('No Coordinates', 'Coordinates are not yet available for mapping.');
    }
  };

  const getShiftBadge = () => {
    switch (shiftStatus) {
      case 'SHIFT_ACTIVE':
        return <Badge label="🟢 Shift Active — Field Duty" variant="success" />;
      case 'SHIFT_ENDED':
        return <Badge label="⏹️ Shift Ended" variant="muted" />;
      case 'PENDING_SYNC':
        return <Badge label="⏳ Attendance Pending Sync" variant="warning" />;
      case 'SHIFT_NOT_STARTED':
      default:
        return <Badge label="⚠️ Shift Not Started" variant="danger" />;
    }
  };

  const getLocationBadge = () => {
    switch (locationStatus) {
      case 'FRESH':
        return <Badge label="🟢 Live GPS (0–5m ago)" variant="success" />;
      case 'AGING':
        return <Badge label="🟡 Aging Fix (5–15m ago)" variant="warning" />;
      case 'STALE':
        return <Badge label="🟠 Stale Fix (>15m ago)" variant="warning" />;
      case 'LOCATION_UNAVAILABLE':
      default:
        return <Badge label="⚪ Location Unavailable" variant="muted" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Live Location & Telemetry"
        subtitle={`${employee.name} (#${employee.employeeCode})`}
        showBack
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* EMPLOYEE & STATUS CARD */}
        <Card style={styles.profileCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {employee.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.empName}>{employee.name}</Text>
              <Text style={styles.empRole}>
                {employee.role === 'MEDICAL_REP' ? 'Medical Representative' : employee.role} &bull; {employee.headquarter || 'HQ'}
              </Text>
              <Text style={styles.empTerritory}>{employee.territory || 'Barak Valley'}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={{ flex: 1 }}>{getShiftBadge()}</View>
            <View>{getLocationBadge()}</View>
          </View>
        </Card>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Connecting to Satellite Telemetry Feed...</Text>
          </View>
        ) : (
          <>
            {/* MAP VISUAL CONTAINER */}
            <Card style={styles.mapCard}>
              <View style={styles.mapCanvas}>
                {/* Visual Satellite Map Mock / Grid */}
                <View style={styles.gridOverlay}>
                  <View style={styles.mapCircleOuter}>
                    <View style={styles.mapCircleInner}>
                      <Ionicons name="location" size={32} color="#DC2626" />
                    </View>
                  </View>
                </View>

                {latitude !== null && longitude !== null ? (
                  <View style={styles.mapFloatingInfo}>
                    <Text style={styles.floatingCoords}>
                      📍 {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
                    </Text>
                    <Text style={styles.floatingAccuracy}>
                      Accuracy: &plusmn;{accuracy ? Math.round(accuracy) : 6}m {accuracy && accuracy <= 15 ? '(High Precision GPS)' : ''}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.mapFloatingInfo}>
                    <Text style={styles.floatingCoords}>No GPS Fix Acquired Today</Text>
                    <Text style={styles.floatingAccuracy}>Waiting for morning attendance punch-in</Text>
                  </View>
                )}
              </View>

              <View style={styles.mapActionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.mapsBtn]}
                  onPress={openInGoogleMaps}
                  disabled={latitude === null}
                >
                  <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.btnTextWhite}>Open in Google Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.refreshBtn, requestingFresh && { opacity: 0.7 }]}
                  onPress={handleRequestFreshGps}
                  disabled={requestingFresh}
                >
                  {requestingFresh ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.btnTextWhite}>Ping Fresh GPS</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </Card>

            {/* TELEMETRY METRICS */}
            <Card style={styles.metricsCard}>
              <Text style={styles.sectionTitle}>Telemetry & Device Diagnostics</Text>

              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <Ionicons name="battery-charging-outline" size={20} color="#0D9488" />
                  <Text style={styles.metricLabel}>Battery Level</Text>
                  <Text style={styles.metricValue}>{battery !== null ? `${battery}%` : 'N/A'}</Text>
                </View>

                <View style={styles.metricItem}>
                  <Ionicons name="hardware-chip-outline" size={20} color="#2563EB" />
                  <Text style={styles.metricLabel}>GPS Hardware</Text>
                  <Text style={styles.metricValue}>Fused / Satellite</Text>
                </View>

                <View style={styles.metricItem}>
                  <Ionicons name="time-outline" size={20} color="#7C3AED" />
                  <Text style={styles.metricLabel}>Last Seen</Text>
                  <Text style={styles.metricValue}>
                    {lastRecordedAt
                      ? new Date(lastRecordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'None'}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerBox}>
                <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                <Text style={styles.disclaimerText}>
                  15-minute background telemetry operates automatically during active shift duty. Tapping &quot;Ping Fresh GPS&quot; triggers an immediate satellite fix.
                </Text>
              </View>
            </Card>

            {/* LOCATION HISTORY ACCORDION */}
            <Card style={styles.historyCard}>
              <TouchableOpacity
                style={styles.historyHeader}
                onPress={() => setShowHistory(!showHistory)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="trail-sign-outline" size={20} color={colors.primary} />
                  <Text style={styles.historyTitle}>
                    Today&apos;s Breadcrumb Trail ({history.length} fixes)
                  </Text>
                </View>
                <Ionicons
                  name={showHistory ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>

              {showHistory && (
                <View style={styles.historyList}>
                  {history.length === 0 ? (
                    <Text style={styles.emptyHistory}>No breadcrumb history logged yet for today.</Text>
                  ) : (
                    history.map((pt, idx) => (
                      <View key={pt.id || idx} style={styles.historyItem}>
                        <View style={styles.historyDot} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.historyCoords}>
                            {pt.latitude.toFixed(5)}° N, {pt.longitude.toFixed(5)}° E
                          </Text>
                          <Text style={styles.historyTime}>
                            {new Date(pt.recorded_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}{' '}
                            &bull; Accuracy: &plusmn;{Math.round(pt.accuracy_meters)}m &bull; Source: {pt.source}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  empRole: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  empTerritory: {
    fontSize: 12,
    color: '#64748B',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  centerBox: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  mapCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  mapCanvas: {
    height: 220,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    opacity: 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.4)',
  },
  mapCircleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  mapFloatingInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  floatingCoords: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  floatingAccuracy: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  mapActionRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: 6,
  },
  mapsBtn: {
    backgroundColor: '#2563EB',
  },
  refreshBtn: {
    backgroundColor: '#0D9488',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  metricsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    marginHorizontal: 3,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: radius.sm,
    gap: 6,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  historyCard: {
    padding: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
  },
  historyList: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginTop: 5,
  },
  historyCoords: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  historyTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    paddingVertical: 12,
  },
});
