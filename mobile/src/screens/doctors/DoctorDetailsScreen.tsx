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
import { Doctor, DoctorClinic, GeofenceStatus, UserProfile } from '../../types';
import { EmployeeService } from '../../services/employeeService';
import { DivisionService } from '../../services/divisionService';

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
  const [editDistrict, setEditDistrict] = useState<'Cachar' | 'Karimganj' | 'Hailakandi' | 'Aizawl' | 'Agartala' | 'Dharmanagar' | 'Tripura'>('Cachar');
  const [editArea, setEditArea] = useState('');

  // Delete Doctor Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteReason, setDeleteReason] = useState('Doctor relocated / chamber closed');
  const [managerPinInput, setManagerPinInput] = useState('');
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [geofenceEval, setGeofenceEval] = useState<{
    status: GeofenceStatus;
    distanceMeters: number;
    accuracyMeters?: number;
    isWithinRadius: boolean;
    accuracyAcceptable?: boolean;
    canStartVisit?: boolean;
    statusText: string;
  }>({
    status: 'NOT_STARTED',
    distanceMeters: 0,
    isWithinRadius: false,
    canStartVisit: false,
    statusText: 'Checking satellite distance...',
  });
  const [checkingLocation, setCheckingLocation] = useState(false);

  // Multi-Chamber State
  const [addClinicModalVisible, setAddClinicModalVisible] = useState(false);
  const [newChamberName, setNewChamberName] = useState('');
  const [newChamberArea, setNewChamberArea] = useState('');
  const [newChamberTiming, setNewChamberTiming] = useState('Evening (5:00 PM - 8:30 PM)');
  const [chamberCoords, setChamberCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [chamberGpsLoading, setChamberGpsLoading] = useState(false);
  const [savingChamber, setSavingChamber] = useState(false);

  // Assign MR State
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [employeesList, setEmployeesList] = useState<UserProfile[]>([]);
  const [mrSearch, setMrSearch] = useState('');
  const [mrDivisionFilter, setMrDivisionFilter] = useState<string>('ALL');
  const [assignMode, setAssignMode] = useState<'PERMANENT' | 'TODAY_ONLY'>('PERMANENT');
  const [assigningLoading, setAssigningLoading] = useState(false);

  const isManager = DivisionService.isManager(currentUser);

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

  // Chamber Handlers
  const handleCaptureChamberGps = async () => {
    setChamberGpsLoading(true);
    try {
      const loc = await LocationService.getCurrentLocation();
      if (loc) {
        if (loc.isMockLocation) {
          LocationService.validateAuthenticGps(loc, 'Chamber Geotagging');
        } else {
          setChamberCoords({ lat: loc.latitude, lng: loc.longitude });
          const autoArea = await LocationService.reverseGeocodeArea(loc.latitude, loc.longitude);
          if (autoArea && !newChamberArea.trim()) {
            setNewChamberArea(autoArea);
          }
        }
      }
    } catch (err) {
      console.warn('GPS chamber capture error:', err);
    } finally {
      setChamberGpsLoading(false);
    }
  };

  const handleSaveChamber = async () => {
    if (!doctor) return;
    if (!newChamberName.trim()) {
      Alert.alert('Required Field', 'Please enter Chamber / Clinic Name.');
      return;
    }
    if (!newChamberArea.trim()) {
      Alert.alert('Required Field', 'Please enter Chamber Address / Area.');
      return;
    }
    const lat = chamberCoords ? chamberCoords.lat : doctor.latitude;
    const lng = chamberCoords ? chamberCoords.lng : doctor.longitude;

    setSavingChamber(true);
    try {
      const updated = await DoctorService.addClinicToDoctor(doctor.id, {
        name: newChamberName.trim(),
        address: `${newChamberName.trim()}, ${newChamberArea.trim()}, ${doctor.district}`,
        area: newChamberArea.trim(),
        latitude: lat,
        longitude: lng,
        timing: newChamberTiming.trim(),
      });

      if (updated) {
        setDoctor(updated);
        setAddClinicModalVisible(false);
        setNewChamberName('');
        setNewChamberArea('');
        setChamberCoords(null);
        Alert.alert('Chamber Added ✅', `${newChamberName.trim()} has been registered. Geofence active for all chambers.`);
        checkGeofence(updated);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add chamber.');
    } finally {
      setSavingChamber(false);
    }
  };

  const handleRemoveClinic = async (clinicId: string, clinicName: string) => {
    if (!doctor) return;
    Alert.alert(
      'Remove Chamber',
      `Are you sure you want to remove "${clinicName}" from this doctor?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = await DoctorService.removeClinicFromDoctor(doctor.id, clinicId);
            if (updated) {
              setDoctor(updated);
              checkGeofence(updated);
              Alert.alert('Chamber Removed', `"${clinicName}" has been removed.`);
            }
          },
        },
      ]
    );
  };

  // Assign MR Handler
  const handleAssignToMR = async (emp: UserProfile) => {
    if (!doctor) return;
    setAssigningLoading(true);
    try {
      if (assignMode === 'PERMANENT') {
        const updated = await DoctorService.assignDoctorToEmployee(doctor.id, emp.id, emp.name);
        if (updated) {
          setDoctor(updated);
          setAssignModalVisible(false);
          Alert.alert('Representative Assigned ✅', `${doctor.name} is now officially assigned to ${emp.name} (${emp.headquarter || emp.territory}).`);
        }
      } else {
        const updated = await DoctorService.updateDoctor(doctor.id, {
          todayVisitStatus: 'PENDING',
          assignedToEmployeeId: emp.id,
          assignedToEmployeeName: emp.name,
        });
        if (updated) {
          setDoctor(updated);
          setAssignModalVisible(false);
          Alert.alert('Today\'s Visit Delegated ✅', `Today\'s call for ${doctor.name} has been delegated to ${emp.name}.`);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update assignment.');
    } finally {
      setAssigningLoading(false);
    }
  };

  const filteredEmployees = employeesList.filter((e) => {
    const matchRole = e.role === 'MEDICAL_REP' || e.role === 'AREA_MANAGER' || e.role === 'REGIONAL_MANAGER';
    if (!matchRole) return false;

    if (mrDivisionFilter !== 'ALL') {
      const terr = (e.territory || '').toLowerCase();
      const hq = (e.headquarter || '').toLowerCase();
      const target = mrDivisionFilter.toLowerCase();
      if (!terr.includes(target) && !hq.includes(target)) {
        return false;
      }
    }

    if (mrSearch.trim()) {
      const q = mrSearch.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        (e.employeeCode && e.employeeCode.toLowerCase().includes(q)) ||
        (e.phone && e.phone.includes(q))
      );
    }
    return true;
  });

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

        {/* Registered Chambers & Clinics Card */}
        {(() => {
          const doctorClinics: DoctorClinic[] = (doctor.clinics && doctor.clinics.length > 0)
            ? doctor.clinics
            : [{
                id: 'clinic-primary',
                name: doctor.clinicName,
                address: doctor.clinicAddress,
                area: doctor.area,
                latitude: doctor.latitude,
                longitude: doctor.longitude,
                isPrimary: true,
              }];

          return (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Chambers & Clinics ({doctorClinics.length})</Text>
                  <Text style={{ fontSize: 11, color: '#64748B' }}>Geofence verified across all registered chambers</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity
                    style={styles.addChamberBtn}
                    onPress={() => {
                      setNewChamberName('');
                      setNewChamberArea('');
                      setChamberCoords(null);
                      setAddClinicModalVisible(true);
                    }}
                  >
                    <Ionicons name="add-circle" size={15} color="#2563EB" />
                    <Text style={styles.addChamberBtnText}>+ Chamber</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editSectionLinkBtn} onPress={handleOpenEdit}>
                    <Text style={styles.editSectionLink}>✏️ Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {doctorClinics.map((c, idx) => (
                <View key={c.id || idx} style={styles.clinicItemBox}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Text style={styles.clinicItemTitle}>🏥 {c.name}</Text>
                      {c.isPrimary && (
                        <View style={styles.primaryBadge}>
                          <Text style={styles.primaryBadgeText}>Primary</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.clinicItemAddr}>{c.address || c.area}</Text>
                    {c.timing ? <Text style={styles.clinicItemTiming}>🕒 {c.timing}</Text> : null}
                    <Text style={styles.clinicItemCoords}>
                      📍 Coordinates: {c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}
                    </Text>
                  </View>
                  {!c.isPrimary && (
                    <TouchableOpacity
                      style={{ padding: 6 }}
                      onPress={() => handleRemoveClinic(c.id, c.name)}
                    >
                      <Ionicons name="trash-outline" size={17} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <Text style={[styles.clinicPhone, { marginTop: 10 }]}>📞 Phone: {doctor.phone}</Text>
            </Card>
          );
        })()}

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
                : geofenceEval.canStartVisit
                ? "✓ Start Geofence Verified Visit"
                : !geofenceEval.isWithinRadius
                ? `🚫 Out of Range (${Math.round(geofenceEval.distanceMeters)}m Away)`
                : `📡 Weak GPS Signal (±${Math.round(geofenceEval.accuracyMeters || 0)}m)`
            }
            onPress={() => {
              if (doctor.todayVisitStatus === 'COMPLETED') {
                Alert.alert('Visit Done', `You have already logged today's visit for ${doctor.name}.`);
                return;
              }
              if (geofenceEval.canStartVisit) {
                onStartVisit(doctor, true, geofenceEval.distanceMeters);
              } else if (!geofenceEval.isWithinRadius) {
                Alert.alert(
                  'Visit Blocked - Out of 100m Range 🚫',
                  `You are currently ${Math.round(geofenceEval.distanceMeters)}m away from ${doctor.clinicName}.\n\nRepPulse requires you to be physically within the 100-meter clinic perimeter to start and complete this visit.`
                );
              } else {
                Alert.alert(
                  'Weak GPS Satellite Signal 📡',
                  `You are within the clinic perimeter (${Math.round(geofenceEval.distanceMeters)}m), but phone GPS satellite accuracy is currently ±${Math.round(geofenceEval.accuracyMeters || 0)}m.\n\nPlease step near a window or open door for a few seconds to get a stronger satellite lock.`
                );
              }
            }}
            variant={geofenceEval.canStartVisit && doctor.todayVisitStatus !== 'COMPLETED' ? "primary" : "secondary"}
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
              <View style={[styles.tierSelectorRow, { flexWrap: 'wrap' }]}>
                {(['Cachar', 'Karimganj', 'Hailakandi', 'Aizawl', 'Agartala', 'Dharmanagar'] as const).map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.tierChip, editDistrict === d && styles.tierChipActive]}
                    onPress={() => setEditDistrict(d)}
                  >
                    <Text style={[styles.tierChipText, editDistrict === d && styles.tierChipTextActive]}>
                      {d === 'Cachar' ? 'Silchar' : d === 'Agartala' ? 'Agartala HQ' : d === 'Dharmanagar' ? 'Dharmanagar HQ' : d}
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
    {/* Add Chamber / Clinic Modal */}
      <Modal visible={addClinicModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%' }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="business" size={20} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>Add Another Chamber</Text>
              </View>
              <TouchableOpacity onPress={() => setAddClinicModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>
                Register additional chamber for {doctor?.name}. Geofencing will automatically detect and verify visits at this location.
              </Text>

              <Text style={styles.formInputLabel}>Chamber / Clinic Name *</Text>
              <TextInput
                style={styles.formInput}
                value={newChamberName}
                onChangeText={setNewChamberName}
                placeholder="e.g. Lifeline Polyclinic / Evening Chamber"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.formInputLabel}>Address / Area / Landmark *</Text>
              <TextInput
                style={styles.formInput}
                value={newChamberArea}
                onChangeText={setNewChamberArea}
                placeholder="e.g. Station Road, Hospital Chowmuhani"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.formInputLabel}>Visiting Timings / Schedule</Text>
              <TextInput
                style={styles.formInput}
                value={newChamberTiming}
                onChangeText={setNewChamberTiming}
                placeholder="e.g. Evening 5:00 PM - 8:30 PM (Mon-Sat)"
                placeholderTextColor="#94A3B8"
              />

              {/* Geotagging button */}
              <View style={styles.gpsCaptureCard}>
                <Text style={styles.gpsCaptureTitle}>Chamber GPS Geotagging</Text>
                <Text style={styles.gpsCaptureSub}>
                  {chamberCoords
                    ? `📍 Geotagged: ${chamberCoords.lat.toFixed(5)}, ${chamberCoords.lng.toFixed(5)}`
                    : 'Capture current device location as chamber GPS coordinates.'}
                </Text>
                <TouchableOpacity
                  style={[styles.captureGpsBtn, chamberGpsLoading && { opacity: 0.7 }]}
                  onPress={handleCaptureChamberGps}
                  disabled={chamberGpsLoading}
                >
                  <Ionicons name="location" size={16} color="#FFF" />
                  <Text style={styles.captureGpsBtnText}>
                    {chamberGpsLoading ? 'Acquiring GPS Fix...' : chamberCoords ? '↻ Retake Chamber GPS' : '📍 Capture Current Location'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.saveChangesBtn, savingChamber && { opacity: 0.7 }]}
                onPress={handleSaveChamber}
                disabled={savingChamber}
              >
                <Text style={styles.saveChangesBtnText}>
                  {savingChamber ? 'Saving...' : 'Save Chamber & Activate Geofence'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assign Doctor to Representative Modal (RSM / Manager Feature) */}
      <Modal visible={assignModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%' }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="person-add" size={20} color={colors.primary} />
                <Text style={styles.modalHeaderTitle}>Assign Doctor to MR</Text>
              </View>
              <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Assign <Text style={{ fontWeight: '700', color: '#0F172A' }}>{doctor?.name}</Text> ({doctor?.district}) to a field representative.
            </Text>

            {/* Assignment Mode Pills */}
            <View style={styles.assignModeRow}>
              <TouchableOpacity
                style={[styles.assignModePill, assignMode === 'PERMANENT' && styles.assignModePillActive]}
                onPress={() => setAssignMode('PERMANENT')}
              >
                <Text style={[styles.assignModePillText, assignMode === 'PERMANENT' && styles.assignModePillTextActive]}>
                  Permanent Beat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.assignModePill, assignMode === 'TODAY_ONLY' && styles.assignModePillActive]}
                onPress={() => setAssignMode('TODAY_ONLY')}
              >
                <Text style={[styles.assignModePillText, assignMode === 'TODAY_ONLY' && styles.assignModePillTextActive]}>
                  Today\'s Call Only
                </Text>
              </TouchableOpacity>
            </View>

            {/* Division Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginVertical: 8 }}>
              {['ALL', 'Dharmanagar', 'Agartala', 'Karimganj', 'Hailakandi', 'Cachar', 'Aizawl'].map((div) => (
                <TouchableOpacity
                  key={div}
                  style={[styles.mrDivChip, mrDivisionFilter === div && styles.mrDivChipActive]}
                  onPress={() => setMrDivisionFilter(div)}
                >
                  <Text style={[styles.mrDivChipText, mrDivisionFilter === div && styles.mrDivChipTextActive]}>
                    {div === 'Cachar' ? 'Silchar' : div}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Search MR */}
            <View style={styles.mrSearchBox}>
              <Ionicons name="search" size={16} color="#64748B" />
              <TextInput
                style={styles.mrSearchInput}
                placeholder="Search MR by name, code, phone..."
                placeholderTextColor="#94A3B8"
                value={mrSearch}
                onChangeText={setMrSearch}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280, marginTop: 8 }}>
              {filteredEmployees.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#94A3B8', fontSize: 13 }}>No representatives match filter.</Text>
                </View>
              ) : (
                filteredEmployees.map((emp) => {
                  const isCurrent = doctor?.assignedToEmployeeId === emp.id || doctor?.assignedToEmployeeName === emp.name;
                  return (
                    <TouchableOpacity
                      key={emp.id}
                      style={[styles.empSelectItem, isCurrent && styles.empSelectItemCurrent]}
                      onPress={() => handleAssignToMR(emp)}
                      disabled={assigningLoading}
                    >
                      <View style={styles.empAvatar}>
                        <Text style={styles.empAvatarText}>{emp.name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.empSelectName}>{emp.name}</Text>
                          {isCurrent && (
                            <View style={styles.currentTag}>
                              <Text style={styles.currentTagText}>Current</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.empSelectMeta}>
                          {emp.employeeCode} • {emp.headquarter || emp.territory || 'Field Rep'}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
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

  // Multi-Chamber & Assignment Styles
  assignedRepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  assignedRepText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  reassignBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  reassignBtnPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  addChamberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addChamberBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  editSectionLinkBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clinicItemBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  clinicItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  primaryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E40AF',
  },
  clinicItemAddr: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  clinicItemTiming: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '600',
    marginTop: 2,
  },
  clinicItemCoords: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  gpsCaptureCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  gpsCaptureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  gpsCaptureSub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
    marginBottom: 8,
  },
  captureGpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  captureGpsBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  assignModeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  assignModePill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  assignModePillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  assignModePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  assignModePillTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  mrDivChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  mrDivChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  mrDivChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  mrDivChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  mrSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    marginTop: 4,
  },
  mrSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    padding: 0,
  },
  empSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    marginBottom: 6,
  },
  empSelectItemCurrent: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F9FF',
  },
  empAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empAvatarText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  empSelectName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  empSelectMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  currentTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  currentTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E40AF',
  },
});
