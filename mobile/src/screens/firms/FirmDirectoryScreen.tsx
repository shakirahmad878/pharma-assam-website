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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { LocationService, LocationResult } from '../../services/location/locationService';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';
import { AuthService } from '../../services/authService';
import { DivisionService, DivisionType, DIVISIONS } from '../../services/divisionService';
import { UserProfile } from '../../types';

interface FirmItem {
  id: string;
  name: string;
  type: 'Retailer' | 'Distributor' | 'Stockist';
  contactPerson?: string;
  phone?: string;
  dlNumber?: string;
  area: string;
  district: string;
}

const INITIAL_FIRMS: FirmItem[] = [];

interface FirmDirectoryScreenProps {
  onBack: () => void;
}

export const FirmDirectoryScreen: React.FC<FirmDirectoryScreenProps> = ({ onBack }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [firms, setFirms] = useState<FirmItem[]>(INITIAL_FIRMS);
  const [filterType, setFilterType] = useState<'All' | 'Retailer' | 'Distributor' | 'Stockist'>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Division Filter State
  const isManager = DivisionService.isManager(currentUser);
  const userDivision = DivisionService.getUserDivision(currentUser);
  const [selectedDivision, setSelectedDivision] = useState<DivisionType>(
    isManager ? 'ALL' : userDivision
  );

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (DivisionService.isManager(user)) {
      setSelectedDivision('ALL');
    } else {
      setSelectedDivision(DivisionService.getUserDivision(user));
    }

    loadFirms();
    const now = new Date();
    const day = now.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setCurrentDateStr(`${day} ${month} ${year} ${time}`);
  }, []);

  const loadFirms = async () => {
    try {
      const stored = await StorageService.getItem<FirmItem[]>(STORAGE_KEYS.FIRMS_CACHE, []);
      if (stored && Array.isArray(stored)) {
        setFirms(stored);
      }
    } catch {
      // Fallback
    }
  };

  // Add Firm Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newFirmName, setNewFirmName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDlNumber, setNewDlNumber] = useState('');
  const [newFirmType, setNewFirmType] = useState<'Retailer' | 'Distributor' | 'Stockist'>('Retailer');
  const [newFirmDistrict, setNewFirmDistrict] = useState<'Cachar' | 'Karimganj' | 'Hailakandi'>(
    userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar'
  );
  const [capturedGps, setCapturedGps] = useState<LocationResult | null>(null);
  const [autoArea, setAutoArea] = useState('Acquiring GPS...');
  const [gpsLoading, setGpsLoading] = useState(false);

  const fetchGpsForFirm = async () => {
    setGpsLoading(true);
    const loc = await LocationService.getCurrentLocation();
    setGpsLoading(false);
    const targetDist = !isManager
      ? (userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar')
      : newFirmDistrict;

    if (loc) {
      if (loc.isMockLocation) {
        LocationService.validateAuthenticGps(loc, 'Firm / Retailer Geotagging');
        setCapturedGps(null);
        setAutoArea('⚠️ Fake GPS Detected (Blocked)');
      } else {
        setCapturedGps(loc);
        setAutoArea(`Commercial Hub & Main Market, ${targetDist}, Assam`);
      }
    } else {
      setAutoArea(`${targetDist}, Assam`);
    }
  };

  const openAddModal = () => {
    const defaultDist = userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar';
    setNewFirmDistrict(defaultDist);
    setAddModalVisible(true);
    fetchGpsForFirm();
  };

  const handleAddFirm = async () => {
    if (!newFirmName.trim()) {
      Alert.alert('Missing Name', 'Please provide firm / pharmacy name.');
      return;
    }
    if (!newPhone.trim()) {
      Alert.alert('Contact Phone Required', 'Please enter a contact mobile number for the firm.');
      return;
    }
    const cleanDigits = newPhone.trim().replace(/\D/g, '');
    if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit Indian mobile number (e.g. 9435012345).'
      );
      return;
    }
    if (capturedGps?.isMockLocation) {
      Alert.alert('Fake GPS Blocked 🚫', 'Please turn off Developer Mock Location apps to register firm.');
      return;
    }

    const targetDist = !isManager
      ? (userDivision === 'Hailakandi' ? 'Hailakandi' : userDivision === 'Karimganj' ? 'Karimganj' : 'Cachar')
      : newFirmDistrict;

    const formattedFirmPhone = `+91 ${cleanDigits}`;
    const newEntry: FirmItem = {
      id: 'firm-' + Date.now(),
      name: newFirmName.toUpperCase(),
      type: newFirmType,
      contactPerson: newContactPerson.trim() || 'Proprietor / Pharmacist',
      phone: formattedFirmPhone,
      dlNumber: newDlNumber.trim() || 'AS-REG-2026-DL-0000',
      area: autoArea,
      district: targetDist,
    };
    const updatedList = [newEntry, ...firms];
    setFirms(updatedList);
    await StorageService.setItem(STORAGE_KEYS.FIRMS_CACHE, updatedList);

    setAddModalVisible(false);
    setNewFirmName('');
    setNewContactPerson('');
    setNewPhone('');
    setNewDlNumber('');
    Alert.alert(
      'Firm Registered in Division ✅',
      `${newEntry.name} (${newEntry.type}) registered in ${targetDist} Division with Contact: ${newEntry.contactPerson} (${newEntry.phone}).`
    );
  };

  // 1. Division Isolation
  const divisionScopedFirms = DivisionService.filterFirmsByDivision(
    firms,
    selectedDivision,
    currentUser
  );

  // 2. Type & Search Filtering
  const filtered = divisionScopedFirms.filter((f) => {
    const matchFilter = filterType === 'All' || f.type === filterType;
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.area.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIRMS</Text>
        <View style={styles.headerRightMeta}>
          <Text style={styles.headerUserName}>
            {currentUser?.name || 'Representative'} ({isManager ? 'RSM' : 'MR'})
          </Text>
          <Text style={styles.headerDateText}>{currentDateStr}</Text>
        </View>
      </View>

      {/* Division Isolation Banner & Controls */}
      {isManager ? (
        <View style={styles.divisionSelectorContainer}>
          <View style={styles.divisionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="business" size={14} color="#1D4ED8" />
              <Text style={styles.divisionHeaderTitle}>SELECT DIVISION (RSM ACCESS):</Text>
            </View>
            <Text style={styles.divisionCountBadge}>{filtered.length} Firms</Text>
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
            🔒 MR Restricted View: Strictly limited to your assigned beat ({DivisionService.getDivisionLabel(userDivision)}). Firms from other divisions are isolated.
          </Text>
        </View>
      )}

      {/* Filter Row with Dropdown */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text style={styles.dropdownTriggerText}>Type: {filterType}</Text>
          <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {(['All', 'Retailer', 'Distributor', 'Stockist'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.dropdownMenuItem, filterType === t && styles.dropdownMenuItemActive]}
                onPress={() => {
                  setFilterType(t);
                  setDropdownOpen(false);
                }}
              >
                <Text style={[styles.dropdownMenuItemText, filterType === t && styles.dropdownMenuItemTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Firms List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Firms Found</Text>
            <Text style={styles.emptySubtitle}>
              No {filterType !== 'All' ? filterType : ''} firms recorded in {isManager ? DivisionService.getDivisionLabel(selectedDivision) : DivisionService.getDivisionLabel(userDivision)} division. Tap '+' to register a new firm.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.firmCard}>
            <View style={styles.firmHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.firmName}>{item.name}</Text>
                <Text style={styles.firmTypeTag}>🏷️ {item.type.toUpperCase()}</Text>
              </View>
              <View style={styles.divisionBadge}>
                <Text style={styles.divisionBadgeText}>{item.district}</Text>
              </View>
            </View>

            <View style={styles.firmMetaRow}>
              <Ionicons name="person-outline" size={14} color="#64748B" />
              <Text style={styles.firmMetaText}>Contact: {item.contactPerson || 'Proprietor'}</Text>
            </View>

            {item.phone ? (
              <View style={styles.firmMetaRow}>
                <Ionicons name="call-outline" size={14} color="#0284C7" />
                <Text style={[styles.firmMetaText, { color: '#0284C7', fontWeight: 'bold' }]}>
                  {item.phone}
                </Text>
              </View>
            ) : null}

            <View style={styles.firmMetaRow}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.firmMetaText}>{item.area}, {item.district}</Text>
            </View>

            <View style={styles.firmMetaRow}>
              <Ionicons name="document-text-outline" size={14} color="#64748B" />
              <Text style={styles.firmMetaText}>DL: {item.dlNumber || 'AS-REG-2026-DL-0000'}</Text>
            </View>
          </View>
        )}
      />

      {/* Floating Add Firm Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Firm Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Register New Firm / Pharmacy</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginBottom: 12 }} showsVerticalScrollIndicator={false}>
              {/* Division Notice */}
              <View style={styles.modalDivisionNotice}>
                <Ionicons name="location" size={16} color="#1E40AF" />
                <Text style={styles.modalDivisionNoticeText}>
                  Target Division: <Text style={{ fontWeight: 'bold' }}>{isManager ? newFirmDistrict : DivisionService.getDivisionLabel(userDivision)}</Text>
                  {!isManager ? ' (Locked to your assigned territory)' : ''}
                </Text>
              </View>

              {/* District Picker for Managers */}
              {isManager && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.inputLabelSmall}>Division / District</Text>
                  <View style={styles.districtChipsRow}>
                    {(['Cachar', 'Hailakandi', 'Karimganj'] as const).map((dist) => (
                      <TouchableOpacity
                        key={dist}
                        style={[styles.districtChip, newFirmDistrict === dist && styles.districtChipActive]}
                        onPress={() => setNewFirmDistrict(dist)}
                      >
                        <Text style={[styles.districtChipText, newFirmDistrict === dist && styles.districtChipTextActive]}>
                          {dist === 'Cachar' ? 'Silchar (Cachar)' : dist}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.inputLabelSmall}>Firm / Medical Store Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. LIFELINE PHARMA"
                value={newFirmName}
                onChangeText={setNewFirmName}
              />

              <Text style={styles.inputLabelSmall}>Firm Type</Text>
              <View style={styles.firmTypeRow}>
                {(['Retailer', 'Distributor', 'Stockist'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.firmTypePill, newFirmType === t && styles.firmTypePillActive]}
                    onPress={() => setNewFirmType(t)}
                  >
                    <Text style={[styles.firmTypePillText, newFirmType === t && styles.firmTypePillTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabelSmall}>Contact Person (Pharmacist / Proprietor)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Ratan Debnath"
                value={newContactPerson}
                onChangeText={setNewContactPerson}
              />

              <Text style={styles.inputLabelSmall}>Contact Mobile Number *</Text>
              <View style={styles.inputWithIcon}>
                <Text style={{ paddingLeft: 10, color: '#64748B', fontWeight: 'bold' }}>+91</Text>
                <TextInput
                  style={styles.innerTextInput}
                  placeholder="9435012345"
                  placeholderTextColor="#94A3B8"
                  value={newPhone}
                  onChangeText={(val) => setNewPhone(val.replace(/\D/g, '').slice(0, 10))}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <Text style={styles.inputLabelSmall}>Drug License (DL) Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. AS-SIL-2026-DL-8821"
                value={newDlNumber}
                onChangeText={setNewDlNumber}
              />

              {/* GPS Banner */}
              <View style={styles.gpsBanner}>
                {gpsLoading ? (
                  <Text style={styles.gpsBannerText}>Capturing GPS coordinates...</Text>
                ) : (
                  <Text style={styles.gpsBannerText}>📍 Auto-GPS: {autoArea}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.saveFirmBtn} onPress={handleAddFirm}>
                <Text style={styles.saveFirmBtnText}>Register Firm Record</Text>
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
  headerBar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerRightMeta: {
    alignItems: 'flex-end',
  },
  headerUserName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerDateText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
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

  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    ...shadows.card,
  },
  dropdownMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  dropdownMenuItemActive: {
    backgroundColor: '#EFF6FF',
  },
  dropdownMenuItemText: {
    fontSize: 13,
    color: '#334155',
  },
  dropdownMenuItemTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  firmCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  firmHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  firmName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  firmTypeTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 2,
  },
  divisionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  divisionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  firmMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  firmMetaText: {
    fontSize: 12,
    color: '#475569',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
  },

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
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
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
  inputLabelSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
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
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  firmTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  firmTypePill: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  firmTypePillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  firmTypePillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  firmTypePillTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  gpsBanner: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 12,
  },
  gpsBannerText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  saveFirmBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    ...shadows.sm,
  },
  saveFirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
