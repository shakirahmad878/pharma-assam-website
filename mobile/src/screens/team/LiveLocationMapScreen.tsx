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
  TextInput,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { UserProfile, LocationTelemetryRecord } from '../../types';
import { SupabaseDbService, FleetLiveLocationItem } from '../../services/supabase/supabaseDbService';
import { AuthService } from '../../services/authService';
import { LocationService } from '../../services/location/locationService';
import {
  calculateHaversineDistanceKm,
  getCardinalDirection,
  determineLocationFreshness,
  LocationFreshness,
} from '../../utils/geoUtils';

interface LiveLocationMapScreenProps {
  employee?: UserProfile | null;
  teamEmployees?: UserProfile[];
  onBack: () => void;
}

export const LiveLocationMapScreen: React.FC<LiveLocationMapScreenProps> = ({
  employee: initialEmployee,
  teamEmployees = [],
  onBack,
}) => {
  // Navigation & View Mode
  const [selectedEmp, setSelectedEmp] = useState<UserProfile | null>(initialEmployee || null);
  const [viewMode, setViewMode] = useState<'FLEET' | 'DETAIL'>(initialEmployee ? 'DETAIL' : 'FLEET');

  // Loading States
  const [loadingFleet, setLoadingFleet] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [requestingFresh, setRequestingFresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Manager Device Location (for Great-Circle Haversine distance)
  const [managerLocation, setManagerLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Fleet Telemetry Data
  const [fleetLocations, setFleetLocations] = useState<FleetLiveLocationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'ACTIVE' | 'OFFLINE'>('ALL');

  // Detail Mode State
  const [singleTelemetry, setSingleTelemetry] = useState<{
    shiftStatus: 'SHIFT_NOT_STARTED' | 'SHIFT_ACTIVE' | 'SHIFT_ENDED' | 'PENDING_SYNC';
    locationStatus: LocationFreshness | 'LOCATION_UNAVAILABLE';
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    speedKmh: number | null;
    bearing: number | null;
    battery: number | null;
    lastRecordedAt: string | null;
    timeAgoText: string;
    isMock: boolean;
  } | null>(null);

  const [history, setHistory] = useState<LocationTelemetryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Acquire Manager's Current Hardware GPS on mount
  const acquireManagerLocation = useCallback(async () => {
    try {
      const loc = await LocationService.getCurrentLocation({ timeoutMs: 6000 });
      if (loc && loc.latitude && loc.longitude) {
        setManagerLocation({ latitude: loc.latitude, longitude: loc.longitude });
      }
    } catch (err) {
      console.warn('[LiveMap] Manager GPS fix unavailable:', err);
    }
  }, []);

  // Fetch Fleet Locations for All Tracked Employees
  const fetchFleetData = useCallback(async () => {
    if (teamEmployees.length === 0) {
      setLoadingFleet(false);
      return;
    }
    try {
      const fleet = await SupabaseDbService.fetchFleetLiveLocations(teamEmployees);
      setFleetLocations(fleet);
    } catch (err) {
      console.warn('[LiveMap] Fleet fetch error:', err);
    } finally {
      setLoadingFleet(false);
      setRefreshing(false);
    }
  }, [teamEmployees]);

  // Fetch Single Employee Detailed Telemetry & Breadcrumbs
  const fetchDetailData = useCallback(async (emp: UserProfile) => {
    setLoadingDetail(true);
    try {
      const empKey = emp.id || emp.employeeCode;
      const statusRes = await SupabaseDbService.getAuthoritativeShiftStatus(empKey);
      const tel = await SupabaseDbService.getLatestEmployeeTelemetry(empKey);
      const hist = await SupabaseDbService.getEmployeeTelemetryHistory(empKey, 20);

      const speed = tel?.speed_mps ? Math.round(Number(tel.speed_mps) * 3.6 * 10) / 10 : null;
      const bearing = tel?.bearing_degrees ? Number(tel.bearing_degrees) : null;
      const isMock = Boolean((tel as any)?.is_mock_location || tel?.provider === 'mock');

      const freshness = determineLocationFreshness(statusRes.lastRecordedAt);

      setSingleTelemetry({
        shiftStatus: statusRes.shiftStatus,
        locationStatus: statusRes.locationStatus as any,
        latitude: statusRes.rawLatitude,
        longitude: statusRes.rawLongitude,
        accuracy: statusRes.accuracyMeters,
        speedKmh: speed,
        bearing: bearing,
        battery: statusRes.batteryPercentage,
        lastRecordedAt: statusRes.lastRecordedAt,
        timeAgoText: freshness.timeAgoText,
        isMock: isMock,
      });

      setHistory(hist);
    } catch (err) {
      console.warn('[LiveMap] Detail fetch error:', err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Initial Load & Lifecycle
  useEffect(() => {
    acquireManagerLocation();
    fetchFleetData();

    if (selectedEmp) {
      fetchDetailData(selectedEmp);
    }

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchFleetData();
      if (selectedEmp && viewMode === 'DETAIL') {
        fetchDetailData(selectedEmp);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [acquireManagerLocation, fetchFleetData, fetchDetailData, selectedEmp, viewMode]);

  // Handle Switch to Single Rep Detail
  const handleSelectEmployee = (empItem: FleetLiveLocationItem) => {
    const matchedProfile = teamEmployees.find(
      (e) => e.id === empItem.employeeId || e.employeeCode === empItem.employeeCode
    );
    if (matchedProfile) {
      setSelectedEmp(matchedProfile);
      setViewMode('DETAIL');
      fetchDetailData(matchedProfile);
    }
  };

  // On-Demand Satellite Ping
  const handleRequestFreshGps = async () => {
    if (!selectedEmp) return;

    if (singleTelemetry?.shiftStatus === 'SHIFT_NOT_STARTED') {
      Alert.alert(
        'Shift Not Started',
        `${selectedEmp.name} has not punched in for today yet. Telemetry requests activate once duty begins.`
      );
      return;
    }

    setRequestingFresh(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const requestedBy = currentUser?.name || 'Manager';
      const empKey = selectedEmp.id || selectedEmp.employeeCode;

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
          await fetchDetailData(selectedEmp);
          Alert.alert(
            'Request Queued 🛰️',
            `Ping sent to ${selectedEmp.name}'s Android device. Showing latest confirmed coordinates while device acquires satellite lock.`
          );
          return;
        }

        const polled = await SupabaseDbService.pollLocationRequest(req.id!);
        if (polled && polled.status === 'COMPLETED') {
          clearInterval(pollTimer);
          setRequestingFresh(false);
          await fetchDetailData(selectedEmp);
          Alert.alert('Fresh GPS Acquired ✅', `Received real-time satellite fix from ${selectedEmp.name}'s device.`);
        }
      }, 2000);
    } catch (err: any) {
      setRequestingFresh(false);
      Alert.alert('Error', err?.message || 'Failed to dispatch location request.');
    }
  };

  // Launch External Google Maps
  const openInGoogleMaps = (lat: number | null, lng: number | null) => {
    if (lat !== null && lng !== null) {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url);
    } else {
      Alert.alert('No Coordinates', 'Coordinates are not yet available for mapping.');
    }
  };

  // Status Badge Component
  const renderFreshnessBadge = (status: LocationFreshness | 'LOCATION_UNAVAILABLE', timeAgo?: string) => {
    switch (status) {
      case 'LIVE':
        return (
          <View style={[styles.badgeBase, styles.badgeLive]}>
            <View style={styles.pulseDotGreen} />
            <Text style={styles.badgeTextLive}>LIVE {timeAgo ? `(${timeAgo})` : ''}</Text>
          </View>
        );
      case 'RECENT':
        return (
          <View style={[styles.badgeBase, styles.badgeRecent]}>
            <Ionicons name="time" size={11} color="#0284C7" />
            <Text style={styles.badgeTextRecent}>RECENT {timeAgo ? `(${timeAgo})` : ''}</Text>
          </View>
        );
      case 'DELAYED':
        return (
          <View style={[styles.badgeBase, styles.badgeDelayed]}>
            <Ionicons name="alert-circle" size={11} color="#D97706" />
            <Text style={styles.badgeTextDelayed}>DELAYED {timeAgo ? `(${timeAgo})` : ''}</Text>
          </View>
        );
      case 'STALE':
        return (
          <View style={[styles.badgeBase, styles.badgeStale]}>
            <Ionicons name="cloud-offline" size={11} color="#64748B" />
            <Text style={styles.badgeTextStale}>LAST KNOWN {timeAgo ? `(${timeAgo})` : ''}</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badgeBase, styles.badgeStale]}>
            <Text style={styles.badgeTextStale}>NO GPS FIX</Text>
          </View>
        );
    }
  };

  // Shift Status Badge
  const renderShiftBadge = (shift: string) => {
    switch (shift) {
      case 'SHIFT_ACTIVE':
        return <Badge label="🟢 Active on Duty" variant="success" />;
      case 'SHIFT_ENDED':
        return <Badge label="⏹️ Shift Ended" variant="muted" />;
      case 'PENDING_SYNC':
        return <Badge label="⏳ Pending Sync" variant="warning" />;
      default:
        return <Badge label="⚠️ Not Punched In" variant="danger" />;
    }
  };

  // Filter Fleet List
  const filteredFleet = fleetLocations.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.territory || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'LIVE') return item.locationStatus === 'LIVE';
    if (statusFilter === 'ACTIVE') return item.shiftStatus === 'SHIFT_ACTIVE';
    if (statusFilter === 'OFFLINE') return item.locationStatus === 'STALE' || item.shiftStatus === 'SHIFT_NOT_STARTED';

    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={viewMode === 'FLEET' ? 'Live Field Force Map' : 'Employee Location & Telemetry'}
        subtitle={
          viewMode === 'FLEET'
            ? `${fleetLocations.length} Tracked Field Representatives`
            : `${selectedEmp?.name} (#${selectedEmp?.employeeCode})`
        }
        showBack
        onBack={() => {
          if (viewMode === 'DETAIL' && !initialEmployee) {
            setViewMode('FLEET');
          } else {
            onBack();
          }
        }}
      />

      {/* TOP VIEW MODE TOGGLE PILLS */}
      {teamEmployees.length > 0 && (
        <View style={styles.viewModeToggleRow}>
          <TouchableOpacity
            style={[styles.modePill, viewMode === 'FLEET' && styles.modePillActive]}
            onPress={() => setViewMode('FLEET')}
          >
            <Ionicons
              name="globe-outline"
              size={15}
              color={viewMode === 'FLEET' ? '#FFFFFF' : '#475569'}
            />
            <Text style={[styles.modePillText, viewMode === 'FLEET' && styles.modePillTextActive]}>
              Fleet Overview ({fleetLocations.length})
            </Text>
          </TouchableOpacity>

          {selectedEmp && (
            <TouchableOpacity
              style={[styles.modePill, viewMode === 'DETAIL' && styles.modePillActive]}
              onPress={() => setViewMode('DETAIL')}
            >
              <Ionicons
                name="person-outline"
                size={15}
                color={viewMode === 'DETAIL' ? '#FFFFFF' : '#475569'}
              />
              <Text style={[styles.modePillText, viewMode === 'DETAIL' && styles.modePillTextActive]}>
                {selectedEmp.name.split(' ')[0]} Focus
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ============================================================== */}
      {/* 1. FLEET OVERVIEW VIEW MODE                                     */}
      {/* ============================================================== */}
      {viewMode === 'FLEET' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                acquireManagerLocation();
                fetchFleetData();
              }}
            />
          }
        >
          {/* Manager Location Indicator Banner */}
          <View style={styles.managerGpsBanner}>
            <Ionicons name="radio" size={16} color="#2563EB" />
            <Text style={styles.managerGpsText}>
              {managerLocation
                ? 'Manager Location Lock: Active (Haversine Distance Online)'
                : 'Acquiring Manager GPS for exact distance calculations...'}
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarBox}>
            <Ionicons name="search-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search field rep by name, code, or territory..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Filter Pills */}
          <View style={styles.filterRow}>
            {[
              { id: 'ALL', label: `All (${fleetLocations.length})` },
              { id: 'LIVE', label: `🟢 Live (${fleetLocations.filter((f) => f.locationStatus === 'LIVE').length})` },
              { id: 'ACTIVE', label: `Active (${fleetLocations.filter((f) => f.shiftStatus === 'SHIFT_ACTIVE').length})` },
              { id: 'OFFLINE', label: `⚪ Stale/Offline (${fleetLocations.filter((f) => f.locationStatus === 'STALE' || f.shiftStatus === 'SHIFT_NOT_STARTED').length})` },
            ].map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterPill, statusFilter === f.id && styles.filterPillActive]}
                onPress={() => setStatusFilter(f.id as any)}
              >
                <Text style={[styles.filterPillText, statusFilter === f.id && styles.filterPillTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loadingFleet ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Synchronizing Field Force Telemetry...</Text>
            </View>
          ) : filteredFleet.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Field Representatives Found</Text>
              <Text style={styles.emptySubtitle}>No matching tracked representatives for this filter.</Text>
            </View>
          ) : (
            filteredFleet.map((item) => {
              const distanceKm =
                managerLocation && item.latitude && item.longitude
                  ? calculateHaversineDistanceKm(
                      managerLocation.latitude,
                      managerLocation.longitude,
                      item.latitude,
                      item.longitude
                    )
                  : null;

              const direction = getCardinalDirection(item.bearingDegrees);

              return (
                <Card key={item.employeeId} style={styles.repCard}>
                  {/* Card Header */}
                  <View style={styles.repHeaderRow}>
                    <View style={styles.repAvatarCircle}>
                      <Text style={styles.repAvatarText}>
                        {item.employeeName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.repName}>{item.employeeName}</Text>
                      <Text style={styles.repRole}>
                        {item.role === 'MEDICAL_REP' ? 'Medical Representative' : item.role} &bull; #
                        {item.employeeCode}
                      </Text>
                      <Text style={styles.repTerritory}>{item.territory || item.headquarter || 'Barak Valley'}</Text>
                    </View>

                    {renderFreshnessBadge(item.locationStatus as any, item.timeAgoText)}
                  </View>

                  {/* Telemetry Metrics Grid */}
                  <View style={styles.repMetricsGrid}>
                    {/* Distance From Manager */}
                    <View style={styles.gridMetricItem}>
                      <Ionicons name="navigate-circle-outline" size={15} color="#2563EB" />
                      <Text style={styles.gridMetricLabel}>Distance Away</Text>
                      <Text style={styles.gridMetricValue}>
                        {distanceKm !== null ? `${distanceKm} km away` : 'GPS Pending'}
                      </Text>
                    </View>

                    {/* GPS Accuracy */}
                    <View style={styles.gridMetricItem}>
                      <Ionicons name="locate-outline" size={15} color="#0D9488" />
                      <Text style={styles.gridMetricLabel}>GPS Accuracy</Text>
                      <Text style={styles.gridMetricValue}>
                        {item.accuracyMeters ? `±${Math.round(item.accuracyMeters)}m` : 'N/A'}
                      </Text>
                    </View>

                    {/* Speed & Heading */}
                    <View style={styles.gridMetricItem}>
                      <Ionicons name="speedometer-outline" size={15} color="#7C3AED" />
                      <Text style={styles.gridMetricLabel}>Speed / Heading</Text>
                      <Text style={styles.gridMetricValue}>
                        {item.speedKmh !== null && item.speedKmh > 0
                          ? `${item.speedKmh} km/h ${direction}`
                          : 'Stationary'}
                      </Text>
                    </View>

                    {/* Last Updated */}
                    <View style={styles.gridMetricItem}>
                      <Ionicons name="time-outline" size={15} color="#EA580C" />
                      <Text style={styles.gridMetricLabel}>Last Recorded</Text>
                      <Text style={styles.gridMetricValue}>{item.timeAgoText}</Text>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.repCardActions}>
                    <TouchableOpacity
                      style={styles.drilldownBtn}
                      onPress={() => handleSelectEmployee(item)}
                    >
                      <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.drilldownBtnText}>Drill Down & Telemetry</Text>
                    </TouchableOpacity>

                    {item.latitude && item.longitude && (
                      <TouchableOpacity
                        style={styles.quickMapsBtn}
                        onPress={() => openInGoogleMaps(item.latitude, item.longitude)}
                      >
                        <Ionicons name="map-outline" size={16} color="#2563EB" />
                        <Text style={styles.quickMapsBtnText}>Maps</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              );
            })
          )}
        </ScrollView>
      ) : (
        /* ============================================================== */
        /* 2. SINGLE EMPLOYEE DETAILED TELEMETRY MODE                    */
        /* ============================================================== */
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                acquireManagerLocation();
                if (selectedEmp) fetchDetailData(selectedEmp);
              }}
            />
          }
        >
          {selectedEmp && (
            <Card style={styles.profileCard}>
              <View style={styles.headerRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {selectedEmp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.empName}>{selectedEmp.name}</Text>
                  <Text style={styles.empRole}>
                    {selectedEmp.role === 'MEDICAL_REP' ? 'Medical Representative' : selectedEmp.role} &bull;{' '}
                    {selectedEmp.headquarter || 'HQ'}
                  </Text>
                  <Text style={styles.empTerritory}>{selectedEmp.territory || 'Barak Valley'}</Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <View style={{ flex: 1 }}>
                  {renderShiftBadge(singleTelemetry?.shiftStatus || 'SHIFT_NOT_STARTED')}
                </View>
                <View>
                  {renderFreshnessBadge(
                    singleTelemetry?.locationStatus || 'LOCATION_UNAVAILABLE',
                    singleTelemetry?.timeAgoText
                  )}
                </View>
              </View>
            </Card>
          )}

          {loadingDetail ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Fetching Real-time Satellite Telemetry...</Text>
            </View>
          ) : (
            <>
              {/* SATELLITE MAP VISUALIZATION CARD */}
              <Card style={styles.mapCard}>
                <View style={styles.mapCanvas}>
                  <View style={styles.gridOverlay}>
                    <View style={styles.mapCircleOuter}>
                      <View style={styles.mapCircleInner}>
                        <Ionicons name="location" size={32} color="#DC2626" />
                      </View>
                    </View>
                  </View>

                  {singleTelemetry?.latitude !== null && singleTelemetry?.longitude !== null ? (
                    <View style={styles.mapFloatingInfo}>
                      <Text style={styles.floatingCoords}>
                        📍 {singleTelemetry?.latitude?.toFixed(5)}° N, {singleTelemetry?.longitude?.toFixed(5)}° E
                      </Text>
                      <Text style={styles.floatingAccuracy}>
                        Accuracy: &plusmn;{singleTelemetry?.accuracy ? Math.round(singleTelemetry.accuracy) : 6}m
                        {singleTelemetry?.accuracy && singleTelemetry.accuracy <= 15
                          ? ' (High Precision Lock)'
                          : ''}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.mapFloatingInfo}>
                      <Text style={styles.floatingCoords}>No GPS Fix Acquired Today</Text>
                      <Text style={styles.floatingAccuracy}>Waiting for morning attendance punch-in</Text>
                    </View>
                  )}
                </View>

                {/* Map Action Buttons */}
                <View style={styles.mapActionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.mapsBtn]}
                    onPress={() =>
                      openInGoogleMaps(singleTelemetry?.latitude || null, singleTelemetry?.longitude || null)
                    }
                    disabled={singleTelemetry?.latitude === null}
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

              {/* TELEMETRY & SENSOR DIAGNOSTICS */}
              <Card style={styles.metricsCard}>
                <Text style={styles.sectionTitle}>Telemetry & Field Diagnostics</Text>

                <View style={styles.metricRow}>
                  {/* Distance from Manager */}
                  <View style={styles.metricItem}>
                    <Ionicons name="navigate-outline" size={20} color="#2563EB" />
                    <Text style={styles.metricLabel}>Distance</Text>
                    <Text style={styles.metricValue}>
                      {managerLocation && singleTelemetry?.latitude && singleTelemetry?.longitude
                        ? `${calculateHaversineDistanceKm(
                            managerLocation.latitude,
                            managerLocation.longitude,
                            singleTelemetry.latitude,
                            singleTelemetry.longitude
                          )} km`
                        : 'Unavailable'}
                    </Text>
                  </View>

                  {/* Battery */}
                  <View style={styles.metricItem}>
                    <Ionicons name="battery-charging-outline" size={20} color="#0D9488" />
                    <Text style={styles.metricLabel}>Battery</Text>
                    <Text style={styles.metricValue}>
                      {singleTelemetry?.battery !== null ? `${singleTelemetry?.battery}%` : 'N/A'}
                    </Text>
                  </View>

                  {/* Speed */}
                  <View style={styles.metricItem}>
                    <Ionicons name="speedometer-outline" size={20} color="#7C3AED" />
                    <Text style={styles.metricLabel}>Speed</Text>
                    <Text style={styles.metricValue}>
                      {singleTelemetry?.speedKmh !== null && singleTelemetry?.speedKmh! > 0
                        ? `${singleTelemetry?.speedKmh} km/h`
                        : '0 km/h'}
                    </Text>
                  </View>

                  {/* Bearing */}
                  <View style={styles.metricItem}>
                    <Ionicons name="compass-outline" size={20} color="#EA580C" />
                    <Text style={styles.metricLabel}>Heading</Text>
                    <Text style={styles.metricValue}>
                      {getCardinalDirection(singleTelemetry?.bearing) || 'North'}
                    </Text>
                  </View>
                </View>

                <View style={styles.disclaimerBox}>
                  <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                  <Text style={styles.disclaimerText}>
                    15-minute background telemetry automatically records movement during active duty. Tapping
                    &quot;Ping Fresh GPS&quot; sends a priority satellite wake-up command.
                  </Text>
                </View>
              </Card>

              {/* BREADCRUMB TRAIL ACCORDION */}
              <Card style={styles.historyCard}>
                <TouchableOpacity
                  style={styles.historyHeader}
                  onPress={() => setShowHistory(!showHistory)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="trail-sign-outline" size={20} color={colors.primary} />
                    <Text style={styles.historyTitle}>
                      Today&apos;s Route Trail ({history.length} telemetry points)
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
                              &bull; &plusmn;{Math.round(pt.accuracy_meters)}m &bull; Source: {pt.source}
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
      )}
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
  viewModeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modePillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  modePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  managerGpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  managerGpsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  repCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  repHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  repAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  repName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  repRole: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  repTerritory: {
    fontSize: 11,
    color: '#64748B',
  },
  repMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  gridMetricItem: {
    width: '47%',
  },
  gridMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  gridMetricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  repCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  drilldownBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 9,
    borderRadius: radius.md,
    gap: 6,
  },
  drilldownBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quickMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.md,
    gap: 4,
  },
  quickMapsBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeLive: {
    backgroundColor: '#DCFCE7',
  },
  badgeRecent: {
    backgroundColor: '#E0F2FE',
  },
  badgeDelayed: {
    backgroundColor: '#FEF3C7',
  },
  badgeStale: {
    backgroundColor: '#F1F5F9',
  },
  badgeTextLive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  badgeTextRecent: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  badgeTextDelayed: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  badgeTextStale: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  pulseDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  mapCircleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCircleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFloatingInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 10,
    borderRadius: radius.md,
  },
  floatingCoords: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: '#FFFFFF',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: 8,
  },
  mapsBtn: {
    backgroundColor: '#2563EB',
  },
  refreshBtn: {
    backgroundColor: '#0D9488',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  metricsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  historyCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
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
    paddingTop: spacing.md,
  },
  emptyHistory: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  historyCoords: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  historyTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});
