import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { DoctorService } from '../../services/doctorService';
import { RouteService } from '../../services/routeService';
import { PdfReportService } from '../../services/pdfReportService';
import { Doctor, RoutePlan } from '../../types';

interface DoctorListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctorId: string) => void;
  onOpenDrawer?: () => void;
  onNavigateToFirms?: () => void;
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({
  onBack,
  onSelectDoctor,
  onOpenDrawer,
  onNavigateToFirms,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [topTab, setTopTab] = useState<'DOCTORS' | 'FIRMS'>('DOCTORS');
  const [subTab, setSubTab] = useState<'TODAY' | 'ALL'>('TODAY');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const docs = await DoctorService.getDoctors();
    setDoctors(docs);
    const route = await RouteService.getActiveRoute();
    setActiveRoute(route);
  };

  const handleShareVisits = async () => {
    const headers = ['Doctor Name', 'Specialty', 'Location', 'Completed/Target', 'Status'];
    const rows = filteredDoctors.map(d => [
      d.name,
      d.specialty,
      `${d.area}, ${d.district}`,
      `${d.completedVisitsThisMonth}/${d.monthlyVisitTarget}`,
      d.todayVisitStatus,
    ]);
    await PdfReportService.generateAndShareReport(
      { title: 'Doctor Visits & DCR Report', subtitle: 'Barak Valley Division (Assam)' },
      headers,
      rows,
      [
        { label: 'Total Doctors', value: filteredDoctors.length },
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
      doc.area.toLowerCase().includes(query) ||
      doc.district.toLowerCase().includes(query);

    if (subTab === 'TODAY') {
      return matchesSearch && (doc.todayVisitStatus === 'COMPLETED' || doc.todayVisitStatus === 'PENDING' || doc.todayVisitStatus === 'MISSED');
    }
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner matching Images 35, 36, 38 */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.menuBtn} onPress={onOpenDrawer || onBack}>
            <Ionicons name="menu-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visits</Text>
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

      {/* Search Input Bar matching Image 36 */}
      <View style={styles.searchBarBox}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name,City,Hospital Name"
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

      {/* List of Doctor Visit Cards matching Images 35, 36, 38 */}
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

                  <View style={styles.docTagsRow}>
                    <Text style={styles.specialtyTag}>✨ {item.specialty.substring(0, 10).toUpperCase()}</Text>
                    <Text style={styles.potentialTag}>💰 ₹ 0-5000</Text>
                    <Text style={styles.categoryTag}>GENERAL</Text>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <TouchableOpacity onPress={() => Alert.alert('Preferred Time', `Dr. ${cleanName} prefers visits between 11:30 AM - 01:30 PM.`)}>
                      <Text style={styles.prefDayLink}>Pref Day/Time</Text>
                    </TouchableOpacity>

                    {/* Status Badge */}
                    <View style={styles.statusWrap}>
                      {isOpen && (
                        <View style={styles.statusOpenBadge}>
                          <View style={styles.openDot} />
                          <Text style={styles.statusOpenText}>Open</Text>
                        </View>
                      )}
                      {isCompleted && (
                        <View style={styles.statusClosedBadge}>
                          <Text style={styles.statusClosedText}>✔ Closed (Today)</Text>
                        </View>
                      )}
                      {isSkipped && (
                        <View style={styles.statusSkippedBadge}>
                          <Text style={styles.statusSkippedText}>Skipped</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="medkit-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyText}>No visits found for the selected filter.</Text>
          </View>
        }
      />

      {/* Bottom Bar with Share button matching Image 38 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareVisits}>
          <Ionicons name="share-social-outline" size={20} color="#2563EB" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>
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

  listContent: { paddingHorizontal: 12, paddingBottom: 80 },

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
  docTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  specialtyTag: { fontSize: 10, fontWeight: '700', color: '#7C3AED', backgroundColor: '#F3E8FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  potentialTag: { fontSize: 10, fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  categoryTag: { fontSize: 10, fontWeight: '700', color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

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
});
