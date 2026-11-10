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
  Linking,
} from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { VisitService } from '../../services/visitService';
import { DoctorService } from '../../services/doctorService';
import { AuthService } from '../../services/authService';
import { MOCK_PRODUCTS, CURRENT_USER } from '../../constants/mockData';
import { Doctor, AccompaniedPerson, VisitRecord, VisitObjective } from '../../types';

interface VisitExecutionScreenProps {
  doctor?: Doctor;
  chemist?: any;
  customerType?: 'DOCTOR' | 'CHEMIST';
  isGeofenceVerified?: boolean;
  distanceMeters?: number;
  matchedChamber?: { id?: string; name: string; latitude: number; longitude: number; address?: string; area?: string };
  onBack: () => void;
  onVisitComplete: () => void;
}

const VISIT_OBJECTIVES: { id: VisitObjective; label: string }[] = [
  { id: 'PRODUCT_PROMOTION', label: 'Product Promotion' },
  { id: 'NEW_LAUNCH', label: 'New Launch Detailing' },
  { id: 'ORDER_BOOKING', label: 'POB Order Booking' },
  { id: 'PRESCRIPTION_FEEDBACK', label: 'Prescription Feedback' },
  { id: 'FOLLOW_UP', label: 'Follow-up Call' },
  { id: 'PAYMENT_COLLECTION', label: 'Payment / Ledger Check' },
  { id: 'RELATIONSHIP_MANAGEMENT', label: 'Relationship Management' },
];

