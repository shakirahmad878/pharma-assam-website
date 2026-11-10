import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { DoctorService } from '../../services/doctorService';
import { VisitService } from '../../services/visitService';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';
import { SupabaseDbService } from '../../services/supabase/supabaseDbService';
import { AuthService } from '../../services/authService';
import { Doctor, VisitRecord, Chemist } from '../../types';

type CategoryFilter = 'ALL' | 'DOCTORS' | 'CHEMISTS';
type StatusFilter = 'TODAY' | 'PENDING' | 'COMPLETED' | 'UPCOMING' | 'MISSED' | 'ALL';

interface UnifiedCustomerItem {
  id: string;
  type: 'DOCTOR' | 'CHEMIST';
  name: string;
  subtitle: string;
  organization: string;
  area: string;
  district: string;
  phone?: string;
  todayStatus: 'COMPLETED' | 'PENDING' | 'MISSED' | 'NOT_SCHEDULED' | 'CHECKED_IN';
  lastVisitDate?: string;
  rawDoctor?: Doctor;
  rawChemist?: any;
}

interface VisitListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctorId: string) => void;
  onStartChemistVisit: (chemist: any) => void;
  onOpenDrawer?: () => void;
}

export const VisitListScreen: React.FC<VisitListScreenProps> = ({
  onBack,
  onSelectDoctor,
  onStartChemistVisit,
  onOpenDrawer,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODAY');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [chemists, setChemists] = useState<any[]>([]);
  const [visits, setVisits] = useState<VisitRecord[]>([]);

  // History Modal
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<{
    customerName: string;
    records: VisitRecord[];
  } | null>(null);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docList, localVisits] = await Promise.all([
        DoctorService.getDoctors(),
        VisitService.getVisits(),
      ]);

      // Fetch chemists from cloud or cache
      let chemistList: any[] = [];
      try {
        if (SupabaseDbService.isConnected()) {
          chemistList = await SupabaseDbService.fetchFirms();
        }
        if (!chemistList || chemistList.length === 0) {
          chemistList = await StorageService.getItem<any[]>(STORAGE_KEYS.FIRMS_CACHE, []);
        }
      } catch {
        chemistList = await StorageService.getItem<any[]>(STORAGE_KEYS.FIRMS_CACHE, []);
      }

      setDoctors(docList || []);
      setChemists(chemistList || []);
      setVisits(localVisits || []);

      // Background cloud sync for visits
      VisitService.syncFromCloud(currentUser?.id).then(synced => {
        if (synced && synced.length > 0) {
          setVisits(synced);
        }
      });
    } catch (err) {
      console.warn('[VisitListScreen] loadData error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Build unified customer items with status
  const unifiedItems = useMemo((): UnifiedCustomerItem[] => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisitMap = new Map<string, VisitRecord>();

    visits.forEach(v => {
      const vDate = v.date || (v.checkInTimestamp ? v.checkInTimestamp.split('T')[0] : '');
      if (vDate === todayStr) {
        if (v.doctorId) todayVisitMap.set(v.doctorId, v);
        if (v.chemistId) todayVisitMap.set(v.chemistId, v);
      }
    });

    const items: UnifiedCustomerItem[] = [];

    // Map Doctors
    doctors.forEach(doc => {
      const todayVisit = todayVisitMap.get(doc.id);
      let calculatedStatus: UnifiedCustomerItem['todayStatus'] = doc.todayVisitStatus || 'PENDING';
      if (todayVisit) {
        calculatedStatus = todayVisit.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING';
      }

      items.push({
        id: doc.id,
        type: 'DOCTOR',
        name: doc.name,
        subtitle: `${doc.qualification || 'MBBS'} • ${doc.specialty || 'General'}`,
        organization: doc.clinicName || 'Clinic',
        area: doc.area || 'City Area',
        district: doc.district || 'Cachar',
        phone: doc.phone,
        todayStatus: calculatedStatus,
        lastVisitDate: doc.lastVisitDate,
        rawDoctor: doc,
      });
    });

    // Map Chemists
    chemists.forEach(chem => {
      const chemId = chem.id || `chem_${chem.name}`;
      const todayVisit = todayVisitMap.get(chemId);
      const calculatedStatus: UnifiedCustomerItem['todayStatus'] = todayVisit
        ? (todayVisit.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING')
        : 'PENDING';

      items.push({
        id: chemId,
        type: 'CHEMIST',
        name: chem.name || chem.shopName || 'Retail Pharmacy',
        subtitle: `${chem.type || 'Retailer'} • Contact: ${chem.contactPerson || 'Proprietor'}`,
        organization: chem.name || 'Chemist Shop',
        area: chem.area || 'Market',
        district: chem.district || 'Cachar',
        phone: chem.phone,
        todayStatus: calculatedStatus,
        rawChemist: chem,
      });
    });

    return items;
  }, [doctors, chemists, visits]);

  // Status Counts
  const counts = useMemo(() => {
    let today = 0;
    let pending = 0;
    let completed = 0;
    let missed = 0;

    unifiedItems.forEach(item => {
      today++;
      if (item.todayStatus === 'COMPLETED') completed++;
      else if (item.todayStatus === 'MISSED') missed++;
      else pending++;
    });

    return {
      today,
      pending,
      completed,
      upcoming: Math.max(0, unifiedItems.length - today),
      missed,
      all: unifiedItems.length,
    };
  }, [unifiedItems]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return unifiedItems.filter(item => {
      // Category filter
      if (category === 'DOCTORS' && item.type !== 'DOCTOR') return false;
      if (category === 'CHEMISTS' && item.type !== 'CHEMIST') return false;

      // Status filter
      if (statusFilter === 'COMPLETED' && item.todayStatus !== 'COMPLETED') return false;
      if (statusFilter === 'PENDING' && item.todayStatus !== 'PENDING' && item.todayStatus !== 'CHECKED_IN') return false;
      if (statusFilter === 'MISSED' && item.todayStatus !== 'MISSED') return false;

      // Search term filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchOrg = item.organization.toLowerCase().includes(query);
        const matchArea = item.area.toLowerCase().includes(query);
        const matchDistrict = item.district.toLowerCase().includes(query);
        if (!matchName && !matchOrg && !matchArea && !matchDistrict) return false;
      }

      return true;
    });
  }, [unifiedItems, category, statusFilter, search]);

  const viewCustomerHistory = (item: UnifiedCustomerItem) => {
    const history = visits.filter(v => v.doctorId === item.id || v.chemistId === item.id);
    setSelectedCustomerHistory({
      customerName: item.name,
      records: history,
    });
    setHistoryModalVisible(true);
  };

  const renderCustomerCard = ({ item }: { item: UnifiedCustomerItem }) => {
    const isCompleted = item.todayStatus === 'COMPLETED';

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={styles.typeBadgeContainer}>
            <View
              style={[
                styles.typeIconBox,
                { backgroundColor: item.type === 'DOCTOR' ? '#E0F2FE' : '#ECFDF5' },
              ]}
            >
              <Ionicons
                name={item.type === 'DOCTOR' ? 'medical' : 'storefront'}
                size={16}
                color={item.type === 'DOCTOR' ? colors.primary : '#059669'}
              />
            </View>
            <Text
              style={[
                styles.typeText,
                { color: item.type === 'DOCTOR' ? colors.primary : '#059669' },
              ]}
            >
              {item.type === 'DOCTOR' ? 'DOCTOR' : 'CHEMIST / PHARMACY'}
            </Text>
          </View>

          <Badge
            label={isCompleted ? 'COMPLETED' : item.todayStatus === 'MISSED' ? 'MISSED' : 'PENDING'}
            variant={isCompleted ? 'success' : item.todayStatus === 'MISSED' ? 'danger' : 'warning'}
            size="small"
          />
        </View>

        {/* Customer Details */}
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerSubtitle}>{item.subtitle}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#64748B" />
          <Text style={styles.locationText}>
            {item.organization} • {item.area}, {item.district}
          </Text>
        </View>

        {item.lastVisitDate ? (
          <View style={styles.lastVisitRow}>
            <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
            <Text style={styles.lastVisitText}>Last Call: {item.lastVisitDate}</Text>
          </View>
        ) : null}

        {/* Action Row */}
        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => viewCustomerHistory(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={15} color="#475569" />
            <Text style={styles.historyBtnText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.startVisitBtn,
              isCompleted && styles.completedVisitBtn,
            ]}
            onPress={() => {
              if (item.type === 'DOCTOR') {
                onSelectDoctor(item.id);
              } else {
                onStartChemistVisit(item.rawChemist || item);
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'play-circle'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.startVisitBtnText}>
              {isCompleted ? 'View Call' : item.type === 'DOCTOR' ? 'Start Visit' : 'Start Chemist Call'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Field Visits & DCR"
        subtitle={`${currentUser?.name || 'Medical Representative'} • Barak Division`}
        onBack={onBack}
        rightIcon="refresh"
        onRightPress={handleRefresh}
      />

      {/* Category Tabs: ALL | DOCTORS | CHEMISTS */}
      <View style={styles.categoryTabContainer}>
        {(['ALL', 'DOCTORS', 'CHEMISTS'] as CategoryFilter[]).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              category === cat && styles.activeCategoryTab,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryTabText,
                category === cat && styles.activeCategoryTabText,
              ]}
            >
              {cat === 'ALL' ? 'All Customers' : cat === 'DOCTORS' ? 'Doctors' : 'Chemists'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, chamber, or territory..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Status Filter Ribbons */}
      <View style={styles.statusFiltersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFiltersContainer}
          data={[
            { id: 'TODAY', label: "Today's Calls", count: counts.today },
            { id: 'PENDING', label: 'Pending', count: counts.pending },
            { id: 'COMPLETED', label: 'Completed', count: counts.completed },
            { id: 'MISSED', label: 'Missed', count: counts.missed },
            { id: 'ALL', label: 'All Registered', count: counts.all },
          ]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isActive = statusFilter === item.id;
            return (
              <TouchableOpacity
                style={[styles.statusFilterChip, isActive && styles.activeStatusFilterChip]}
                onPress={() => setStatusFilter(item.id as StatusFilter)}
              >
                <Text
                  style={[
                    styles.statusFilterChipText,
                    isActive && styles.activeStatusFilterChipText,
                  ]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.statusCountBadge,
                    isActive && styles.activeStatusCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusCountText,
                      isActive && styles.activeStatusCountText,
                    ]}
                  >
                    {item.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Customer Listing */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading assigned field visits...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => `${item.type}_${item.id}`}
          renderItem={renderCustomerCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Visits Found</Text>
              <Text style={styles.emptySubtitle}>
                No customer calls match the selected filter ({category} - {statusFilter}).
              </Text>
            </View>
          }
        />
      )}

      {/* History Modal */}
      <Modal
        visible={historyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Visit History</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedCustomerHistory?.customerName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setHistoryModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedCustomerHistory?.records || []}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.historyList}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={styles.historyTop}>
                    <Text style={styles.historyDate}>
                      {item.date || item.checkInTimestamp?.split('T')[0]}
                    </Text>
                    <Badge
                      label={item.status || 'COMPLETED'}
                      variant={item.status === 'COMPLETED' ? 'success' : 'neutral'}
                      size="small"
                    />
                  </View>

                  {item.visitObjective ? (
                    <Text style={styles.historyObjective}>
                      Objective: {item.visitObjective.replace(/_/g, ' ')}
                    </Text>
                  ) : null}

                  {item.productsDiscussed && item.productsDiscussed.length > 0 ? (
                    <Text style={styles.historyProducts}>
                      Products: {item.productsDiscussed.join(', ')}
                    </Text>
                  ) : null}

                  {item.doctorFeedback || item.discussionNotes ? (
                    <Text style={styles.historyNotes}>
                      "{item.doctorFeedback || item.discussionNotes}"
                    </Text>
                  ) : null}

                  {item.pobAmount ? (
                    <Text style={styles.historyPob}>
                      POB Booked: ₹{item.pobAmount.toLocaleString()}
                    </Text>
                  ) : null}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyHistory}>
                  <Text style={styles.emptyHistoryText}>
                    No previous calls recorded for this customer.
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  categoryTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  activeCategoryTab: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeCategoryTabText: {
    color: '#FFFFFF',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  statusFiltersWrapper: {
    backgroundColor: '#F8FAFC',
    paddingBottom: 8,
  },
  statusFiltersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  statusFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  activeStatusFilterChip: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  statusFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activeStatusFilterChipText: {
    color: '#FFFFFF',
  },
  statusCountBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  activeStatusCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  statusCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  activeStatusCountText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  customerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
  },
  lastVisitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  lastVisitText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  historyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  startVisitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
    gap: 6,
  },
  completedVisitBtn: {
    backgroundColor: '#059669',
  },
  startVisitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 260,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 4,
  },
  historyList: {
    padding: 16,
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyObjective: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  historyProducts: {
    fontSize: 11,
    color: '#334155',
  },
  historyNotes: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748B',
  },
  historyPob: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  emptyHistory: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
