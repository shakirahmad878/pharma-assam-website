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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { EmployeeService } from '../../services/employeeService';
import { AuthService } from '../../services/authService';
import { DivisionService, DivisionType, DIVISIONS } from '../../services/divisionService';
import { UserProfile, UserRole } from '../../types';

interface TeamManagementScreenProps {
  onBack: () => void;
}

export const TeamManagementScreen: React.FC<TeamManagementScreenProps> = ({ onBack }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<DivisionType>('ALL');

  // Modal State for Add / Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState('');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('MEDICAL_REP');
  const [formCode, setFormCode] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDivision, setFormDivision] = useState<DivisionType>('Cachar');
  const [formHq, setFormHq] = useState('Silchar HQ');

  const isManager = currentUser?.role === 'REGIONAL_MANAGER' || currentUser?.role === 'AREA_MANAGER' || currentUser?.role === 'SUPER_ADMIN';

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const list = await EmployeeService.getEmployees();
    setEmployees(list);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setTargetEmployeeId('');
    setFormName('');
    setFormEmail('');
    setFormRole('MEDICAL_REP');
    setFormCode(`000${employees.length + 1}`);
    setFormPhone('');
    setFormDivision('Cachar');
    setFormHq('Silchar HQ');
    setModalVisible(true);
  };

  const openEditModal = (emp: UserProfile) => {
    setIsEditing(true);
    setTargetEmployeeId(emp.id);
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormRole(emp.role);
    setFormCode(emp.employeeCode);
    setFormPhone(emp.phone ? emp.phone.replace(/\D/g, '').slice(-10) : '');
    
    const territoryLower = (emp.territory || '').toLowerCase();
    if (territoryLower.includes('hailakandi')) setFormDivision('Hailakandi');
    else if (territoryLower.includes('karimganj')) setFormDivision('Karimganj');
    else setFormDivision('Cachar');

    setFormHq(emp.headquarter || 'Silchar HQ');
    setModalVisible(true);
  };

  const handleSaveEmployee = async () => {
    if (!formName.trim()) {
      Alert.alert('Required Field', 'Please enter employee full name.');
      return;
    }
    if (!formCode.trim()) {
      Alert.alert('Required Field', 'Please enter employee ID/code (e.g. 0005).');
      return;
    }
    const cleanDigits = formPhone.trim().replace(/\D/g, '');
    if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit Indian mobile number for company OTP login.'
      );
      return;
    }

    const territoryLabel =
      formDivision === 'Hailakandi'
        ? 'Hailakandi Division'
        : formDivision === 'Karimganj'
        ? 'Karimganj Division (Shribhumi)'
        : 'Silchar Division (Cachar)';

    if (isEditing) {
      await EmployeeService.updateEmployee(targetEmployeeId, {
        name: formName.trim(),
        email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@reppulse.com`,
        role: formRole,
        employeeCode: formCode.trim(),
        phone: cleanDigits,
        territory: territoryLabel,
        headquarter: formHq.trim(),
      });
      Alert.alert('Employee Updated ✅', `Profile for ${formName} has been updated successfully.`);
    } else {
      await EmployeeService.addEmployee({
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        employeeCode: formCode.trim(),
        phone: cleanDigits,
        territory: territoryLabel,
        headquarter: formHq.trim(),
      });
      Alert.alert(
        'Employee Created 🎉',
        `${formName} added as ${formRole === 'REGIONAL_MANAGER' ? 'RSM' : formRole === 'AREA_MANAGER' ? 'ABM' : 'MR'}.\n\nRegistered Phone: +91 ${cleanDigits}\nDefault PIN: 1234\nTerritory: ${territoryLabel}`
      );
    }

    setModalVisible(false);
    await loadEmployees();
  };

  const handleDeleteEmployee = (emp: UserProfile) => {
    if (emp.employeeCode === '0001') {
      Alert.alert('Action Restricted', 'Cannot remove the primary Regional Sales Manager.');
      return;
    }

    Alert.alert(
      'Remove Employee',
      `Are you sure you want to deactivate and remove ${emp.name} (Code: ${emp.employeeCode}) from the company directory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await EmployeeService.deleteEmployee(emp.id);
            await loadEmployees();
            Alert.alert('Removed', `${emp.name} has been removed.`);
          },
        },
      ]
    );
  };

  const filteredEmployees = employees.filter((emp) => {
    // 1. Division Filter
    const divMatch =
      selectedDivision === 'ALL' ||
      (selectedDivision === 'Cachar' && (emp.territory?.toLowerCase().includes('cachar') || emp.territory?.toLowerCase().includes('silchar') || emp.headquarter?.toLowerCase().includes('silchar'))) ||
      (selectedDivision === 'Hailakandi' && (emp.territory?.toLowerCase().includes('hailakandi') || emp.headquarter?.toLowerCase().includes('hailakandi'))) ||
      (selectedDivision === 'Karimganj' && (emp.territory?.toLowerCase().includes('karimganj') || emp.headquarter?.toLowerCase().includes('karimganj')));

    // 2. Search Filter
    const query = searchQuery.toLowerCase();
    const searchMatch =
      emp.name.toLowerCase().includes(query) ||
      emp.employeeCode.toLowerCase().includes(query) ||
      (emp.phone && emp.phone.includes(query)) ||
      (emp.territory && emp.territory.toLowerCase().includes(query));

    return divMatch && searchMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.headerTitle}>TEAM & EMPLOYEES</Text>
          <Text style={styles.headerSub}>Barak Valley Sales Force Management</Text>
        </View>
        {isManager && (
          <TouchableOpacity style={styles.addHeaderBtn} onPress={openAddModal}>
            <Ionicons name="person-add" size={16} color="#ffffff" />
            <Text style={styles.addHeaderBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Role Authority Info Banner */}
      <View style={styles.authBanner}>
        <Ionicons name="shield-checkmark" size={16} color={isManager ? '#1D4ED8' : '#15803D'} />
        <View style={{ flex: 1 }}>
          <Text style={styles.authBannerTitle}>
            {isManager ? 'Manager Privilege: Add, Modify & Reassign Employees' : 'Field View: Sales Force Directory'}
          </Text>
          <Text style={styles.authBannerSub}>
            Logged in as {currentUser?.name} ({currentUser?.role === 'REGIONAL_MANAGER' ? 'RSM' : 'MR'}).
          </Text>
        </View>
      </View>

      {/* Division Selector Filter */}
      <View style={styles.divisionSelectorRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {DIVISIONS.map((div) => {
            const isActive = selectedDivision === div.id;
            return (
              <TouchableOpacity
                key={div.id}
                style={[styles.divisionPill, isActive && styles.divisionPillActive]}
                onPress={() => setSelectedDivision(div.id)}
              >
                <Text style={[styles.divisionPillText, isActive && styles.divisionPillTextActive]}>
                  {div.id === 'ALL' ? '🌐 ' : '📍 '}{div.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarBox}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search employee by name, code, phone, or division..."
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

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Employees Found</Text>
            <Text style={styles.emptySub}>Tap '+ Add' in the top bar to onboard a new representative.</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const initial = item.name.charAt(0).toUpperCase();
          const roleLabel =
            item.role === 'REGIONAL_MANAGER'
              ? 'RSM (Regional Manager)'
              : item.role === 'AREA_MANAGER'
              ? 'ABM (Area Manager)'
              : 'MR (Medical Rep)';
          const roleBg =
            item.role === 'REGIONAL_MANAGER'
              ? '#FEF3C7'
              : item.role === 'AREA_MANAGER'
              ? '#EFF6FF'
              : '#DCFCE7';
          const roleColor =
            item.role === 'REGIONAL_MANAGER'
              ? '#B45309'
              : item.role === 'AREA_MANAGER'
              ? '#1D4ED8'
              : '#15803D';

          return (
            <View style={styles.empCard}>
              <View style={styles.empCardHeader}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.empName}>{item.name}</Text>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeBadgeText}>ID: {item.employeeCode}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 3 }}>
                    <Text style={[styles.roleBadge, { backgroundColor: roleBg, color: roleColor }]}>
                      {roleLabel}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={14} color="#0284C7" />
                <Text style={styles.infoTextBold}>+91 {item.phone || '9435000000'}</Text>
                <TouchableOpacity
                  style={styles.callSmallBtn}
                  onPress={() => item.phone && Linking.openURL(`tel:${item.phone}`)}
                >
                  <Ionicons name="call" size={11} color="#ffffff" />
                  <Text style={styles.callSmallBtnText}>Call</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text style={styles.infoText}>
                  Division: <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{item.territory || 'Barak Valley'}</Text>
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={14} color="#64748B" />
                <Text style={styles.infoText}>HQ: {item.headquarter || 'Silchar HQ'}</Text>
              </View>

              {/* Action Buttons for Managers */}
              {isManager && (
                <View style={styles.actionBtnRow}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
                    <Ionicons name="create-outline" size={14} color="#2563EB" />
                    <Text style={styles.editBtnText}>Edit Details</Text>
                  </TouchableOpacity>

                  {item.employeeCode !== '0001' && (
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteEmployee(item)}>
                      <Ionicons name="trash-outline" size={14} color="#DC2626" />
                      <Text style={styles.deleteBtnText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Floating Add Button for Managers */}
      {isManager && (
        <TouchableOpacity style={styles.fab} onPress={openAddModal}>
          <Ionicons name="person-add" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Add / Edit Employee Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="person-circle" size={22} color="#2563EB" />
                <Text style={styles.modalHeaderTitle}>
                  {isEditing ? 'Modify Employee Details' : 'Onboard New Employee'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: '85%' }} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Employee Full Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Amit Deb"
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.inputLabel}>Role / Designation *</Text>
              <View style={styles.roleSelectionRow}>
                {(
                  [
                    { key: 'MEDICAL_REP', label: 'MR' },
                    { key: 'AREA_MANAGER', label: 'ABM' },
                    { key: 'REGIONAL_MANAGER', label: 'RSM' },
                  ] as const
                ).map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleSelectPill, formRole === r.key && styles.roleSelectPillActive]}
                    onPress={() => setFormRole(r.key)}
                  >
                    <Text style={[styles.roleSelectPillText, formRole === r.key && styles.roleSelectPillTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Employee ID / Code *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. 0005"
                    value={formCode}
                    onChangeText={setFormCode}
                  />
                </View>

                <View style={{ flex: 1.5 }}>
                  <Text style={styles.inputLabel}>10-Digit Mobile (For OTP) *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="9435012345"
                    value={formPhone}
                    onChangeText={(v) => setFormPhone(v.replace(/\D/g, '').slice(0, 10))}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Assigned Division / District *</Text>
              <View style={styles.divisionPickRow}>
                {(
                  [
                    { key: 'Cachar', label: 'Silchar (Cachar)' },
                    { key: 'Hailakandi', label: 'Hailakandi' },
                    { key: 'Karimganj', label: 'Karimganj' },
                  ] as const
                ).map((d) => (
                  <TouchableOpacity
                    key={d.key}
                    style={[styles.divisionPickPill, formDivision === d.key && styles.divisionPickPillActive]}
                    onPress={() => {
                      setFormDivision(d.key);
                      if (d.key === 'Hailakandi') setFormHq('Hailakandi HQ');
                      else if (d.key === 'Karimganj') setFormHq('Karimganj HQ');
                      else setFormHq('Silchar HQ');
                    }}
                  >
                    <Text style={[styles.divisionPickPillText, formDivision === d.key && styles.divisionPickPillTextActive]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Headquarter (HQ)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Silchar HQ"
                value={formHq}
                onChangeText={setFormHq}
              />

              <View style={styles.otpNoticeBox}>
                <Ionicons name="information-circle" size={16} color="#1D4ED8" />
                <Text style={styles.otpNoticeBoxText}>
                  Upon creation, this employee can immediately log in using their 10-digit mobile number + OTP or their Employee ID with default PIN: 1234.
                </Text>
              </View>

              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveEmployee}>
                <Text style={styles.saveModalBtnText}>
                  {isEditing ? 'Save Changes' : 'Onboard Employee'}
                </Text>
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
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  addHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 4,
  },
  addHeaderBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  authBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  authBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E40AF',
  },
  authBannerSub: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 1,
  },
  divisionSelectorRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  divisionPill: {
    backgroundColor: '#F1F5F9',
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
  empCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  empCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  empName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  codeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  codeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#475569',
  },
  infoTextBold: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '700',
  },
  callSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
    marginLeft: 8,
  },
  callSmallBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  actionBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F8FAFC',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.md,
    gap: 4,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.md,
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
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
    maxHeight: '92%',
    padding: 20,
    ...shadows.card,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
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
  roleSelectionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  roleSelectPill: {
    flex: 1,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  roleSelectPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  roleSelectPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  roleSelectPillTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  divisionPickRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  divisionPickPill: {
    flex: 1,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  divisionPickPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  divisionPickPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  divisionPickPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  otpNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    padding: 10,
    gap: 8,
    marginTop: 14,
  },
  otpNoticeBoxText: {
    flex: 1,
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },
  saveModalBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    ...shadows.sm,
  },
  saveModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
