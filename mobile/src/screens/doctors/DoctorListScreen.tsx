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
import { AuthService } from '../../services/authService';
import { DivisionService, DivisionType, DIVISIONS } from '../../services/divisionService';
import { Doctor, RoutePlan, UserProfile } from '../../types';

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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [topTab, setTopTab] = useState<'DOCTORS' | 'FIRMS'>('DOCTORS');
  const [subTab, setSubTab] = useState<'TODAY' | 'ALL'>('TODAY');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);

  // Division Filter State
  const isManager = DivisionService.isManager(currentUser);
  const userDivision = DivisionService.getUserDivision(currentUser);
  const [selectedDivision, setSelectedDivision] = useState<DivisionType>(
    isManager ? 'ALL' : userDivision
  );

  // Add Doctor Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('General Physician');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocTier, setNewDocTier] = useState<'A_PLUS' | 'A' | 'B' | 'C'>('A');
  const [newDocDistrict, setNewDocDistrict] = useState<'Cachar' | 'Karimganj' | 'Hailakandi'>(
    userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar'
  );
  const [newDocArea, setNewDocArea] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [capturedCoords, setCapturedCoords] = useState<{ lat: number; lng: number }>({
    lat: 24.8215,
    lng: 92.7970,
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (DivisionService.isManager(user)) {
      setSelectedDivision('ALL');
    } else {
      setSelectedDivision(DivisionService.getUserDivision(user));
    }
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
    
    // Auto-lock district for MR, allow choice for Manager
    const defaultDist = userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar';
    setNewDocDistrict(defaultDist);
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

    // Target District
    const targetDist = !isManager
      ? (userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar')
      : newDocDistrict;

    await DoctorService.addDoctor({
      name: formattedName,
      specialty: newDocSpecialty.trim() || 'General Physician',
      clinicName: newDocClinic.trim(),
      phone: formattedPhone,
      tier: newDocTier,
      district: targetDist,
      area: newDocArea.trim(),
      clinicAddress: `${newDocClinic.trim()}, ${newDocArea.trim()}, ${targetDist}`,
      latitude: capturedCoords.lat,
      longitude: capturedCoords.lng,
      monthlyVisitTarget: newDocTier === 'A_PLUS' ? 12 : newDocTier === 'A' ? 8 : 4,
    });

    setAddModalVisible(false);
    await loadData();

    Alert.alert(
      'Doctor Added ✅',
      `${formattedName} (Tier ${newDocTier.replace('_', '+')}) registered in ${targetDist} Division with Auto-GPS Geofence!`
    );
  };

  const handleShareVisits = async () => {
    const headers = ['Doctor Name', 'Specialty', 'Tier', 'Phone', 'Location', 'Division', 'Target', 'Status'];
    const rows = filteredDoctors.map((d) => [
      d.name,
      d.specialty,
      `Tier ${d.tier ? d.tier.replace('_', '+') : 'A'}`,
      d.phone || 'N/A',
      `${d.area}, ${d.district}`,
      d.district,
      `${d.completedVisitsThisMonth}/${d.monthlyVisitTarget}`,
      d.todayVisitStatus,
    ]);
    await PdfReportService.generateAndShareReport(
      {
        title: mode === 'VISITS' ? 'Completed Doctor Visits & DCR Report' : 'Doctor Directory Report',
        subtitle: isManager
          ? `Barak Valley Division (${DivisionService.getDivisionLabel(selectedDivision)})`
          : `${DivisionService.getDivisionLabel(userDivision)} Division MR Report`,
      },
      headers,
      rows,
      [
        { label: mode === 'VISITS' ? 'Total Visits Marked' : 'Total Doctors', value: filteredDoctors.length },
        { label: 'Completed Visits', value: filteredDoctors.filter((d) => d.todayVisitStatus === 'COMPLETED').length },
      ]
    );
  };

  // 1. Division Filter (Strict for MR, Selectable for Manager)
  const divisionScopedDocs = DivisionService.filterDoctorsByDivision(
    doctors,
    selectedDivision,
    currentUser
  );

  // 2. Search & Tab Filter
  const filteredDoctors = divisionScopedDocs.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.clinicName.toLowerCase().includes(query) ||
      (doc.phone && doc.phone.includes(query)) ||
      doc.area.toLowerCase().includes(query) ||
      doc.district.toLowerCase().includes(query);

    if (mode === 'VISITS') {
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
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.menuBtn} onPress={onOpenDrawer || onBack}>
            <Ionicons name="menu-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.headerTitle}>{mode === 'VISITS' ? 'Visits' : 'Doctors'}</Text>
            <Text style={styles.headerSubtitleText}>
              {currentUser?.name || 'Representative'} ({isManager ? 'RSM' : 'MR'})
            </Text>
          </View>
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

      {/* Division Isolation Banner & Controls */}
      {isManager ? (
        <View style={styles.divisionSelectorContainer}>
          <View style={styles.divisionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="business" size={14} color="#1D4ED8" />
              <Text style={styles.divisionHeaderTitle}>SELECT DIVISION (RSM ACCESS):</Text>
            </View>
            <Text style={styles.divisionCountBadge}>{filteredDoctors.length} Doctors</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.divisionPillScroll}>
            {DIVISIONS.map((div) => {
              const isActive = selectedDivision === div.id;
              return (
                <TouchableOpacity
                  key={div.id}
                  style={[styles.divisionPill, isActive && styles.divisionPillActive]}
                  onPress={() => setSelectedDivision(div.id)}
                >
                  <Text style={[styles.divisionPillText, isActive && styles.divisionPillTextActive]}>
                    {div.id === 'ALL' ? '🌐 ' : '📍 '}
                    {div.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.mrDivisionLockedBanner}>
          <View style={styles.mrDivisionHeader}>
            <Ionicons name="shield-checkmark" size={15} color="#15803D" />
            <Text style={styles.mrDivisionTitle}>
              ASSIGNED DIVISION: {DivisionService.getDivisionLabel(userDivision).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.mrDivisionNotice}>
            🔒 MR Restricted View: Strictly limited to your assigned beat ({DivisionService.getDivisionLabel(userDivision)}). Data from other divisions is isolated by company policy.
          </Text>
        </View>
      )}

      {/* Filters Bar: Year | Month | Status */}
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
          placeholder={`Search ${isManager ? 'all divisions' : DivisionService.getDivisionLabel(userDivision)} doctors...`}
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 36 }}>👨‍⚕️</Text>
            <Text style={styles.emptyText}>
              No doctors found for {isManager ? DivisionService.getDivisionLabel(selectedDivision) : DivisionService.getDivisionLabel(userDivision)} division.
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const cleanName = item.name.replace(/^Dr\.\s*/i, '');
          const initial = cleanName.length > 0 ? cleanName.charAt(0).toUpperCase() : 'D';

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
                    <View style={styles.divisionPillBadge}>
                      <Text style={styles.divisionPillBadgeText}>{item.district}</Text>
                    </View>
                  </View>

                  <Text style={styles.docCodeText}>ID #{item.id.replace(/\D/g, '') || '1833'} • {item.clinicName}</Text>
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
      />

      {/* Floating Add Doctor Button */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={handleOpenAddDoctorModal}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Bottom Share Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareVisits}>
          <Ionicons name="share-social-outline" size={16} color="#2563EB" />
          <Text style={styles.shareBtnText}>
            Share {isManager ? DivisionService.getDivisionLabel(selectedDivision) : DivisionService.getDivisionLabel(userDivision)} PDF Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Doctor Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="person-add" size={20} color="#F97316" />
                <Text style={styles.modalHeaderTitle}>Add Doctor to Division</Text>
              </View>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Division Locking Notice */}
              <View style={styles.modalDivisionNotice}>
                <Ionicons name="location" size={16} color="#1E40AF" />
                <Text style={styles.modalDivisionNoticeText}>
                  Target Division: <Text style={{ fontWeight: 'bold' }}>{isManager ? newDocDistrict : DivisionService.getDivisionLabel(userDivision)}</Text>
                  {!isManager ? ' (Locked to your assigned territory)' : ''}
                </Text>
              </View>

              {/* District Picker for Managers */}
              {isManager && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.inputLabel}>Division / District</Text>
                  <View style={styles.districtChipsRow}>
                    {(['Cachar', 'Hailakandi', 'Karimganj'] as const).map((dist) => (
                      <TouchableOpacity
                        key={dist}
                        style={[styles.districtChip, newDocDistrict === dist && styles.districtChipActive]}
                        onPress={() => setNewDocDistrict(dist)}
                      >
                        <Text style={[styles.districtChipText, newDocDistrict === dist && styles.districtChipTextActive]}>
                          {dist === 'Cachar' ? 'Silchar (Cachar)' : dist}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Doctor Name */}
              <Text style={styles.inputLabel}>Doctor Full Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Dr. Sudip Paul"
                placeholderTextColor="#94A3B8"
                value={newDocName}
                onChangeText={setNewDocName}
              />

              {/* Specialty */}
              <Text style={styles.inputLabel}>Medical Specialty</Text>
              <View style={styles.chipsContainer}>
                {COMMON_SPECIALTIES.map((spec) => (
                  <TouchableOpacity
                    key={spec}
                    style={[styles.chipItem, newDocSpecialty === spec && styles.chipItemActive]}
                    onPress={() => setNewDocSpecialty(spec)}
                  >
                    <Text style={[styles.chipText, newDocSpecialty === spec && styles.chipTextActive]}>
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Clinic / Hospital */}
              <Text style={styles.inputLabel}>Clinic / Chamber Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. City Care Polyclinic / Chamber"
                placeholderTextColor="#94A3B8"
                value={newDocClinic}
                onChangeText={setNewDocClinic}
              />

              {/* Area */}
              <Text style={styles.inputLabel}>Area / Street / Landmark *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Hospital Road / Station Road"
                placeholderTextColor="#94A3B8"
                value={newDocArea}
                onChangeText={setNewDocArea}
              />

              {/* Phone */}
              <Text style={styles.inputLabel}>Doctor Contact Mobile *</Text>
              <View style={styles.inputWithIcon}>
                <Text style={{ paddingLeft: 10, color: '#64748B', fontWeight: 'bold' }}>+91</Text>
                <TextInput
                  style={styles.innerTextInput}
                  placeholder="9435012345"
                  placeholderTextColor="#94A3B8"
                  value={newDocPhone}
                  onChangeText={(val) => setNewDocPhone(val.replace(/\D/g, '').slice(0, 10))}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              {/* Tier Selection */}
              <Text style={styles.inputLabel}>Doctor Strategic Tier</Text>
              <View style={styles.tierSelectorRow}>
                {(['A_PLUS', 'A', 'B', 'C'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tierOptionBtn, newDocTier === t && styles.tierOptionBtnActive]}
                    onPress={() => setNewDocTier(t)}
                  >
                    <Text style={[styles.tierOptionLabel, newDocTier === t && styles.tierOptionLabelActive]}>
                      {t === 'A_PLUS' ? 'Tier A+' : `Tier ${t}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* GPS Geotag Status */}
              <View style={styles.gpsBanner}>
                {gpsLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color="#F97316" />
                    <Text style={styles.gpsBannerText}>Capturing GPS coordinates...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="location" size={18} color="#16A34A" />
                    <Text style={styles.gpsBannerText}>
                      GPS Geofence: {capturedCoords.lat.toFixed(4)}° N, {capturedCoords.lng.toFixed(4)}° E (100m Radius)
                    </Text>
                  </View>
                )}
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveDoctor}>
                <Text style={styles.saveBtnText}>Save Doctor Record</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBanner: {
    backgroundColor: '#0F172A',
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  menuBtn: { padding: 4 },
  headerTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  headerSubtitleText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  refreshPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  refreshPillText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  segmentedRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#334155',
    marginTop: spacing.xs,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  segmentBtnActive: {
    borderBottomWidth: 3,
    borderColor: '#F97316',
  },
  segmentText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  subTabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  subTabItemActive: {
    borderBottomWidth: 2.5,
    borderColor: '#2563EB',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  subTabTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },

  // Division Controls
  divisionSelectorContainer: {
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  divisionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  divisionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  divisionCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  divisionPillScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  divisionPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  divisionPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  divisionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  divisionPillTextActive: {
    color: '#FFFFFF',
  },

  // MR Division Locked Banner
  mrDivisionLockedBanner: {
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mrDivisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mrDivisionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  mrDivisionNotice: {
    fontSize: 10,
    color: '#166534',
    marginTop: 2,
    lineHeight: 14,
  },

  // Filters Bar
  filterDropdownsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  dropdownBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownText: { fontSize: 11, color: '#334155', fontWeight: '600' },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    marginLeft: 6,
  },
  listContent: {
    padding: 12,
    paddingBottom: 90,
  },

  // Doctor Card Styles
  docCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  docCardContent: { flexDirection: 'row', gap: 10 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  docInfoCol: { flex: 1 },
  docNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docNameText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, flex: 1 },
  divisionPillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  divisionPillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
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
  statusClosedBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusClosedText: { fontSize: 10, fontWeight: '700', color: '#475569' },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 13, color: '#64748B', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },

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
  modalDivisionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
    marginBottom: 10,
  },
  modalDivisionNoticeText: {
    fontSize: 12,
    color: '#1E40AF',
  },
  districtChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  districtChip: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  districtChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  districtChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  districtChipTextActive: {
    color: '#FFFFFF',
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
    fontWeight: '700',
    color: '#475569',
  },
  tierOptionLabelActive: {
    color: '#B45309',
    fontWeight: '800',
  },
  gpsBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  gpsBannerText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    ...shadows.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
