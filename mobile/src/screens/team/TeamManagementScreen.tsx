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
import { UserProfile, UserRole, LateLoginRequest, TourPlanRescheduleRequest } from '../../types';
import { SupabaseDbService } from '../../services/supabase/supabaseDbService';
import { DoctorService } from '../../services/doctorService';

interface TeamManagementScreenProps {
  onBack: () => void;
}

export const getRoleDetails = (role?: UserRole | string) => {
  switch (role) {
    case 'DIRECTOR':
      return { label: 'Director', bg: '#EDE9FE', color: '#6D28D9' };
    case 'HR_MANAGER':
      return { label: 'HR Manager', bg: '#FCE7F3', color: '#BE185D' };
    case 'SUPER_ADMIN':
      return { label: 'Corporate Admin', bg: '#E0E7FF', color: '#3730A3' };
    case 'REGIONAL_MANAGER':
      return { label: 'RSM (Regional Manager)', bg: '#FEF3C7', color: '#B45309' };
    case 'AREA_MANAGER':
      return { label: 'ABM (Area Manager)', bg: '#EFF6FF', color: '#1D4ED8' };
    case 'MEDICAL_REP':
    default:
      return { label: 'MR (Medical Rep)', bg: '#DCFCE7', color: '#15803D' };
  }
};

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

  const isManager =
    currentUser?.role === 'DIRECTOR' ||
    currentUser?.role === 'HR_MANAGER' ||
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'REGIONAL_MANAGER' ||
    currentUser?.role === 'AREA_MANAGER';

  // Screen Tab & Requests State
  const [screenTab, setScreenTab] = useState<'EMPLOYEES' | 'APPROVALS'>('EMPLOYEES');
  const [approvalCategory, setApprovalCategory] = useState<'ALL' | 'LATE' | 'RESCHEDULE' | 'DOCTOR'>('ALL');
  const [lateRequests, setLateRequests] = useState<LateLoginRequest[]>([]);
  const [rescheduleRequests, setRescheduleRequests] = useState<TourPlanRescheduleRequest[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
    loadEmployees();
    loadApprovals();
  }, []);

  const loadEmployees = async () => {
    const list = await EmployeeService.getEmployees();
    setEmployees(list);
  };

  const loadApprovals = async () => {
    setLoadingApprovals(true);
    try {
      const late = await SupabaseDbService.getPendingLateLoginRequests();
      const resched = await SupabaseDbService.getPendingRescheduleRequests();
      const deletes = await DoctorService.getPendingDeletionRequests();
      setLateRequests(late || []);
      setRescheduleRequests(resched || []);
      setDeletionRequests(deletes || []);
    } catch (err) {
      console.warn('[TeamManagement] error loading approvals:', err);
    } finally {
      setLoadingApprovals(false);
    }
  };

  const handleApproveLateLogin = async (req: LateLoginRequest) => {
    const managerName = currentUser?.name || 'Bodrud Jaman Sadiol (RSM)';
    await SupabaseDbService.updateLateLoginStatus(req.id, 'APPROVED', managerName);
    await loadApprovals();
    Alert.alert(
      'Late Login Approved ✅',
      `Authorized ${req.employeeName} (Code: ${req.employeeCode}) to start field duty shift.`
    );
  };

  const handleRejectLateLogin = async (req: LateLoginRequest) => {
    const managerName = currentUser?.name || 'Bodrud Jaman Sadiol (RSM)';
    await SupabaseDbService.updateLateLoginStatus(req.id, 'REJECTED', managerName);
    await loadApprovals();
    Alert.alert(
      'Late Login Rejected ❌',
      `Late duty entry rejected for ${req.employeeName}.`
    );
  };

  const handleApproveReschedule = async (req: TourPlanRescheduleRequest) => {
    const managerName = currentUser?.name || 'Bodrud Jaman Sadiol (RSM)';
    await SupabaseDbService.updateRescheduleStatus(req.id, 'APPROVED', managerName);
    await loadApprovals();
    Alert.alert(
      'Reschedule Approved ✅',
      `Visit to ${req.routeOrCity} moved from ${req.originalDate} to ${req.newDate} for ${req.employeeName}.`
    );
  };

  const handleRejectReschedule = async (req: TourPlanRescheduleRequest) => {
    const managerName = currentUser?.name || 'Bodrud Jaman Sadiol (RSM)';
    await SupabaseDbService.updateRescheduleStatus(req.id, 'REJECTED', managerName);
    await loadApprovals();
    Alert.alert(
      'Reschedule Rejected ❌',
      `Reschedule request from ${req.employeeName} has been declined.`
    );
  };

  const handleApproveDoctorDeletion = async (req: any) => {
    const managerName = currentUser?.name || 'Bodrud Jaman Sadiol (RSM)';
    await DoctorService.updateDeletionRequestStatus(req.id, 'APPROVED', managerName, req.doctorId);
    await loadApprovals();
    Alert.alert('Doctor Removed ✅', `Doctor deletion request approved.`);
  };

  const handleRejectDoctorDeletion = async (req: any) => {
    const managerName = currentUser?.name || 'Bodrud Jaman Sadiol (RSM)';
    await DoctorService.updateDeletionRequestStatus(req.id, 'REJECTED', managerName);
    await loadApprovals();
    Alert.alert('Deletion Declined', 'Doctor deletion request rejected.');
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
    else if (territoryLower.includes('aizawl') || territoryLower.includes('mizoram')) setFormDivision('Aizawl');
    else if (territoryLower.includes('tripura') || territoryLower.includes('agartala')) setFormDivision('Tripura');
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
        : formDivision === 'Aizawl'
        ? 'Aizawl Division (Mizoram)'
        : formDivision === 'Agartala' || formDivision === 'Tripura'
        ? 'Agartala Division (Tripura)'
        : formDivision === 'Dharmanagar'
        ? 'Dharmanagar Division (North Tripura)'
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
      (selectedDivision === 'Karimganj' && (emp.territory?.toLowerCase().includes('karimganj') || emp.headquarter?.toLowerCase().includes('karimganj'))) ||
      (selectedDivision === 'Aizawl' && (emp.territory?.toLowerCase().includes('aizawl') || emp.territory?.toLowerCase().includes('mizoram') || emp.headquarter?.toLowerCase().includes('aizawl'))) ||
      ((selectedDivision === 'Agartala' || selectedDivision === 'Tripura') && (emp.territory?.toLowerCase().includes('tripura') || emp.territory?.toLowerCase().includes('agartala') || emp.headquarter?.toLowerCase().includes('agartala'))) ||
      (selectedDivision === 'Dharmanagar' && (emp.territory?.toLowerCase().includes('dharmanagar') || emp.headquarter?.toLowerCase().includes('dharmanagar')));

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
            Logged in as {currentUser?.name} ({getRoleDetails(currentUser?.role).label}).
          </Text>
        </View>
      </View>

      {/* Tab Switcher: Directory vs Approvals */}
      {isManager && (
        <View style={{ flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, marginHorizontal: spacing.md, marginTop: spacing.xs, borderRadius: radius.md }}>
          <TouchableOpacity
            style={[
              { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
              screenTab === 'EMPLOYEES' && { backgroundColor: '#2563EB' },
            ]}
            onPress={() => setScreenTab('EMPLOYEES')}
          >
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: screenTab === 'EMPLOYEES' ? '#ffffff' : '#475569' }}>
              👥 Team Directory ({employees.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
              screenTab === 'APPROVALS' && { backgroundColor: '#2563EB' },
            ]}
            onPress={() => {
              setScreenTab('APPROVALS');
              loadApprovals();
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: screenTab === 'APPROVALS' ? '#ffffff' : '#475569' }}>
                📨 Approvals & Requests
              </Text>
              {lateRequests.length + rescheduleRequests.length + deletionRequests.length > 0 && (
                <View style={{ backgroundColor: '#DC2626', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                  <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: 'bold' }}>
                    {lateRequests.length + rescheduleRequests.length + deletionRequests.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {screenTab === 'EMPLOYEES' ? (
        <>
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
          const roleInfo = getRoleDetails(item.role);
          const roleLabel = roleInfo.label;
          const roleBg = roleInfo.bg;
          const roleColor = roleInfo.color;

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
      </>
      ) : (
        /* APPROVALS & REQUESTS PORTAL */
        <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
          {/* Sub Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0F172A' }}>
                RSM Approval Portal
              </Text>
              <Text style={{ fontSize: 12, color: '#64748B' }}>
                Review rep attendance & schedule modifications
              </Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, borderColor: '#BFDBFE' }}
              onPress={loadApprovals}
            >
              <Ionicons name="refresh" size={14} color="#2563EB" />
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2563EB' }}>
                {loadingApprovals ? 'Loading...' : 'Refresh'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {[
              { id: 'ALL', label: `All (${lateRequests.length + rescheduleRequests.length + deletionRequests.length})` },
              { id: 'LATE', label: `Late Logins (${lateRequests.length})` },
              { id: 'RESCHEDULE', label: `Reschedules (${rescheduleRequests.length})` },
              { id: 'DOCTOR', label: `Deletions (${deletionRequests.length})` },
            ].map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: '#F1F5F9' },
                  approvalCategory === cat.id && { backgroundColor: '#2563EB' }
                ]}
                onPress={() => setApprovalCategory(cat.id as any)}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: approvalCategory === cat.id ? '#ffffff' : '#475569' }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 1. Late Login Requests */}
          {(approvalCategory === 'ALL' || approvalCategory === 'LATE') &&
            lateRequests.map(req => (
              <View
                key={req.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: radius.md,
                  padding: 14,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#F59E0B',
                  ...shadows.sm,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#D97706', textTransform: 'uppercase' }}>
                      ⏰ LATE LOGIN AUTHORIZATION REQUEST
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginTop: 2 }}>
                      {req.employeeName} (Code: {req.employeeCode})
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      📅 Date: {req.date} • Attempted At: {req.attemptedTime}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#B45309' }}>PENDING</Text>
                  </View>
                </View>

                <View style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: radius.xs, marginVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B' }}>REASON FOR DELAY:</Text>
                  <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: '500', marginTop: 2 }}>
                    "{req.reason}"
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#16A34A', paddingVertical: 10, borderRadius: radius.xs, alignItems: 'center' }}
                    onPress={() => handleApproveLateLogin(req)}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 12 }}>✅ APPROVE LOGIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, borderWidth: 1, borderColor: '#DC2626', paddingVertical: 10, borderRadius: radius.xs, alignItems: 'center' }}
                    onPress={() => handleRejectLateLogin(req)}
                  >
                    <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 12 }}>❌ REJECT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {/* 2. Tour Plan Reschedule Requests */}
          {(approvalCategory === 'ALL' || approvalCategory === 'RESCHEDULE') &&
            rescheduleRequests.map(req => (
              <View
                key={req.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: radius.md,
                  padding: 14,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#2563EB',
                  ...shadows.sm,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase' }}>
                      📅 TOUR PLAN RESCHEDULE REQUEST
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginTop: 2 }}>
                      {req.employeeName} (Code: {req.employeeCode})
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#334155', marginTop: 4 }}>
                      Move from: <Text style={{ color: '#DC2626' }}>{req.originalDate}</Text> ➔ <Text style={{ color: '#16A34A' }}>{req.newDate}</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      📍 Beat: {req.routeOrCity}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1D4ED8' }}>PENDING</Text>
                  </View>
                </View>

                <View style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: radius.xs, marginVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748B' }}>MANDATORY REASON:</Text>
                  <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: '500', marginTop: 2 }}>
                    "{req.reason}"
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#2563EB', paddingVertical: 10, borderRadius: radius.xs, alignItems: 'center' }}
                    onPress={() => handleApproveReschedule(req)}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 12 }}>✅ APPROVE & MOVE VISIT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, borderWidth: 1, borderColor: '#DC2626', paddingVertical: 10, borderRadius: radius.xs, alignItems: 'center' }}
                    onPress={() => handleRejectReschedule(req)}
                  >
                    <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 12 }}>❌ REJECT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {/* 3. Doctor Deletion Requests */}
          {(approvalCategory === 'ALL' || approvalCategory === 'DOCTOR') &&
            deletionRequests.map(req => (
              <View
                key={req.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: radius.md,
                  padding: 14,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#DC2626',
                  ...shadows.sm,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#DC2626', textTransform: 'uppercase' }}>
                  👨‍⚕️ DOCTOR DELETION REQUEST
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginTop: 2 }}>
                  Dr. {req.doctorName}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Requested by: {req.requestedByName} ({req.district})
                </Text>
                <View style={{ backgroundColor: '#F8FAFC', padding: 8, borderRadius: radius.xs, marginVertical: 8 }}>
                  <Text style={{ fontSize: 12, color: '#334155' }}>"{req.reason}"</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#DC2626', paddingVertical: 10, borderRadius: radius.xs, alignItems: 'center' }}
                    onPress={() => handleApproveDoctorDeletion(req)}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 12 }}>✅ APPROVE REMOVAL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, borderWidth: 1, borderColor: '#64748B', paddingVertical: 10, borderRadius: radius.xs, alignItems: 'center' }}
                    onPress={() => handleRejectDoctorDeletion(req)}
                  >
                    <Text style={{ color: '#64748B', fontWeight: 'bold', fontSize: 12 }}>DECLINE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {/* Empty State */}
          {((approvalCategory === 'ALL' && lateRequests.length === 0 && rescheduleRequests.length === 0 && deletionRequests.length === 0) ||
            (approvalCategory === 'LATE' && lateRequests.length === 0) ||
            (approvalCategory === 'RESCHEDULE' && rescheduleRequests.length === 0) ||
            (approvalCategory === 'DOCTOR' && deletionRequests.length === 0)) && (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <Ionicons name="checkmark-done-circle-outline" size={60} color="#16A34A" />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginTop: 12 }}>
                All Clear! No Pending Requests
              </Text>
              <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, paddingHorizontal: 30 }}>
                All rep late entries and tour plan reschedules have been reviewed.
              </Text>
            </View>
          )}
        </ScrollView>
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
              <View style={[styles.roleSelectionRow, { flexWrap: 'wrap' }]}>
                {(
                  [
                    { key: 'DIRECTOR', label: 'Director' },
                    { key: 'HR_MANAGER', label: 'HR Manager' },
                    { key: 'REGIONAL_MANAGER', label: 'RSM' },
                    { key: 'AREA_MANAGER', label: 'ABM' },
                    { key: 'MEDICAL_REP', label: 'MR' },
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
                    placeholder="e.g. NLCL-0006"
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
              <View style={[styles.divisionPickRow, { flexWrap: 'wrap' }]}>
                {(
                  [
                    { key: 'Cachar', label: 'Silchar (Cachar)' },
                    { key: 'Hailakandi', label: 'Hailakandi' },
                    { key: 'Karimganj', label: 'Karimganj' },
                    { key: 'Aizawl', label: 'Aizawl (MZ)' },
                    { key: 'Agartala', label: 'Agartala (TR)' },
                    { key: 'Dharmanagar', label: 'Dharmanagar (TR)' },
                  ] as const
                ).map((d) => (
                  <TouchableOpacity
                    key={d.key}
                    style={[styles.divisionPickPill, formDivision === d.key && styles.divisionPickPillActive]}
                    onPress={() => {
                      setFormDivision(d.key);
                      if (d.key === 'Hailakandi') setFormHq('Hailakandi HQ');
                      else if (d.key === 'Karimganj') setFormHq('Karimganj HQ');
                      else if (d.key === 'Aizawl') setFormHq('Aizawl HQ');
                      else if (d.key === 'Agartala') setFormHq('Agartala HQ');
                      else if (d.key === 'Dharmanagar') setFormHq('Dharmanagar HQ');
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
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  divisionPickPill: {
    paddingVertical: 7,
    paddingHorizontal: 10,
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
