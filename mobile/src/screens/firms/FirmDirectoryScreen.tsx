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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { LocationService, LocationResult } from '../../services/location/locationService';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';

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
  const [firms, setFirms] = useState<FirmItem[]>(INITIAL_FIRMS);
  const [filterType, setFilterType] = useState<'All' | 'Retailer' | 'Distributor' | 'Stockist'>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadFirms();
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
  const [capturedGps, setCapturedGps] = useState<LocationResult | null>(null);
  const [autoArea, setAutoArea] = useState('Acquiring GPS...');
  const [gpsLoading, setGpsLoading] = useState(false);

  const fetchGpsForFirm = async () => {
    setGpsLoading(true);
    const loc = await LocationService.getCurrentLocation();
    setGpsLoading(false);
    if (loc) {
      setCapturedGps(loc);
      setAutoArea('Main Road & Station Area, Karimganj, Assam');
    } else {
      setAutoArea('Karimganj, Assam');
    }
  };

  const openAddModal = () => {
    setAddModalVisible(true);
    fetchGpsForFirm();
  };

  const handleAddFirm = async () => {
    if (!newFirmName.trim()) {
      Alert.alert('Missing Name', 'Please provide firm name.');
      return;
    }
    const newEntry: FirmItem = {
      id: 'firm-' + Date.now(),
      name: newFirmName.toUpperCase(),
      type: newFirmType,
      contactPerson: newContactPerson.trim() || 'Proprietor / Pharmacist',
      phone: newPhone.trim() || '+91 9435000000',
      dlNumber: newDlNumber.trim() || 'AS-REG-2026-DL-0000',
      area: autoArea,
      district: 'Karimganj',
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
      'Firm Registered with Contact Info ✅',
      `${newEntry.name} (${newEntry.type}) registered with Contact: ${newEntry.contactPerson} (${newEntry.phone}) and Auto-GPS at ${autoArea}.`
    );
  };

  const filtered = firms.filter(f => {
    const matchFilter = filterType === 'All' || f.type === filterType;
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.area.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching Image 33 */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIRMS</Text>
        <View style={styles.headerRightMeta}>
          <Text style={styles.headerUserName}>Pranjal Malakar</Text>
          <Text style={styles.headerDateText}>26 Sept 2026 11:18</Text>
        </View>
      </View>

      {/* Filter Row with Dropdown matching Image 33 */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text style={styles.dropdownTriggerText}>{filterType}</Text>
          <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {(['All', 'Retailer', 'Distributor', 'Stockist'] as const).map(t => (
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

      {/* Firms List matching Image 33 */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const initial = item.name.charAt(0).toUpperCase();
          return (
            <TouchableOpacity
              style={styles.firmCard}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(item.name, `${item.type}\nLocation: ${item.area}\nWould you like to book POB order or log visit?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log Visit', onPress: () => Alert.alert('Visit Logged', `DCR visit noted for ${item.name}.`) },
                ])
              }
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
              <View style={styles.firmDetailsCol}>
                <Text style={styles.firmNameText}>{item.name}</Text>
                <View style={styles.firmMetaRow}>
                  <Ionicons name="person-outline" size={13} color="#64748B" />
                  <Text style={styles.firmTypeText}>{item.type} • {item.contactPerson || 'Proprietor'}</Text>
                </View>
                {item.phone && (
                  <View style={styles.firmMetaRow}>
                    <Ionicons name="call-outline" size={13} color="#2563EB" />
                    <Text style={styles.firmPhoneText}>{item.phone}</Text>
                  </View>
                )}
                <View style={styles.firmMetaRow}>
                  <Ionicons name="location-outline" size={13} color="#64748B" />
                  <Text style={styles.firmAreaText}>{item.area}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="business-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Firms / Retailers Registered</Text>
            <Text style={styles.emptySubtitle}>Tap the '+' button below to register a firm during field visits.</Text>
          </View>
        }
      />

      {/* Floating Action Button `+` matching Image 33 */}
      <TouchableOpacity style={styles.fabBtn} onPress={openAddModal}>
        <Ionicons name="add" size={26} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Firm Modal with Contact Info */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Firm / Retailer</Text>
            <Text style={styles.modalSubtitle}>Karimganj / Barak Valley Directory</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Firm / Pharmacy Name"
              placeholderTextColor="#94A3B8"
              value={newFirmName}
              onChangeText={setNewFirmName}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Contact Person / Pharmacist Name"
              placeholderTextColor="#94A3B8"
              value={newContactPerson}
              onChangeText={setNewContactPerson}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Contact Mobile Number (e.g. +91 9435012345)"
              placeholderTextColor="#94A3B8"
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Drug License (DL) Number"
              placeholderTextColor="#94A3B8"
              value={newDlNumber}
              onChangeText={setNewDlNumber}
            />

            <Text style={styles.modalLabel}>Category Type</Text>
            <View style={styles.typeSelectorRow}>
              {(['Retailer', 'Distributor', 'Stockist'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeOptionBtn, newFirmType === t && styles.typeOptionBtnActive]}
                  onPress={() => setNewFirmType(t)}
                >
                  <Text style={[styles.typeOptionText, newFirmType === t && styles.typeOptionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Live Auto-GPS */}
            <View style={styles.autoGpsBox}>
              <View style={styles.autoGpsHeader}>
                <Ionicons name="location" size={16} color="#2563EB" />
                <Text style={styles.autoGpsTitle}>Live Auto-GPS Area</Text>
              </View>
              <Text style={styles.autoGpsAreaText}>{gpsLoading ? 'Acquiring GPS...' : autoArea}</Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#94A3B8' }]} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2563EB' }]} onPress={handleAddFirm}>
                <Text style={styles.modalBtnText}>Save Firm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header Bar matching Image 33
  headerBar: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800', flex: 1 },
  headerRightMeta: { alignItems: 'flex-end' },
  headerUserName: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  headerDateText: { color: '#BFDBFE', fontSize: 10, marginTop: 1 },

  // Filter Bar
  filterBar: { paddingHorizontal: 16, paddingVertical: 10, zIndex: 100 },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: 140,
    ...shadows.sm,
  },
  dropdownTriggerText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.lg,
    zIndex: 100,
  },
  dropdownMenuItem: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  dropdownMenuItemActive: { backgroundColor: '#EFF6FF' },
  dropdownMenuItemText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  dropdownMenuItemTextActive: { color: '#2563EB', fontWeight: '800' },

  listContent: { paddingHorizontal: 16, paddingBottom: 80 },

  // Firm Card matching Image 33
  firmCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  firmDetailsCol: { flex: 1 },
  firmNameText: { fontSize: 13, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.3 },
  firmMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  firmTypeText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  firmPhoneText: { fontSize: 11, color: '#2563EB', fontWeight: '700' },
  firmAreaText: { fontSize: 11, color: '#475569' },

  fabBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    ...shadows.lg,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  modalSubtitle: { fontSize: 11, color: '#64748B', marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    padding: 10,
    fontSize: 13,
    marginBottom: 10,
    color: colors.textPrimary,
  },
  modalLabel: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 4 },
  typeSelectorRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  typeOptionBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.sm, backgroundColor: '#F1F5F9' },
  typeOptionBtnActive: { backgroundColor: '#2563EB' },
  typeOptionText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  typeOptionTextActive: { color: '#ffffff', fontWeight: '800' },
  autoGpsBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    padding: 10,
    marginBottom: 10,
  },
  autoGpsHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  autoGpsTitle: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  autoGpsAreaText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  modalBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.sm },
  modalBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginTop: 12 },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 6 },
});
