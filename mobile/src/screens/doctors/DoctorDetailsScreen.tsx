import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { DoctorService } from '../../services/doctorService';
import { LocationService } from '../../services/location/locationService';
import { GeofenceService } from '../../services/location/geofenceService';
import { AuthService } from '../../services/authService';
import { Doctor, GeofenceStatus, UserProfile } from '../../types';

interface DoctorDetailsScreenProps {
  doctorId: string;
  onBack: () => void;
  onStartVisit: (doctor: Doctor, isGeofenceOk: boolean, distanceMeters: number) => void;
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

export const DoctorDetailsScreen: React.FC<DoctorDetailsScreenProps> = ({
  doctorId,
  onBack,
  onStartVisit,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [tierModalVisible, setTierModalVisible] = useState(false);

  // Edit Doctor Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editQual, setEditQual] = useState('');
  const [editClinic, setEditClinic] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTier, setEditTier] = useState<'A_PLUS' | 'A' | 'B' | 'C'>('A');
  const [editDistrict, setEditDistrict] = useState<'Cachar' | 'Karimganj' | 'Hailakandi'>('Cachar');
  const [editArea, setEditArea] = useState('');

  // Delete Doctor Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteReason, setDeleteReason] = useState('Doctor relocated / chamber closed');
  const [managerPinInput, setManagerPinInput] = useState('');
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [geofenceEval, setGeofenceEval] = useState<{
    status: GeofenceStatus;
    distanceMeters: number;
    isWithinRadius: boolean;
    statusText: string;
  }>({
    status: 'NOT_STARTED',
    distanceMeters: 0,
    isWithinRadius: false,
    statusText: 'Checking satellite distance...',
  });
  const [checkingLocation, setCheckingLocation] = useState(false);

  const isManager = currentUser?.role === 'REGIONAL_MANAGER' || currentUser?.role === 'AREA_MANAGER';

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    const doc = await DoctorService.getDoctorById(doctorId);
    setDoctor(doc);
    if (doc) {
      checkGeofence(doc);
      setEditName(doc.name);
      setEditSpecialty(doc.specialty);
      setEditQual(doc.qualification);
      setEditClinic(doc.clinicName);
      setEditPhone(doc.phone ? doc.phone.replace('+91 ', '') : '');
      setEditTier(doc.tier || 'A');
      setEditDistrict(doc.district as any || 'Cachar');
      setEditArea(doc.area);
    }
  };

  const checkGeofence = async (doc: Doctor) => {
    setCheckingLocation(true);
    const loc = await LocationService.getCurrentLocation();
    setCheckingLocation(false);

    if (loc) {
      if (loc.isMockLocation) {
        LocationService.validateAuthenticGps(loc, 'Doctor Clinic Visit');
      }

      const evaluation = GeofenceService.evaluateGeofence(
        doc.latitude,
        doc.longitude,
        loc.latitude,
        loc.longitude,
        loc.accuracyMeters,
        doc.geofenceRadiusMeters,
        loc.isMockLocation
      );
      setGeofenceEval(evaluation);
    } else {
      setGeofenceEval({
        status: 'LOCATION_ACCURACY_LOW',
        distanceMeters: 0,
        isWithinRadius: false,
        statusText: 'GPS fix unavailable. Please check location permissions.',
      });
    }
  };

  const handleOpenEdit = () => {
    if (!doctor) return;
    setEditName(doctor.name);
    setEditSpecialty(doctor.specialty);
    setEditQual(doctor.qualification);
    setEditClinic(doctor.clinicName);
    setEditPhone(doctor.phone ? doctor.phone.replace('+91 ', '') : '');
    setEditTier(doctor.tier || 'A');
    setEditDistrict(doctor.district as any || 'Cachar');
    setEditArea(doctor.area);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!doctor) return;
    if (!editName.trim()) {
      Alert.alert('Required Field', 'Please enter Doctor Full Name.');
      return;
    }
    if (!editClinic.trim()) {
      Alert.alert('Required Field', 'Please enter Clinic / Chamber Name.');
      return;
    }

