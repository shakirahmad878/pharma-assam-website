import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { DoctorService } from '../../services/doctorService';
import { RouteService } from '../../services/routeService';
import { LocationService } from '../../services/location/locationService';
import { PdfReportService } from '../../services/pdfReportService';
import { Doctor, RoutePlan } from '../../types';

interface DoctorListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctorId: string) => void;
  onOpenDrawer?: () => void;
  onNavigateToFirms?: () => void;
  mode?: 'VISITS' | 'MASTER';
}

const COMMON_SPECIALTIES = [
  'Cardiologist',
  'Diabetologist',
  'General Physician',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'Dermatologist',
  'ENT Specialist',
];

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({
  onBack,
  onSelectDoctor,
  onOpenDrawer,
  onNavigateToFirms,
  mode = 'VISITS',
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [topTab, setTopTab] = useState<'DOCTORS' | 'FIRMS'>('DOCTORS');
  const [subTab, setSubTab] = useState<'TODAY' | 'ALL'>('TODAY');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);

  // Add Doctor Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('General Physician');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocTier, setNewDocTier] = useState<'A_PLUS' | 'A' | 'B' | 'C'>('A');
  const [newDocDistrict, setNewDocDistrict] = useState<'Cachar' | 'Karimganj' | 'Hailakandi'>('Cachar');
  const [newDocArea, setNewDocArea] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [capturedCoords, setCapturedCoords] = useState<{ lat: number; lng: number }>({
    lat: 24.8215,
    lng: 92.7970,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const docs = await DoctorService.getDoctors();
    setDoctors(docs);
    const route = await RouteService.getActiveRoute();
    setActiveRoute(route);
  };

  const handleOpenAddDoctorModal = async () => {
    setNewDocName('');
    setNewDocSpecialty('General Physician');
    setNewDocClinic('');
    setNewDocPhone('');
    setNewDocTier('A');
    setNewDocDistrict('Cachar');
    setNewDocArea('');
    setAddModalVisible(true);

    // Auto-capture GPS with Anti-Mock verification
    setGpsLoading(true);
    try {
      const loc = await LocationService.getCurrentLocation();
      if (loc) {
        if (loc.isMockLocation) {
          LocationService.validateAuthenticGps(loc, 'Doctor Clinic Geotagging');
        } else {
          setCapturedCoords({ lat: loc.latitude, lng: loc.longitude });
        }
      }
    } catch {
      // fallback
    } finally {
      setGpsLoading(false);
    }
  };

  const handleToggleAddToVisit = async (doc: Doctor, e?: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (doc.todayVisitStatus === 'COMPLETED') {
      Alert.alert('Visit Completed', `You have already completed the visit for ${doc.name} today.`);
      return;
    }
    if (doc.todayVisitStatus === 'PENDING') {
      Alert.alert(
        'Remove from Today\'s Visits',
        `Do you want to remove ${doc.name} from today's visit list?`,
        [
          { text: 'Keep in List', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              await DoctorService.updateDoctorTodayStatus(doc.id, 'MISSED');
              await loadData();
            },
          },
        ]
      );
      return;
    }

    // Add to today's visit
    await DoctorService.updateDoctorTodayStatus(doc.id, 'PENDING');
    await loadData();
    Alert.alert(
      'Added to Today\'s Visit Plan ✅',
      `${doc.name} has been added to your Daily Visit Plan. Switch to the 'Visits' tab to execute and record your call.`
    );
  };

  const handleSaveDoctor = async () => {
    if (!newDocName.trim()) {
      Alert.alert('Required Field', 'Please enter Doctor Full Name.');
      return;
    }
    if (!newDocClinic.trim()) {
      Alert.alert('Required Field', 'Please enter Clinic / Hospital / Chamber Name.');
      return;
    }
    if (!newDocArea.trim()) {
      Alert.alert('Required Field', 'Please enter Area / Street / Landmark.');
      return;
    }
    if (!newDocPhone.trim()) {
      Alert.alert('Contact Info Required', 'Please enter Doctor Contact / Mobile Number.');
      return;
    }

    const cleanPhoneDigits = newDocPhone.trim().replace(/\D/g, '');
    if (cleanPhoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhoneDigits)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit Indian mobile number (e.g. 9435012345).'
      );
      return;
    }

    const formattedPhone = `+91 ${cleanPhoneDigits}`;

    const formattedName = newDocName.trim().startsWith('Dr.')
      ? newDocName.trim()
      : `Dr. ${newDocName.trim()}`;

    await DoctorService.addDoctor({
      name: formattedName,
      specialty: newDocSpecialty.trim() || 'General Physician',
      clinicName: newDocClinic.trim(),
      phone: formattedPhone,
      tier: newDocTier,
      district: newDocDistrict,
      area: newDocArea.trim(),
      clinicAddress: `${newDocClinic.trim()}, ${newDocArea.trim()}, ${newDocDistrict}`,
      latitude: capturedCoords.lat,
      longitude: capturedCoords.lng,
      monthlyVisitTarget: newDocTier === 'A_PLUS' ? 12 : newDocTier === 'A' ? 8 : 4,
    });

    setAddModalVisible(false);
    await loadData();

    Alert.alert(
      'Doctor Added ✅',
      `${formattedName} (Tier ${newDocTier.replace('_', '+')}) registered with contact ${newDocPhone.trim()} and Auto-GPS Geofence!`
    );
  };

  const handleShareVisits = async () => {
    const headers = ['Doctor Name', 'Specialty', 'Tier', 'Phone', 'Location', 'Target', 'Status'];
    const rows = filteredDoctors.map(d => [
      d.name,
      d.specialty,
      `Tier ${d.tier ? d.tier.replace('_', '+') : 'A'}`,
      d.phone || 'N/A',
      `${d.area}, ${d.district}`,
      `${d.completedVisitsThisMonth}/${d.monthlyVisitTarget}`,
      d.todayVisitStatus,
    ]);
    await PdfReportService.generateAndShareReport(
      { title: mode === 'VISITS' ? 'Completed Doctor Visits & DCR Report' : 'Doctor Directory Report', subtitle: 'Barak Valley Division (Assam)' },
      headers,
      rows,
      [
        { label: mode === 'VISITS' ? 'Total Visits Marked' : 'Total Doctors', value: filteredDoctors.length },
        { label: 'Completed Visits', value: filteredDoctors.filter(d => d.todayVisitStatus === 'COMPLETED').length },
      ]
    );
  };

  const filteredDoctors = doctors.filter(doc => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.clinicName.toLowerCase().includes(query) ||
      (doc.phone && doc.phone.includes(query)) ||
      doc.area.toLowerCase().includes(query) ||
      doc.district.toLowerCase().includes(query);

    if (mode === 'VISITS') {
      // In Visits mode, display doctors that are queued for today (PENDING) or completed
      if (subTab === 'TODAY') {
        return matchesSearch && (doc.todayVisitStatus === 'PENDING' || doc.todayVisitStatus === 'COMPLETED');
      }
      return matchesSearch && (doc.todayVisitStatus === 'COMPLETED' || doc.completedVisitsThisMonth > 0 || doc.todayVisitStatus === 'PENDING');
    }

    if (subTab === 'TODAY') {
      return matchesSearch && (doc.todayVisitStatus === 'COMPLETED' || doc.todayVisitStatus === 'PENDING' || doc.todayVisitStatus === 'MISSED');
    }
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner matching Images */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.menuBtn} onPress={onOpenDrawer || onBack}>
            <Ionicons name="menu-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{mode === 'VISITS' ? 'Visits' : 'Doctors'}</Text>
          <TouchableOpacity style={styles.refreshPill} onPress={loadData}>
            <Text style={styles.refreshPillText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Top Toggle Switcher: DOCTORS | FIRM'S */}
        <View style={styles.segmentedRow}>
          <TouchableOpacity
            style={[styles.segmentBtn, topTab === 'DOCTORS' && styles.segmentBtnActive]}
            onPress={() => setTopTab('DOCTORS')}
          >
            <Text style={[styles.segmentText, topTab === 'DOCTORS' && styles.segmentTextActive]}>
              DOCTORS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, topTab === 'FIRMS' && styles.segmentBtnActive]}
            onPress={() => {
              setTopTab('FIRMS');
              if (onNavigateToFirms) onNavigateToFirms();
            }}
          >
            <Text style={[styles.segmentText, topTab === 'FIRMS' && styles.segmentTextActive]}>
              FIRM'S
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-Tabs: TODAY | ALL */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          style={[styles.subTabItem, subTab === 'TODAY' && styles.subTabItemActive]}
          onPress={() => setSubTab('TODAY')}
        >
          <Text style={[styles.subTabText, subTab === 'TODAY' && styles.subTabTextActive]}>TODAY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTabItem, subTab === 'ALL' && styles.subTabItemActive]}
          onPress={() => setSubTab('ALL')}
        >
          <Text style={[styles.subTabText, subTab === 'ALL' && styles.subTabTextActive]}>ALL</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Bar: 2026 | September | All */}
      <View style={styles.filterDropdownsRow}>
        <View style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>{selectedYear}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </View>
        <View style={[styles.dropdownBox, { flex: 1.5 }]}>
          <Text style={styles.dropdownText}>{selectedMonth}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </View>
        <View style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>{statusFilter}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarBox}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Doctor, Phone, City, Specialty"
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

      {/* List of Doctor Visit Cards */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const cleanName = item.name.replace(/^Dr\.\s*/i, '');
          const initial = cleanName.length > 0 ? cleanName.charAt(0).toUpperCase() : 'D';
          const isOpen = item.todayVisitStatus === 'PENDING';
          const isCompleted = item.todayVisitStatus === 'COMPLETED';
          const isSkipped = item.todayVisitStatus === 'MISSED';

          const tierLabel = item.tier === 'A_PLUS' ? 'Tier A+' : item.tier ? `Tier ${item.tier}` : 'Tier A';
          const tierBg = item.tier === 'A_PLUS' ? '#FEF3C7' : item.tier === 'A' ? '#EFF6FF' : '#F1F5F9';
          const tierColor = item.tier === 'A_PLUS' ? '#B45309' : item.tier === 'A' ? '#1D4ED8' : '#475569';

          return (
            <TouchableOpacity
              style={styles.docCard}
              activeOpacity={0.8}
              onPress={() => onSelectDoctor(item.id)}
            >
              <View style={styles.docCardContent}>
                {/* Avatar Initial Circle */}
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>

                {/* Details Column */}
                <View style={styles.docInfoCol}>
                  <View style={styles.docNameRow}>
                    <Text style={styles.docNameText}>
                      {item.name} ({item.completedVisitsThisMonth}/{item.monthlyVisitTarget})
                    </Text>
                  </View>

                  <Text style={styles.docCodeText}>PJDDR6 | ID #{item.id.replace(/\D/g, '') || '1833'}</Text>
                  <Text style={styles.docLocationText}>📍 {item.area}, {item.district}</Text>
                  
                  {item.phone ? (
                    <Text style={styles.docPhoneText}>📞 {item.phone}</Text>
                  ) : null}

                  <View style={styles.docTagsRow}>
                    <Text style={[styles.tierBadge, { backgroundColor: tierBg, color: tierColor }]}>
                      ⭐ {tierLabel}
                    </Text>
                    <Text style={styles.specialtyTag}>✨ {item.specialty.toUpperCase()}</Text>
                    <Text style={styles.potentialTag}>💰 ₹ 0-5000</Text>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <TouchableOpacity onPress={() => Alert.alert('Preferred Time', `Dr. ${cleanName} prefers visits between 11:30 AM - 01:30 PM.`)}>
                      <Text style={styles.prefDayLink}>Pref Day/Time</Text>
                    </TouchableOpacity>

                    {/* Quick Visit Action Button */}
                    {item.todayVisitStatus === 'COMPLETED' ? (
                      <View style={styles.statusClosedBadge}>
                        <Text style={styles.statusClosedText}>✔ Visited</Text>
                      </View>
                    ) : item.todayVisitStatus === 'PENDING' ? (
                      <TouchableOpacity
                        style={styles.inPlanPill}
                        onPress={(e) => handleToggleAddToVisit(item, e)}
                      >
                        <Ionicons name="checkmark-circle" size={13} color="#16A34A" />
                        <Text style={styles.inPlanPillText}>In Today's Plan</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.addToVisitPill}
                        onPress={(e) => handleToggleAddToVisit(item, e)}
                      >
                        <Ionicons name="add-circle-outline" size={13} color="#2563EB" />
                        <Text style={styles.addToVisitPillText}>+ Add to Visit</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          mode === 'VISITS' ? (
            <View style={styles.emptyBox}>
              <Ionicons name="clipboard-outline" size={52} color="#94A3B8" />
              <Text style={[styles.emptyText, { fontWeight: '800', color: colors.textPrimary, fontSize: 16 }]}>
                No Completed Visits Recorded
              </Text>
              <Text style={[styles.emptyText, { marginTop: 6, textAlign: 'center', color: '#64748B' }]}>
                Visits will reflect here automatically once marked and completed by the MR in the field.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Ionicons name="medkit-outline" size={48} color="#94A3B8" />
              <Text style={[styles.emptyText, { fontWeight: '800', color: colors.textPrimary, fontSize: 15 }]}>
                No Doctors Registered Yet
              </Text>
              <Text style={[styles.emptyText, { marginTop: 4, textAlign: 'center' }]}>
                Tap the orange '+' button below to register a doctor with Tier and contact info.
              </Text>
            </View>
          )
        }
      />

      {/* Floating Orange '+' Action Button - STRICTLY restricted to MASTER mode (hidden in VISITS) */}
      {mode === 'MASTER' && (
        <TouchableOpacity
          style={styles.fabBtn}
          activeOpacity={0.85}
          onPress={handleOpenAddDoctorModal}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Bottom Bar with Share button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareVisits}>
          <Ionicons name="share-social-outline" size={20} color="#2563EB" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Add New Doctor Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="person-add" size={22} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>Add New Client / Doctor</Text>
              </View>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Doctor Name */}
              <Text style={styles.inputLabel}>Doctor Full Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Dr. Bikram Nath"
                placeholderTextColor="#94A3B8"
                value={newDocName}
                onChangeText={setNewDocName}
              />

              {/* Specialty Selector & Chips */}
              <Text style={styles.inputLabel}>Specialty *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Cardiologist"
                placeholderTextColor="#94A3B8"
                value={newDocSpecialty}
                onChangeText={setNewDocSpecialty}
              />
              <View style={styles.chipsContainer}>
                {COMMON_SPECIALTIES.map(spec => (
                  <TouchableOpacity
                    key={spec}
                    style={[
                      styles.chipItem,
                      newDocSpecialty === spec && styles.chipItemActive,
                    ]}
                    onPress={() => setNewDocSpecialty(spec)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        newDocSpecialty === spec && styles.chipTextActive,
                      ]}
                    >
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Clinic / Chamber */}
              <Text style={styles.inputLabel}>Clinic / Chamber Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Apollo Clinic, Chamber #2"
                placeholderTextColor="#94A3B8"
                value={newDocClinic}
                onChangeText={setNewDocClinic}
              />

              {/* Area / Street / Landmark */}
              <Text style={styles.inputLabel}>Area / Street / Landmark *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Park Road / Station Road / Tarapur"
                placeholderTextColor="#94A3B8"
                value={newDocArea}
                onChangeText={setNewDocArea}
              />

              {/* Contact Info / Mobile Number */}
              <Text style={styles.inputLabel}>Contact Info / Mobile Number *</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="call-outline" size={18} color="#64748B" style={{ marginLeft: 10 }} />
                <TextInput
                  style={styles.innerTextInput}
                  placeholder="e.g. +91 9435012345"
                  placeholderTextColor="#94A3B8"
                  value={newDocPhone}
                  onChangeText={setNewDocPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Doctor Tier Selector */}
              <Text style={styles.inputLabel}>Doctor Classification Tier *</Text>
              <View style={styles.tierSelectorRow}>
                {[
                  { id: 'A_PLUS', label: 'Tier A+', desc: 'VIP / Core' },
                  { id: 'A', label: 'Tier A', desc: 'High Priority' },
                  { id: 'B', label: 'Tier B', desc: 'Regular' },
                  { id: 'C', label: 'Tier C', desc: 'Potential' },
                ].map(t => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.tierOptionBtn,
                      newDocTier === t.id && styles.tierOptionBtnActive,
                    ]}
                    onPress={() => setNewDocTier(t.id as any)}
                  >
                    <Text
                      style={[
                        styles.tierOptionLabel,
                        newDocTier === t.id && styles.tierOptionLabelActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                    <Text
                      style={[
                        styles.tierOptionDesc,
                        newDocTier === t.id && styles.tierOptionDescActive,
                      ]}
                    >
                      {t.desc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Territory District */}
              <Text style={styles.inputLabel}>Territory District</Text>
              <View style={styles.districtRow}>
                {(['Cachar', 'Karimganj', 'Hailakandi'] as const).map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.districtChip,
                      newDocDistrict === d && styles.districtChipActive,
                    ]}
                    onPress={() => setNewDocDistrict(d)}
                  >
                    <Text
                      style={[
                        styles.districtChipText,
                        newDocDistrict === d && styles.districtChipTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Live Auto-GPS Banner */}
              <View style={styles.gpsBanner}>
                <Ionicons name="location-outline" size={20} color="#059669" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.gpsBannerTitle}>Live Auto-GPS Location</Text>
                  {gpsLoading ? (
                    <ActivityIndicator size="small" color="#059669" style={{ alignSelf: 'flex-start', marginTop: 2 }} />
                  ) : (
                    <Text style={styles.gpsBannerSub}>
                      {newDocArea} ({capturedCoords.lat.toFixed(4)}° N, {capturedCoords.lng.toFixed(4)}° E)
                    </Text>
                  )}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSaveDoctor}>
                <Text style={styles.submitBtnText}>Save Doctor & Schedule Visits</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header Banner
  headerBanner: {
    backgroundColor: '#3B82F6',
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtn: { padding: 4 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  refreshPill: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  refreshPillText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: radius.sm,
    padding: 3,
    marginTop: 12,
  },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 4 },
  segmentBtnActive: { backgroundColor: '#ffffff' },
  segmentText: { color: '#BFDBFE', fontSize: 12, fontWeight: '800' },
  segmentTextActive: { color: '#1E40AF', fontWeight: '800' },

  // Sub Tabs: TODAY | ALL
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  subTabItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  subTabItemActive: { borderBottomWidth: 2, borderColor: '#3B82F6' },
  subTabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  subTabTextActive: { color: '#3B82F6' },

  // Filter Dropdowns Row
  filterDropdownsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  dropdownBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownText: { fontSize: 12, color: colors.textPrimary, fontWeight: '600' },

  // Search Bar
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, paddingVertical: 8, paddingLeft: 6, fontSize: 13, color: colors.textPrimary },

  listContent: { paddingHorizontal: 12, paddingBottom: 100 },

  // Doctor Card
  docCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  docCardContent: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  docInfoCol: { flex: 1 },
  docNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docNameText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  docCodeText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  docLocationText: { fontSize: 12, color: '#475569', marginTop: 2 },
  docPhoneText: { fontSize: 12, color: '#0369A1', marginTop: 2, fontWeight: '600' },
  docTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tierBadge: { fontSize: 10, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  specialtyTag: { fontSize: 10, fontWeight: '700', color: '#7C3AED', backgroundColor: '#F3E8FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  potentialTag: { fontSize: 10, fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F8FAFC',
  },
  prefDayLink: { fontSize: 11, fontWeight: '700', color: '#2563EB' },
  addToVisitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  addToVisitPillText: { fontSize: 11, fontWeight: '700', color: '#2563EB' },
  inPlanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inPlanPillText: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  statusWrap: { flexDirection: 'row', alignItems: 'center' },
  statusOpenBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A', marginRight: 4 },
  statusOpenText: { fontSize: 10, fontWeight: '800', color: '#16A34A' },
  statusClosedBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusClosedText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  statusSkippedBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusSkippedText: { fontSize: 10, fontWeight: '800', color: '#DC2626' },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 13, color: '#64748B', marginTop: 10 },

  // Floating Action Button
  fabBtn: {
    position: 'absolute',
    bottom: 58,
    right: 18,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
    zIndex: 99,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shareBtnText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    ...shadows.card,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalBody: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
  },
  innerTextInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginBottom: 4,
  },
  chipItem: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  tierSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  tierOptionBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tierOptionBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  tierOptionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  tierOptionLabelActive: {
    color: '#B45309',
  },
  tierOptionDesc: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  tierOptionDescActive: {
    color: '#92400E',
    fontWeight: '600',
  },
  districtRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  districtChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingVertical: 8,
    alignItems: 'center',
  },
  districtChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  districtChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  districtChipTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    marginTop: 14,
    marginBottom: 16,
  },
  gpsBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  gpsBannerSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: 20,
    ...shadows.sm,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
