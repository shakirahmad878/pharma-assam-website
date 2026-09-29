import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { DoctorService } from '../../services/doctorService';
import { LocationService } from '../../services/location/locationService';
import { GeofenceService } from '../../services/location/geofenceService';
import { Doctor, GeofenceStatus } from '../../types';

interface DoctorDetailsScreenProps {
  doctorId: string;
  onBack: () => void;
  onStartVisit: (doctor: Doctor, isGeofenceOk: boolean, distanceMeters: number) => void;
}

export const DoctorDetailsScreen: React.FC<DoctorDetailsScreenProps> = ({
  doctorId,
  onBack,
  onStartVisit,
}) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [tierModalVisible, setTierModalVisible] = useState(false);
  const [geofenceEval, setGeofenceEval] = useState<{
    status: GeofenceStatus;
    distanceMeters: number;
    isWithinRadius: boolean;
    statusText: string;
  }>({
    status: 'NOT_STARTED',
    distanceMeters: 0,
    isWithinRadius: false,
    statusText: 'Checking satellite distance...'
  });
  const [checkingLocation, setCheckingLocation] = useState(false);

  useEffect(() => {
    DoctorService.getDoctorById(doctorId).then(doc => {
      setDoctor(doc);
      if (doc) checkGeofence(doc);
    });
  }, [doctorId]);

  const checkGeofence = async (doc: Doctor) => {
    setCheckingLocation(true);
    const loc = await LocationService.getCurrentLocation();
    setCheckingLocation(false);

    if (loc) {
      const evaluation = GeofenceService.evaluateGeofence(
        doc.latitude,
        doc.longitude,
        loc.latitude,
        loc.longitude,
        loc.accuracyMeters,
        doc.geofenceRadiusMeters
      );
      setGeofenceEval(evaluation);
    } else {
      setGeofenceEval({
        status: 'LOCATION_ACCURACY_LOW',
        distanceMeters: 0,
        isWithinRadius: false,
        statusText: 'GPS fix unavailable. Please check location permissions.'
      });
    }
  };

  if (!doctor) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={doctor.name} subtitle={doctor.specialty} showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Card */}
        <Card>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doctor.name}</Text>
              <Text style={styles.docQual}>{doctor.qualification}</Text>
              <Text style={styles.docSpecialty}>Specialty: {doctor.specialty}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setTierModalVisible(true)}
              style={styles.tierBadgeWrapper}
            >
              <Badge
                label={doctor.tier === 'A_PLUS' ? 'Tier A+' : `Tier ${doctor.tier}`}
                variant="primary"
              />
              <Text style={styles.changeTierHint}>✏️ Change</Text>
            </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>Clinic Information</Text>
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

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <Button
            title={
              geofenceEval.isWithinRadius
                ? "✓ Start Geofence Verified Visit"
                : `🚫 Out of Range (${Math.round(geofenceEval.distanceMeters)}m Away)`
            }
            onPress={() => {
              if (geofenceEval.isWithinRadius) {
                onStartVisit(doctor, true, geofenceEval.distanceMeters);
              } else {
                Alert.alert(
                  'Visit Blocked - Out of 100m Range 🚫',
                  `You are currently ${Math.round(geofenceEval.distanceMeters)}m away from ${doctor.clinicName}.\n\nRepPulse requires you to be physically within the 100-meter clinic perimeter to start and complete this visit.`
                );
              }
            }}
            variant={geofenceEval.isWithinRadius ? "primary" : "secondary"}
          />
        </View>
      </ScrollView>
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
  changeTierHint: { fontSize: 10, color: '#2563EB', fontWeight: '700', marginTop: 4 },

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
    maxWidth: 360,
    ...shadows.lg,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  modalSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 16 },
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
  ctaContainer: { marginTop: spacing.md },
});
