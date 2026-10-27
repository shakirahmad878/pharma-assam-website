import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { VisitService } from '../../services/visitService';
import { DoctorService } from '../../services/doctorService';
import { AuthService } from '../../services/authService';
import { MOCK_PRODUCTS, CURRENT_USER } from '../../constants/mockData';
import { Doctor, AccompaniedPerson, VisitRecord } from '../../types';

interface VisitExecutionScreenProps {
  doctor: Doctor;
  isGeofenceVerified: boolean;
  distanceMeters: number;
  onBack: () => void;
  onVisitComplete: () => void;
}

export const VisitExecutionScreen: React.FC<VisitExecutionScreenProps> = ({
  doctor,
  isGeofenceVerified,
  distanceMeters,
  onBack,
  onVisitComplete,
}) => {
  // Joint Working / Accompanied Personnel
  const [accompaniedBy, setAccompaniedBy] = useState<AccompaniedPerson>('SELF_SOLO');
  
  // Call Purpose & Feedback
  const [visitPurpose, setVisitPurpose] = useState<VisitRecord['visitPurpose']>('ROUTINE_CALL');
  const [prescribingHabit, setPrescribingHabit] = useState<VisitRecord['doctorPrescribingHabit']>('CORE_PRESCRIBER');
  
  // Products Detailed (Multi-select)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(['prod-01']);
  const [productReactions, setProductReactions] = useState<{ [id: string]: 'HIGH_INTEREST' | 'MODERATE' | 'NEUTRAL' }>({
    'prod-01': 'HIGH_INTEREST',
  });

  // Samples & Inputs
  const [sampleQuantities, setSampleQuantities] = useState<{ [id: string]: number }>({
    'prod-01': 2,
  });
  const [selectedInputs, setSelectedInputs] = useState<string[]>(['Visual Aid Flipchart', 'Prescription Pad']);
  
  // Discussion Notes
  const [discussionNotes, setDiscussionNotes] = useState('');
  const [doctorFeedback, setDoctorFeedback] = useState('');
  const [pobAmount, setPobAmount] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('22 Sep 2026');

  // Visit Timer
  const [durationMinutes, setDurationMinutes] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  const toggleProduct = (prodId: string) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
      setProductReactions({ ...productReactions, [prodId]: 'HIGH_INTEREST' });
    }
  };

  const setReaction = (prodId: string, reaction: 'HIGH_INTEREST' | 'MODERATE' | 'NEUTRAL') => {
    setProductReactions({ ...productReactions, [prodId]: reaction });
  };

  const updateSampleQty = (prodId: string, delta: number) => {
    const current = sampleQuantities[prodId] || 0;
    const next = Math.max(0, current + delta);
    setSampleQuantities({ ...sampleQuantities, [prodId]: next });
  };

  const toggleInput = (inputName: string) => {
    if (selectedInputs.includes(inputName)) {
      setSelectedInputs(selectedInputs.filter(i => i !== inputName));
    } else {
      setSelectedInputs([...selectedInputs, inputName]);
    }
  };

  const getAccompaniedName = (p: AccompaniedPerson) => {
    switch (p) {
      case 'ABM_G_SOLANKI': return 'G Solanki (ABM)';
      case 'RBM_RAJESH_SHARMA': return 'Rajesh Sharma (RBM)';
      case 'COLLEAGUE_AMIT_PAUL': return 'Amit Paul (Co-MR)';
      case 'PRODUCT_SPECIALIST': return 'Dr. Sengupta (Medical Advisor)';
      default: return 'Self (Solo Working)';
    }
  };

  const handleSubmitVisit = async () => {
    if (!isGeofenceVerified || distanceMeters > (doctor.geofenceRadiusMeters || 100)) {
      Alert.alert(
        'Visit Blocked - Out of Range 🚫',
        `Cannot complete DCR call. You are currently ${Math.round(distanceMeters)}m away from ${doctor.clinicName}.\n\nRepPulse requires you to be physically within the 100-meter clinic perimeter to complete this visit.`
      );
      return;
    }

    if (selectedProductIds.length === 0) {
      Alert.alert('Selection Required', 'Please select at least 1 product detailed to the doctor.');
      return;
    }

    setSubmitting(true);

    const detailedProducts = MOCK_PRODUCTS.filter(p => selectedProductIds.includes(p.id));
    const reactions = detailedProducts.map(p => ({
      productId: p.id,
      productName: p.brandName,
      reaction: productReactions[p.id] || 'HIGH_INTEREST',
    }));

    const samples = Object.keys(sampleQuantities)
      .filter(id => (sampleQuantities[id] || 0) > 0)
      .map(id => {
        const prod = MOCK_PRODUCTS.find(p => p.id === id);
        return {
          productId: id,
          productName: prod ? prod.brandName : id,
          quantity: sampleQuantities[id],
          batchNumber: 'B-' + id.substring(0, 4) + '-26',
        };
      });

    await VisitService.recordVisit({
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicName: doctor.clinicName,
      employeeId: (AuthService.getCurrentUser() || CURRENT_USER).id,
      employeeName: (AuthService.getCurrentUser() || CURRENT_USER).name,
      accompaniedBy,
      accompaniedName: getAccompaniedName(accompaniedBy),
      routeId: doctor.routeId,
      routeName: doctor.area,
      date: new Date().toISOString().split('T')[0],
      checkInTimestamp: new Date(Date.now() - durationMinutes * 60000).toISOString(),
      checkInLatitude: doctor.latitude,
      checkInLongitude: doctor.longitude,
      checkInAccuracyMeters: 14,
      checkInDistanceMeters: distanceMeters,
      isGeofenceVerified,
      checkOutTimestamp: new Date().toISOString(),
      checkOutLatitude: doctor.latitude,
      checkOutLongitude: doctor.longitude,
      visitDurationMinutes: durationMinutes,
      visitPurpose,
      discussionNotes: discussionNotes.trim() || 'Detailed core cardiology and antibiotic portfolio. Doctor confirmed regular prescription support.',
      productsDiscussed: detailedProducts.map(p => p.brandName),
      productReactions: reactions,
      samplesDistributed: samples,
      promotionalInputsGiven: selectedInputs,
      doctorPrescribingHabit: prescribingHabit,
      doctorFeedback: doctorFeedback.trim() || 'Positive response to CardioPulse-AM and CefoPulse-CV.',
      nextFollowUpDate: nextVisitDate,
      pobAmount: pobAmount ? parseFloat(pobAmount) : undefined,
      status: 'COMPLETED',
    });

    await DoctorService.updateDoctorTodayStatus(doctor.id, 'COMPLETED');

    setSubmitting(false);
    Alert.alert(
      'Visit Logged Successfully',
      'Daily Call Report (DCR) for ' + doctor.name + ' has been saved and queued for sync.',
      [{ text: 'OK', onPress: onVisitComplete }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="DCR Call Execution"
        subtitle={doctor.name + ' • ' + doctor.specialty}
        showBack
        onBack={onBack}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Doctor & Geofence Status Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroDocName}>{doctor.name}</Text>
              <Text style={styles.heroDocSpecialty}>{doctor.qualification}</Text>
              <Text style={styles.heroClinic}>🏥 {doctor.clinicName}</Text>
              <Text style={styles.heroArea}>📍 {doctor.clinicAddress}</Text>
            </View>
            <Badge
              label={isGeofenceVerified ? '100m Geofence Verified' : 'Within Range'}
              variant={isGeofenceVerified ? 'success' : 'primary'}
            />
          </View>
        </View>

        {/* 1. Accompanied By / Joint Working Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👥 Accompanied By (Joint Working)</Text>
          <Text style={styles.sectionSubtitle}>Select if manager or colleague is accompanying this call</Text>

          <View style={styles.optionsWrap}>
            {([
              { key: 'SELF_SOLO', label: '👤 Self (Solo Working)' },
              { key: 'ABM_G_SOLANKI', label: '👔 ABM - G Solanki' },
              { key: 'RBM_RAJESH_SHARMA', label: '⭐ RBM - Rajesh Sharma' },
              { key: 'COLLEAGUE_AMIT_PAUL', label: '🤝 Co-MR - Amit Paul' },
              { key: 'PRODUCT_SPECIALIST', label: '🩺 Medical Advisor' },
            ] as const).map(item => (
              <TouchableOpacity
                key={item.key}
                style={[styles.chipButton, accompaniedBy === item.key && styles.chipButtonActive]}
                onPress={() => setAccompaniedBy(item.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, accompaniedBy === item.key && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. Call Purpose Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎯 Call Objective & Type</Text>
          <View style={styles.optionsWrap}>
            {([
              { key: 'ROUTINE_CALL', label: 'Routine Detailing Call' },
              { key: 'JOINT_STRATEGIC_CALL', label: 'Joint Strategic Call' },
              { key: 'NEW_LAUNCH_DETAILED', label: 'New Product Launch (NPL)' },
              { key: 'CME_ENGAGEMENT', label: 'CME / Doctor Invitation' },
              { key: 'SAMPLE_DELIVERY', label: 'Sample & Literature Delivery' },
              { key: 'PAYMENT_FOLLOWUP', label: 'POB / Payment Follow-up' },
            ] as const).map(item => (
              <TouchableOpacity
                key={item.key}
                style={[styles.chipButton, visitPurpose === item.key && styles.chipButtonActive]}
                onPress={() => setVisitPurpose(item.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, visitPurpose === item.key && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Products Detailed & Doctor Reaction */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💊 Products Detailed (Multi-Select)</Text>
          <Text style={styles.sectionSubtitle}>Select products presented during detailing and record doctor reaction</Text>

          {MOCK_PRODUCTS.map(prod => {
            const isSelected = selectedProductIds.includes(prod.id);
            const reaction = productReactions[prod.id] || 'HIGH_INTEREST';
            return (
              <View key={prod.id} style={[styles.productRowCard, isSelected && styles.productRowCardActive]}>
                <TouchableOpacity
                  style={styles.productCheckRow}
                  onPress={() => toggleProduct(prod.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    <Text style={styles.checkIcon}>{isSelected ? '✓' : ''}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prodBrand}>{prod.brandName}</Text>
                    <Text style={styles.prodGeneric}>{prod.genericName} • {prod.category}</Text>
                  </View>
                </TouchableOpacity>

                {isSelected && (
                  <View style={styles.reactionContainer}>
                    <Text style={styles.reactionLabel}>Doctor Reaction:</Text>
                    <View style={styles.reactionRow}>
                      {(['HIGH_INTEREST', 'MODERATE', 'NEUTRAL'] as const).map(r => (
                        <TouchableOpacity
                          key={r}
                          style={[styles.reactionBtn, reaction === r && styles.reactionBtnActive]}
                          onPress={() => setReaction(prod.id, r)}
                        >
                          <Text style={[styles.reactionText, reaction === r && styles.reactionTextActive]}>
                            {r === 'HIGH_INTEREST' ? '🔥 High Interest' : r === 'MODERATE' ? '👍 Moderate' : '🤔 Neutral'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* 4. Samples Distributed */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🧪 Samples Distributed</Text>
          <Text style={styles.sectionSubtitle}>Enter physician sample unit quantities given</Text>

          {MOCK_PRODUCTS.slice(0, 4).map(prod => {
            const qty = sampleQuantities[prod.id] || 0;
            return (
              <View key={prod.id} style={styles.sampleRow}>
                <Text style={styles.sampleName}>{prod.brandName}</Text>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => updateSampleQty(prod.id, -1)}
                  >
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepVal}>{qty}</Text>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => updateSampleQty(prod.id, 1)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* 5. Promotional Inputs & LBLs */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎁 Promotional Inputs / LBL Given</Text>
          <View style={styles.optionsWrap}>
            {[
              'Visual Aid Flipchart',
              'Prescription Pad',
              'Clinical Study Monograph',
              'Medical Pen & Notepad',
              'Brand Reminder LBL',
              'Patient Education Leaflet',
            ].map(inputItem => {
              const isGiven = selectedInputs.includes(inputItem);
              return (
                <TouchableOpacity
                  key={inputItem}
                  style={[styles.chipButton, isGiven && styles.chipButtonActive]}
                  onPress={() => toggleInput(inputItem)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isGiven && styles.chipTextActive]}>
                    {isGiven ? '✓ ' + inputItem : inputItem}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 6. Doctor Prescribing Habit & Commitment */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⭐ Doctor Prescribing Status</Text>
          <View style={styles.optionsWrap}>
            {([
              { key: 'CORE_PRESCRIBER', label: '⭐ Core Regular Prescriber' },
              { key: 'COMPETITOR_SWITCHED', label: '🔄 Switched from Competitor' },
              { key: 'NEW_TRIAL_PROMISED', label: '🧪 New Trial Rx Promised' },
              { key: 'FOLLOWUP_REQUIRED', label: '⚠️ Follow-up Required' },
            ] as const).map(item => (
              <TouchableOpacity
                key={item.key}
                style={[styles.chipButton, prescribingHabit === item.key && styles.chipButtonActive]}
                onPress={() => setPrescribingHabit(item.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, prescribingHabit === item.key && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 7. Discussion Notes & Secondary Order */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📝 Discussion Notes & Feedback</Text>
          
          <Text style={styles.inputLbl}>Clinical Discussion Summary:</Text>
          <TextInput
            style={styles.textInputArea}
            placeholder="Key discussion points, dosage questions, efficacy feedback..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={discussionNotes}
            onChangeText={setDiscussionNotes}
          />

          <Text style={styles.inputLbl}>Secondary POB Order Value (if booked during call):</Text>
          <TextInput
            style={styles.textInputSingle}
            placeholder="e.g. 3500.00"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={pobAmount}
            onChangeText={setPobAmount}
          />
        </View>

        {/* Submit DCR Visit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmitVisit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Saving Call Record...' : '✓ Complete & Log DCR Call'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.card,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroDocName: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  heroDocSpecialty: { fontSize: typography.fontSize.xs, color: '#2563EB', marginTop: 2, fontWeight: typography.fontWeight.semibold },
  heroClinic: { fontSize: typography.fontSize.xs, color: '#334155', marginTop: 4, fontWeight: typography.fontWeight.medium },
  heroArea: { fontSize: typography.fontSize.xxs, color: '#64748B', marginTop: 2 },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  sectionTitle: { fontSize: typography.fontSize.sm + 1, fontWeight: typography.fontWeight.bold, color: '#0F172A', marginBottom: 2 },
  sectionSubtitle: { fontSize: typography.fontSize.xs, color: '#64748B', marginBottom: spacing.md },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 2 },
  chipButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  chipText: { fontSize: typography.fontSize.xs, color: '#334155', fontWeight: typography.fontWeight.semibold },
  chipTextActive: { color: '#FFFFFF', fontWeight: typography.fontWeight.bold },
  productRowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productRowCardActive: {
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  productCheckRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  prodBrand: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: '#0F172A' },
  prodGeneric: { fontSize: typography.fontSize.xxs, color: '#64748B', marginTop: 2 },
  reactionContainer: { marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: '#DBEAFE' },
  reactionLabel: { fontSize: typography.fontSize.xxs, color: '#64748B', fontWeight: typography.fontWeight.semibold, marginBottom: 4 },
  reactionRow: { flexDirection: 'row', gap: spacing.xs },
  reactionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  reactionBtnActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  reactionText: { fontSize: typography.fontSize.xxs, color: '#334155', fontWeight: typography.fontWeight.bold },
  reactionTextActive: { color: '#FFFFFF' },
  sampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sampleName: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: '#1E3A8A' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: radius.md, padding: 2 },
  stepBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: radius.sm },
  stepBtnText: { fontSize: 16, fontWeight: 'bold', color: '#1D4ED8' },
  stepVal: { width: 36, textAlign: 'center', fontWeight: 'bold', fontSize: typography.fontSize.sm, color: '#0F172A' },
  inputLbl: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: '#475569', marginTop: spacing.sm, marginBottom: 4 },
  textInputArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.xs,
    color: '#0F172A',
    height: 70,
    textAlignVertical: 'top',
  },
  textInputSingle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
    color: '#0F172A',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.floating,
  },
  submitButtonDisabled: { backgroundColor: '#94A3B8' },
  submitButtonText: { color: '#FFFFFF', fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
});