    const cleanPhoneDigits = editPhone.trim().replace(/\D/g, '');
    if (cleanPhoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhoneDigits)) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit Indian mobile number (e.g. 9435012345).');
      return;
    }

    const formattedName = editName.trim().startsWith('Dr.') ? editName.trim() : `Dr. ${editName.trim()}`;
    const formattedPhone = `+91 ${cleanPhoneDigits}`;

    const updated = await DoctorService.updateDoctor(doctor.id, {
      name: formattedName,
      specialty: editSpecialty.trim() || 'General Physician',
      qualification: editQual.trim() || 'MBBS',
      clinicName: editClinic.trim(),
      phone: formattedPhone,
      tier: editTier,
      district: editDistrict,
      area: editArea.trim() || doctor.area,
      clinicAddress: `${editClinic.trim()}, ${editArea.trim() || doctor.area}, ${editDistrict}`,
      monthlyVisitTarget: editTier === 'A_PLUS' ? 12 : editTier === 'A' ? 8 : 4,
    });

    if (updated) {
      setDoctor(updated);
      setEditModalVisible(false);
      Alert.alert('Doctor Details Updated ✅', `${updated.name} records have been saved successfully.`);
    }
  };

  const handleDeletePress = () => {
    if (!doctor) return;

    if (isManager) {
      // Direct Manager Delete with confirmation
      Alert.alert(
        'Delete Doctor Record',
        `Are you sure you want to permanently delete ${doctor.name} (${doctor.clinicName}) from the system?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Doctor',
            style: 'destructive',
            onPress: async () => {
              await DoctorService.deleteDoctor(doctor.id);
              Alert.alert('Doctor Deleted 🗑️', `${doctor.name} has been removed from the registry.`);
              onBack();
            },
          },
        ]
      );
    } else {
      // MR Deletion Approval Request
      setDeleteModalVisible(true);
    }
  };

  const handleSendDeleteRequest = async () => {
    if (!doctor) return;
    if (!deleteReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a reason for requesting doctor deletion.');
      return;
    }
    setSubmittingDelete(true);
    await DoctorService.requestDoctorDeletion(
      doctor.id,
      doctor.name,
      deleteReason,
      currentUser?.name || 'Pranjal Malakar (MR)'
    );
    setSubmittingDelete(false);
    setDeleteModalVisible(false);

    Alert.alert(
      'Deletion Request Sent ✅',
      `Approval request to delete ${doctor.name} sent to Regional Sales Manager (RSM Bodrud Jaman Sadiol).`
    );
  };

  const handleManagerPinDelete = async () => {
    if (!doctor) return;
    if (!managerPinInput.trim()) {
      Alert.alert('PIN Required', 'Please enter 4-digit Manager Authorization PIN.');
      return;
    }

    if (managerPinInput.trim() === '0001' || managerPinInput.trim() === '1234') {
      setDeleteModalVisible(false);
      await DoctorService.deleteDoctor(doctor.id);
      Alert.alert('Manager Authorized ✅', `${doctor.name} has been permanently deleted by RSM Authorization.`);
      onBack();
    } else {
      Alert.alert('Invalid PIN', 'Incorrect Manager Authorization PIN.');
    }
  };

  if (!doctor) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={doctor.name} subtitle={doctor.specialty} showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doctor.name}</Text>
              <Text style={styles.docQual}>{doctor.qualification}</Text>
              <Text style={styles.docSpecialty}>Specialty: {doctor.specialty}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <TouchableOpacity
                onPress={() => setTierModalVisible(true)}
                style={styles.tierBadgeWrapper}
              >
                <Badge
                  label={doctor.tier === 'A_PLUS' ? 'Tier A+' : `Tier ${doctor.tier}`}
                  variant="primary"
                />
                <Text style={styles.changeTierHint}>✏️ Tier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editBtnPill} onPress={handleOpenEdit}>
                <Ionicons name="create-outline" size={13} color="#2563EB" />
                <Text style={styles.editBtnPillText}>Edit Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Change Tier Modal */}
        <Modal visible={tierModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Select Doctor Tier</Text>
              <Text style={styles.modalSubtitle}>Assign appropriate tier for {doctor.name}</Text>

              <View style={styles.tierOptionsList}>
                {[
                  { id: 'A_PLUS', label: 'Tier A+ (Key Opinion Leader)' },
                  { id: 'A', label: 'Tier A (High Potential Prescriber)' },
                  { id: 'B', label: 'Tier B (Regular Prescriber)' },
                  { id: 'C', label: 'Tier C (Occasional Prescriber)' },
                ].map(t => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.tierOptionItem,
                      doctor.tier === t.id && styles.tierOptionItemActive,
                    ]}
                    onPress={async () => {
                      await DoctorService.updateDoctorTier(doctor.id, t.id as Doctor['tier']);
                      setDoctor({ ...doctor, tier: t.id as Doctor['tier'] });
                      setTierModalVisible(false);
                      Alert.alert('Tier Updated ✅', `${doctor.name} is now set to ${t.label.split(' ')[0]} ${t.label.split(' ')[1] || ''}.`);
                    }}
                  >
                    <Text
                      style={[
                        styles.tierOptionLabel,
                        doctor.tier === t.id && styles.tierOptionLabelActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                    {doctor.tier === t.id && (
                      <Text style={styles.activeCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setTierModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 100m Clinic Geofence Status Card */}
        <Card style={geofenceEval.isWithinRadius ? styles.geofenceCardOk : styles.geofenceCardWarn}>
          <View style={styles.geofenceHeader}>
            <Text style={styles.geofenceTitle}>📍 Clinic Geofence Verification</Text>
            <TouchableOpacity onPress={() => checkGeofence(doctor)}>
              <Text style={styles.recheckText}>{checkingLocation ? 'Checking...' : '↻ Recheck'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.geofenceStatusText}>{geofenceEval.statusText}</Text>
          <Text style={styles.geofenceDetails}>
            Clinic Coordinates: {doctor.latitude.toFixed(4)}, {doctor.longitude.toFixed(4)} • Radius: {doctor.geofenceRadiusMeters}m
          </Text>
        </Card>

        {/* Clinic Details */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={styles.sectionTitle}>Clinic Information</Text>
            <TouchableOpacity onPress={handleOpenEdit}>
              <Text style={styles.editSectionLink}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.clinicName}>🏥 {doctor.clinicName}</Text>
          <Text style={styles.clinicAddr}>{doctor.clinicAddress}</Text>
          <Text style={styles.clinicPhone}>📞 {doctor.phone}</Text>
        </Card>

        {/* Target & History */}
        <Card>
          <Text style={styles.sectionTitle}>Visit Target & Compliance</Text>
          <Text style={styles.historyText}>Monthly Target: {doctor.monthlyVisitTarget} calls</Text>
          <Text style={styles.historyText}>Completed This Month: {doctor.completedVisitsThisMonth} calls</Text>
          <Text style={styles.historyText}>Last Visit Logged: {doctor.lastVisitDate || 'No visits this month'}</Text>
        </Card>

        {/* Add to Today's Visit Plan Quick Button */}
        {doctor.todayVisitStatus !== 'COMPLETED' && (
          <TouchableOpacity
            style={[
              styles.planToggleBtn,
              doctor.todayVisitStatus === 'PENDING' ? styles.planToggleBtnActive : styles.planToggleBtnInactive,
            ]}
            onPress={async () => {
              if (doctor.todayVisitStatus === 'PENDING') {
                await DoctorService.updateDoctorTodayStatus(doctor.id, 'MISSED');
                setDoctor({ ...doctor, todayVisitStatus: 'MISSED' });
                Alert.alert('Removed', `${doctor.name} removed from today's visit plan.`);
              } else {
                await DoctorService.updateDoctorTodayStatus(doctor.id, 'PENDING');
                setDoctor({ ...doctor, todayVisitStatus: 'PENDING' });
                Alert.alert('Added to Today\'s Visits ✅', `${doctor.name} added to today's visit plan. You can also execute your visit from the 'Visits' tab.`);
              }
            }}
          >
            <Ionicons
              name={doctor.todayVisitStatus === 'PENDING' ? "checkmark-circle" : "add-circle-outline"}
              size={18}
              color={doctor.todayVisitStatus === 'PENDING' ? "#16A34A" : "#2563EB"}
            />
            <Text
              style={[
                styles.planToggleBtnText,
                doctor.todayVisitStatus === 'PENDING' ? { color: '#16A34A' } : { color: '#2563EB' },
              ]}
            >
              {doctor.todayVisitStatus === 'PENDING' ? "In Today's Visit Plan (Tap to Remove)" : "+ Add to Today's Visit Plan"}
            </Text>
          </TouchableOpacity>
        )}

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <Button
            title={
              doctor.todayVisitStatus === 'COMPLETED'
                ? "✔ Visit Completed Today"
                : geofenceEval.isWithinRadius
                ? "✓ Start Geofence Verified Visit"
                : `🚫 Out of Range (${Math.round(geofenceEval.distanceMeters)}m Away)`
            }
            onPress={() => {
              if (doctor.todayVisitStatus === 'COMPLETED') {
                Alert.alert('Visit Done', `You have already logged today's visit for ${doctor.name}.`);
                return;
              }
              if (geofenceEval.isWithinRadius) {
                onStartVisit(doctor, true, geofenceEval.distanceMeters);
              } else {
                Alert.alert(
                  'Visit Blocked - Out of 100m Range 🚫',
                  `You are currently ${Math.round(geofenceEval.distanceMeters)}m away from ${doctor.clinicName}.\n\nRepPulse requires you to be physically within the 100-meter clinic perimeter to start and complete this visit.`
                );
              }
            }}
            variant={geofenceEval.isWithinRadius && doctor.todayVisitStatus !== 'COMPLETED' ? "primary" : "secondary"}
          />
        </View>

        {/* Delete Doctor Button */}
        <TouchableOpacity style={styles.deleteDoctorBtn} onPress={handleDeletePress}>
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
          <Text style={styles.deleteDoctorText}>
            {isManager ? 'Delete Doctor Record' : 'Request Doctor Deletion (RSM Approval)'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Doctor Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%' }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="create" size={20} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>Edit Doctor Details</Text>
              </View>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formInputLabel}>Doctor Full Name *</Text>
              <TextInput
                style={styles.formInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="e.g. Dr. Bikram Nath"
              />

              <Text style={styles.formInputLabel}>Specialty *</Text>
              <TextInput
                style={styles.formInput}
                value={editSpecialty}
                onChangeText={setEditSpecialty}
                placeholder="e.g. Cardiologist"
              />

              <View style={styles.chipsWrap}>
                {COMMON_SPECIALTIES.map(spec => (
                  <TouchableOpacity
                    key={spec}
                    style={[styles.specChip, editSpecialty === spec && styles.specChipActive]}
                    onPress={() => setEditSpecialty(spec)}
                  >
                    <Text style={[styles.specChipText, editSpecialty === spec && styles.specChipTextActive]}>
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formInputLabel}>Clinic / Chamber Name *</Text>
              <TextInput
                style={styles.formInput}
                value={editClinic}
                onChangeText={setEditClinic}
                placeholder="e.g. Apollo Polyclinic, Hospital Road"
              />

              <Text style={styles.formInputLabel}>10-Digit Mobile Number *</Text>
              <TextInput
                style={styles.formInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="e.g. 9435012345"
                keyboardType="phone-pad"
              />

              <Text style={styles.formInputLabel}>Classification Tier</Text>
              <View style={styles.tierSelectorRow}>
                {(['A_PLUS', 'A', 'B', 'C'] as const).map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tierChip, editTier === t && styles.tierChipActive]}
                    onPress={() => setEditTier(t)}
                  >
                    <Text style={[styles.tierChipText, editTier === t && styles.tierChipTextActive]}>
                      {t === 'A_PLUS' ? 'Tier A+' : `Tier ${t}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formInputLabel}>Territory District</Text>
              <View style={styles.tierSelectorRow}>
                {(['Cachar', 'Karimganj', 'Hailakandi'] as const).map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.tierChip, editDistrict === d && styles.tierChipActive]}
                    onPress={() => setEditDistrict(d)}
                  >
                    <Text style={[styles.tierChipText, editDistrict === d && styles.tierChipTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveChangesBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveChangesBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Delete Doctor Approval Request Modal (For MR) */}
      <Modal visible={deleteModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="shield-checkmark" size={20} color="#DC2626" />
                <Text style={styles.modalHeaderTitle}>Manager Deletion Approval</Text>
              </View>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalNotice}>
              Deleting a registered doctor requires approval from Regional Sales Manager (RSM Bodrud Jaman Sadiol).
            </Text>

            <Text style={styles.formInputLabel}>Reason for Deletion *</Text>
            <TextInput
              style={[styles.formInput, { minHeight: 60, textAlignVertical: 'top' }]}
              value={deleteReason}
              onChangeText={setDeleteReason}
              placeholder="e.g. Doctor chamber closed / duplicate registration..."
              multiline
            />

            <TouchableOpacity
              style={styles.requestApprovalBtn}
              onPress={handleSendDeleteRequest}
              disabled={submittingDelete}
            >
              <Text style={styles.requestApprovalBtnText}>
                {submittingDelete ? 'Submitting...' : '📨 Send Deletion Request to RSM'}
              </Text>
            </TouchableOpacity>

            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.orText}>OR ENTER RSM PIN</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput
                style={[styles.formInput, { flex: 1 }]}
                placeholder="RSM PIN (0001)"
                value={managerPinInput}
                onChangeText={setManagerPinInput}
                keyboardType="numeric"
                secureTextEntry
              />
              <TouchableOpacity style={styles.authorizeBtn} onPress={handleManagerPinDelete}>
                <Text style={styles.authorizeBtnText}>Authorize</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  docName: { color: colors.textPrimary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.black },
  docQual: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 2 },
  docSpecialty: { color: colors.primaryDark, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  tierBadgeWrapper: { alignItems: 'center' },
  changeTierHint: { fontSize: 10, color: '#2563EB', fontWeight: '700', marginTop: 2 },
  editBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editBtnPillText: { fontSize: 11, fontWeight: '700', color: '#2563EB' },
  editSectionLink: { fontSize: 12, fontWeight: '700', color: '#2563EB' },

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
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalHeaderTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  modalSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 16 },
  modalNotice: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 12 },
  tierOptionsList: { gap: 10, marginBottom: 16 },
  tierOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.sm,
    backgroundColor: '#F8FAFC',
  },
  tierOptionItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  tierOptionLabel: { fontSize: 13, fontWeight: '600', color: '#475569' },
  tierOptionLabelActive: { color: '#2563EB', fontWeight: '800' },
  activeCheck: { color: '#2563EB', fontWeight: '900', fontSize: 14 },
  modalCancelBtn: { alignItems: 'center', paddingVertical: 10 },
  modalCancelText: { color: '#64748B', fontWeight: '700', fontSize: 13 },

  geofenceCardOk: { backgroundColor: colors.successLight, borderColor: colors.success },
  geofenceCardWarn: { backgroundColor: colors.warningLight, borderColor: colors.warning },
  geofenceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  geofenceTitle: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  recheckText: { color: colors.primaryDark, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  geofenceStatusText: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  geofenceDetails: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 4 },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: spacing.xs },
  clinicName: { color: colors.textPrimary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  clinicAddr: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 2 },
  clinicPhone: { color: colors.primary, fontSize: typography.fontSize.sm, marginTop: 4, fontWeight: typography.fontWeight.semibold },
  historyText: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginTop: 3 },
  planToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginTop: spacing.md,
  },
  planToggleBtnActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  planToggleBtnInactive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  planToggleBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  ctaContainer: { marginTop: spacing.md },

  deleteDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
  },
  deleteDoctorText: { color: '#DC2626', fontSize: 13, fontWeight: '700' },

  // Edit form styles
  formInputLabel: { fontSize: 11, fontWeight: '700', color: '#475569', marginTop: 8, marginBottom: 4 },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6, marginBottom: 4 },
  specChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full, backgroundColor: '#F1F5F9' },
  specChipActive: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#2563EB' },
  specChipText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  specChipTextActive: { color: '#2563EB', fontWeight: '800' },
  tierSelectorRow: { flexDirection: 'row', gap: 6, marginTop: 4, marginBottom: 8 },
  tierChip: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.sm, backgroundColor: '#F1F5F9' },
  tierChipActive: { backgroundColor: '#2563EB' },
  tierChipText: { fontSize: 11, color: '#64748B', fontWeight: '700' },
  tierChipTextActive: { color: '#ffffff', fontWeight: '800' },
  saveChangesBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  saveChangesBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },

  // Approval modal styles
  requestApprovalBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 10,
  },
  requestApprovalBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  orDivider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  orText: { fontSize: 10, fontWeight: '800', color: '#94A3B8' },
  authorizeBtn: { backgroundColor: '#0F172A', paddingHorizontal: 16, justifyContent: 'center', borderRadius: radius.sm },
  authorizeBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
});