export const VisitExecutionScreen: React.FC<VisitExecutionScreenProps> = ({
  doctor,
  chemist,
  customerType = doctor ? 'DOCTOR' : 'CHEMIST',
  isGeofenceVerified = true,
  distanceMeters = 0,
  matchedChamber,
  onBack,
  onVisitComplete,
}) => {
  const isDoctor = customerType === 'DOCTOR' && !!doctor;

  const customerName = isDoctor ? doctor!.name : (chemist?.name || chemist?.shopName || 'Chemist Shop');
  const customerSubtitle = isDoctor
    ? `${doctor!.qualification || 'MBBS'} • ${doctor!.specialty || 'General Practitioner'}`
    : `${chemist?.type || 'Retail Pharmacy'} • Contact: ${chemist?.contactPerson || 'Proprietor'}`;

  const activeChamber = matchedChamber || {
    name: isDoctor ? doctor!.clinicName : (chemist?.name || chemist?.shopName || 'Shop Location'),
    latitude: isDoctor ? doctor!.latitude : (chemist?.latitude || 24.8333),
    longitude: isDoctor ? doctor!.longitude : (chemist?.longitude || 92.7789),
    address: isDoctor ? doctor!.clinicAddress : (chemist?.address || 'Market Area'),
    area: isDoctor ? doctor!.area : (chemist?.area || 'Cachar'),
  };

  // Joint Working / Accompanied Personnel
  const [accompaniedBy, setAccompaniedBy] = useState<AccompaniedPerson>('SELF_SOLO');
  
  // Visit Objective
  const [visitObjective, setVisitObjective] = useState<VisitObjective>(
    isDoctor ? 'PRODUCT_PROMOTION' : 'ORDER_BOOKING'
  );
  const [prescribingHabit, setPrescribingHabit] = useState<VisitRecord['doctorPrescribingHabit']>('CORE_PRESCRIBER');
  
  // Products Detailed (Multi-select)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productReactions, setProductReactions] = useState<{ [id: string]: 'HIGH_INTEREST' | 'MODERATE' | 'NEUTRAL' }>({});

  // Samples & Inputs
  const [sampleQuantities, setSampleQuantities] = useState<{ [id: string]: number }>({});
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  
  // Discussion Notes & Feedback
  const [discussionNotes, setDiscussionNotes] = useState('');
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [pobAmount, setPobAmount] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');

  // Visit Timer
  const [durationMinutes, setDurationMinutes] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDurationMinutes(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const openInGoogleMaps = () => {
    const lat = activeChamber.latitude;
    const lng = activeChamber.longitude;
    const label = encodeURIComponent(activeChamber.name);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${label}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Unable to Open Navigation', 'Could not open Google Maps navigation on this device.');
    });
  };

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
    const activeChamberName = activeChamber.name;
    const activeChamberLat = activeChamber.latitude;
    const activeChamberLng = activeChamber.longitude;

    if (isDoctor && (!isGeofenceVerified || distanceMeters > (doctor!.geofenceRadiusMeters || 100))) {
      Alert.alert(
        'Visit Blocked - Out of Range 🚫',
        `Cannot complete DCR call. You are currently ${Math.round(distanceMeters)}m away from ${activeChamberName}.\n\nRepPulse requires you to be physically within the perimeter to complete this visit.`
      );
      return;
    }

    if (isDoctor && selectedProductIds.length === 0) {
      Alert.alert('Selection Required', 'Please select at least 1 product detailed to the doctor.');
      return;
    }

    if (!customerFeedback.trim() && !discussionNotes.trim()) {
      Alert.alert(
        'Feedback / Remarks Mandatory 📝',
        'Please enter discussion notes or customer feedback before completing this call.'
      );
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

    const user = AuthService.getCurrentUser() || CURRENT_USER;

    await VisitService.recordVisit({
      customerType,
      doctorId: isDoctor ? doctor!.id : undefined,
      doctorName: isDoctor ? doctor!.name : undefined,
      clinicName: activeChamberName,
      chemistId: !isDoctor ? (chemist?.id || `chem_${chemist?.name}`) : undefined,
      chemistName: !isDoctor ? customerName : undefined,
      employeeId: user.id,
      employeeName: user.name,
      accompaniedBy,
      accompaniedName: getAccompaniedName(accompaniedBy),
      routeId: isDoctor ? doctor!.routeId : chemist?.routeId,
      routeName: activeChamber.area,
      date: new Date().toISOString().split('T')[0],
      checkInTimestamp: new Date(Date.now() - durationMinutes * 60000).toISOString(),
      checkInLatitude: activeChamberLat,
      checkInLongitude: activeChamberLng,
      checkInAccuracyMeters: 14,
      checkInDistanceMeters: distanceMeters,
      isGeofenceVerified,
      checkOutTimestamp: new Date().toISOString(),
      checkOutLatitude: activeChamberLat,
      checkOutLongitude: activeChamberLng,
      visitDurationMinutes: durationMinutes,
      visitPurpose: 'ROUTINE_CALL',
      visitObjective,
      discussionNotes: discussionNotes.trim(),
      productsDiscussed: detailedProducts.map(p => p.brandName),
      productReactions: reactions,
      samplesDistributed: samples,
      promotionalInputsGiven: selectedInputs,
      doctorPrescribingHabit: isDoctor ? prescribingHabit : undefined,
      doctorFeedback: customerFeedback.trim(),
      nextFollowUpDate: nextVisitDate || undefined,
      pobAmount: pobAmount ? parseFloat(pobAmount) : undefined,
      status: 'COMPLETED',
    });

    if (isDoctor) {
      await DoctorService.updateDoctorTodayStatus(doctor!.id, 'COMPLETED');
    }

    setSubmitting(false);
    Alert.alert(
      'Call Logged Successfully ✅',
      `Daily Call Report (DCR) for ${customerName} has been saved and queued for sync.`,
      [{ text: 'OK', onPress: onVisitComplete }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isDoctor ? "Doctor Detailing Call" : "Chemist & POB Call"}
        subtitle={customerName}
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Status Card */}
        <View style={styles.verificationCard}>
          <View style={styles.vHeader}>
            <View>
              <Text style={styles.vTitle}>{customerName}</Text>
              <Text style={styles.vSubtitle}>{customerSubtitle}</Text>
            </View>
            <Badge
              label={isGeofenceVerified ? 'In Range (Verified)' : `${Math.round(distanceMeters)}m Out of Range`}
              variant={isGeofenceVerified ? 'success' : 'danger'}
              size="small"
            />
          </View>

          <View style={styles.vDetails}>
            <Text style={styles.chamberLabel}>Location / Chamber</Text>
            <Text style={styles.chamberName}>{activeChamber.name}</Text>
            {activeChamber.address ? (
              <Text style={styles.chamberAddress}>{activeChamber.address}</Text>
            ) : null}

            <TouchableOpacity style={styles.navRow} onPress={openInGoogleMaps}>
              <Text style={styles.navText}>Get Driving Directions in Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Visit Objective Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Visit Objective & Strategy</Text>
          <Text style={styles.sectionSubtitle}>Select primary purpose of this field call</Text>
          <View style={styles.objectiveGrid}>
            {VISIT_OBJECTIVES.map(obj => {
              const active = visitObjective === obj.id;
              return (
                <TouchableOpacity
                  key={obj.id}
                  style={[styles.objectiveChip, active && styles.activeObjectiveChip]}
                  onPress={() => setVisitObjective(obj.id)}
                >
                  <Text style={[styles.objectiveChipText, active && styles.activeObjectiveChipText]}>
                    {obj.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Joint Working Accompaniment */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Joint Field Working</Text>
          <Text style={styles.sectionSubtitle}>Who accompanied you on this visit?</Text>
          <View style={styles.pillsRow}>
            {[
              { id: 'SELF_SOLO', label: 'Solo Working' },
              { id: 'ABM_G_SOLANKI', label: 'ABM (G. Solanki)' },
              { id: 'RBM_RAJESH_SHARMA', label: 'RBM (R. Sharma)' },
              { id: 'COLLEAGUE_AMIT_PAUL', label: 'Co-MR (A. Paul)' },
            ].map(p => {
              const active = accompaniedBy === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setAccompaniedBy(p.id as AccompaniedPerson)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Product Detailing Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Product Detailing & Reactions</Text>
          <Text style={styles.sectionSubtitle}>Tap products presented during this call</Text>

          {MOCK_PRODUCTS.slice(0, 6).map(prod => {
            const isSelected = selectedProductIds.includes(prod.id);
            const currentReaction = productReactions[prod.id] || 'HIGH_INTEREST';

            return (
              <View key={prod.id} style={styles.productItem}>
                <TouchableOpacity
                  style={[styles.productCheckRow, isSelected && styles.productCheckRowActive]}
                  onPress={() => toggleProduct(prod.id)}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prodName}>{prod.brandName}</Text>
                    <Text style={styles.prodGeneric}>{prod.genericName} • {prod.category}</Text>
                  </View>
                </TouchableOpacity>

                {isSelected && (
                  <View style={styles.reactionsRow}>
                    {(['HIGH_INTEREST', 'MODERATE', 'NEUTRAL'] as const).map(reaction => {
                      const active = currentReaction === reaction;
                      return (
                        <TouchableOpacity
                          key={reaction}
                          style={[styles.reactionBtn, active && styles.reactionBtnActive]}
                          onPress={() => setReaction(prod.id, reaction)}
                        >
                          <Text style={[styles.reactionText, active && styles.reactionTextActive]}>
                            {reaction.replace('_', ' ')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Samples & Promotional Inputs */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Physician Samples Handover</Text>
          <Text style={styles.sectionSubtitle}>Track sample quantities given</Text>

          {MOCK_PRODUCTS.slice(0, 4).map(prod => {
            const qty = sampleQuantities[prod.id] || 0;
            return (
              <View key={prod.id} style={styles.sampleRow}>
                <Text style={styles.sampleName}>{prod.brandName}</Text>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => updateSampleQty(prod.id, -1)}>
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepVal}>{qty}</Text>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => updateSampleQty(prod.id, 1)}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Discussion Notes & Feedback */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Discussion Notes & Feedback</Text>
          
          <Text style={styles.inputLbl}>Key Discussion Topics</Text>
          <TextInput
            style={styles.textInputArea}
            placeholder="Clinical topics discussed, patient profiles, competitor comparisons..."
            placeholderTextColor="#94A3B8"
            multiline
            value={discussionNotes}
            onChangeText={setDiscussionNotes}
          />

          <Text style={styles.inputLbl}>Customer Feedback / Commitment *</Text>
          <TextInput
            style={styles.textInputArea}
            placeholder="Doctor or Chemist's verbal feedback, prescription commitment..."
            placeholderTextColor="#94A3B8"
            multiline
            value={customerFeedback}
            onChangeText={setCustomerFeedback}
          />

          <Text style={styles.inputLbl}>POB Order Booked (₹ Amount, if taken)</Text>
          <TextInput
            style={styles.textInputSingle}
            placeholder="e.g. 4500"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={pobAmount}
            onChangeText={setPobAmount}
          />

          <Text style={styles.inputLbl}>Next Follow-up Date (Optional)</Text>
          <TextInput
            style={styles.textInputSingle}
            placeholder="YYYY-MM-DD (e.g. 2026-11-24)"
            placeholderTextColor="#94A3B8"
            value={nextVisitDate}
            onChangeText={setNextVisitDate}
          />
        </View>

        {/* Submit Call CTA */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmitVisit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting DCR Call...' : `Complete Call (${durationMinutes} mins)`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  verificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.card,
  },
  vHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  vTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  vSubtitle: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginTop: 2,
  },
  vDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  chamberLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  chamberName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#1E293B',
    marginTop: 2,
  },
  chamberAddress: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginTop: 2,
  },
  navRow: {
    marginTop: 8,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: '#64748B',
    marginBottom: spacing.sm,
  },
  objectiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  objectiveChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeObjectiveChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  objectiveChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  activeObjectiveChipText: {
    color: '#FFFFFF',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  pillActive: {
    backgroundColor: '#0F172A',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  productItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: spacing.sm,
  },
  productCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productCheckRowActive: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  prodName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
  prodGeneric: {
    fontSize: 10,
    color: '#64748B',
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    marginLeft: 30,
  },
  reactionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  reactionBtnActive: {
    backgroundColor: colors.primary,
  },
  reactionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  reactionTextActive: {
    color: '#FFFFFF',
  },
  sampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sampleName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#1E3A8A',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    padding: 2,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  stepVal: {
    width: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: typography.fontSize.sm,
    color: '#0F172A',
  },
  inputLbl: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#475569',
    marginTop: spacing.sm,
    marginBottom: 4,
  },
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
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
