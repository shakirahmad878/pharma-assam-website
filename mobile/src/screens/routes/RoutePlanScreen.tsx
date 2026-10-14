import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { RouteService } from '../../services/routeService';
import { RoutePlan, MonthlyTourProgramme, MTPDayPlan, TourPlanRescheduleRequest } from '../../types';
import { SupabaseDbService } from '../../services/supabase/supabaseDbService';
import { AuthService } from '../../services/authService';

interface RoutePlanScreenProps {
  onBack: () => void;
  onOpenDrawer?: () => void;
}

const MONTHS = ['September', 'October', 'November', 'December', 'January'];

const BARAK_CITIES_LIST = [
  'Silchar Central & Hospital Road',
  'SMCH Ghungoor Beat',
  'Tarapur & Station Beat',
  'Rangirkhari & Meherpur Beat',
  'Karimganj Main & Station Area',
  'Badarpur Beat',
  'Hailakandi Civil Hospital Road',
  'Lala & Algapur Beat',
  'Sonai & Dholai Beat',
  'Lakhipur Beat',
  'Patherkandi & Ramkrishna Nagar',
];

export const RoutePlanScreen: React.FC<RoutePlanScreenProps> = ({ onBack, onOpenDrawer }) => {
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const currentRealMonth = new Date().toLocaleString('default', { month: 'long' });
  const initialMonthIdx = MONTHS.indexOf(currentRealMonth) !== -1 ? MONTHS.indexOf(currentRealMonth) : 1;
  const [monthIndex, setMonthIndex] = useState(initialMonthIdx); // Defaults to current month (October)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [mtp, setMtp] = useState<MonthlyTourProgramme | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  // Reschedule Request Modal State
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [rescheduleTargetDay, setRescheduleTargetDay] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  // Modal 1: Tour Not Created Alert
  const [tourNotCreatedVisible, setTourNotCreatedVisible] = useState(false);

  // Modal 2: Select Action (Add tour plan, Add leave, Other)
  const [selectActionVisible, setSelectActionVisible] = useState(false);
  const [chosenAction, setChosenAction] = useState<'TOUR_PLAN' | 'LEAVE' | 'OTHER'>('TOUR_PLAN');

  // Modal 3: Select Zone
  const [selectZoneVisible, setSelectZoneVisible] = useState(false);
  const [zoneAssamChecked, setZoneAssamChecked] = useState(true);

  // Modal 4: Select City to Add Visit
  const [selectCityVisible, setSelectCityVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Karimganj Main & Station Area');

  // Modal 5: Existing Plan Actions (View/Reschedule, Add new visit, Add deviation, Add Visit Firm)
  const [existingPlanModalVisible, setExistingPlanModalVisible] = useState(false);
  const [existingAction, setExistingAction] = useState<'RESCHEDULE' | 'NEW_VISIT' | 'DEVIATION' | 'VISIT_FIRM'>('RESCHEDULE');
  const [existingCityName, setExistingCityName] = useState('Karimganj');

  // Multi-day plan overrides stored in local state for calendar
  const [dayPlans, setDayPlans] = useState<{ [day: number]: { city: string; type: 'TOUR' | 'LEAVE' | 'HOLIDAY' | 'APPROVED_LEAVE' | 'REJECTED' } }>({
    1: { city: 'Silchar Central & Hospital Road', type: 'TOUR' },
    2: { city: 'SMCH Ghungoor Beat', type: 'TOUR' },
    3: { city: 'Tarapur & Station Beat', type: 'TOUR' },
    4: { city: 'Rangirkhari & Meherpur Beat', type: 'TOUR' },
    5: { city: 'Karimganj Main & Station Area', type: 'TOUR' },
    7: { city: 'Badarpur Beat', type: 'TOUR' },
    8: { city: 'Hailakandi Civil Hospital Road', type: 'TOUR' },
    9: { city: 'Lala & Algapur Beat', type: 'TOUR' },
    10: { city: 'Sonai & Dholai Beat', type: 'TOUR' },
    11: { city: 'Lakhipur Beat', type: 'TOUR' },
    12: { city: 'Patherkandi & Ramkrishna Nagar', type: 'TOUR' },
    14: { city: 'Silchar Central & Hospital Road', type: 'TOUR' },
    15: { city: 'SMCH Ghungoor Beat', type: 'TOUR' },
    16: { city: 'Tarapur & Station Beat', type: 'TOUR' },
    17: { city: 'Karimganj Main & Station Area', type: 'TOUR' },
    18: { city: 'Badarpur Beat', type: 'TOUR' },
    19: { city: 'Hailakandi Civil Hospital Road', type: 'TOUR' },
    21: { city: 'Lala & Algapur Beat', type: 'TOUR' },
    22: { city: 'Sonai & Dholai Beat', type: 'TOUR' },
    23: { city: 'Silchar Central & Hospital Road', type: 'TOUR' },
    24: { city: 'SMCH Ghungoor Beat', type: 'TOUR' },
    25: { city: 'Tarapur & Station Beat', type: 'TOUR' },
    26: { city: 'Karimganj Main & Station Area', type: 'TOUR' },
    28: { city: 'Badarpur Beat', type: 'TOUR' },
    29: { city: 'Hailakandi Civil Hospital Road', type: 'TOUR' },
    30: { city: 'Lala & Algapur Beat', type: 'TOUR' },
  });

  // Known Holidays for Sep/Oct
  const holidaysMap: { [month: string]: number[] } = {
    September: [],
    October: [2, 17, 19, 20],
    November: [15, 24],
  };

  const currentMonthName = MONTHS[monthIndex];

  useEffect(() => {
    loadMtp();
  }, [monthIndex]);

  const loadMtp = async () => {
    const data = await RouteService.getMonthlyTourPlan(currentMonthName, currentYear);
    setMtp(data);
  };

  const handlePrevMonth = () => {
    if (monthIndex > 0) {
      setMonthIndex(monthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthIndex < MONTHS.length - 1) {
      setMonthIndex(monthIndex + 1);
    }
  };

  const handleDayPress = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    const existing = dayPlans[dayNum];
    if (existing && existing.city) {
      setExistingCityName(existing.city);
      setExistingAction('RESCHEDULE');
      setExistingPlanModalVisible(true);
    } else {
      setChosenAction('TOUR_PLAN');
      setSelectActionVisible(true);
    }
  };

  // Step 1: Confirm action (Add tour plan -> open zone)
  const handleConfirmAction = () => {
    setSelectActionVisible(false);
    if (chosenAction === 'TOUR_PLAN') {
      setSelectZoneVisible(true);
    } else if (chosenAction === 'LEAVE') {
      if (selectedDayNumber) {
        setDayPlans({
          ...dayPlans,
          [selectedDayNumber]: { city: 'Casual Leave (Pending)', type: 'LEAVE' },
        });
        Alert.alert('Leave Marked', `Pending leave recorded for ${selectedDayNumber} ${currentMonthName}.`);
      }
    } else {
      Alert.alert('Notice', 'Other duty / conference recorded.');
    }
  };

  // Step 2: Confirm zone -> open city selection
  const handleConfirmZone = () => {
    setSelectZoneVisible(false);
    setCitySearchQuery('');
    setSelectCityVisible(true);
  };

  // Step 3: Confirm city -> assign to date
  const handleConfirmCity = () => {
    setSelectCityVisible(false);
    if (selectedDayNumber) {
      setDayPlans({
        ...dayPlans,
        [selectedDayNumber]: { city: selectedCity, type: 'TOUR' },
      });
      Alert.alert(
        'Tour Plan Updated',
        `Visit to ${selectedCity} scheduled for ${selectedDayNumber} ${currentMonthName} 2026.`
      );
    }
  };

  // Step 4: Handle existing plan action
  const handleConfirmExistingAction = () => {
    setExistingPlanModalVisible(false);
    if (!selectedDayNumber) return;

    if (existingAction === 'RESCHEDULE') {
      const nextDay = Math.min((selectedDayNumber || 1) + 2, 30);
      setRescheduleTargetDay(String(nextDay));
      setRescheduleReason('');
      setRescheduleModalVisible(true);
    } else if (existingAction === 'DEVIATION') {
      Alert.prompt
        ? Alert.prompt(
            'Add Route Deviation',
            `Enter justification for deviating from ${existingCityName}:`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Submit to RBM',
                onPress: (reason) => {
                  Alert.alert(
                    'Deviation Requested',
                    `Route deviation for ${selectedDayNumber} ${currentMonthName} sent to RBM Rajesh Sharma for approval.`
                  );
                },
              },
            ]
          )
        : Alert.alert(
            'Deviation Requested',
            `Route deviation for ${selectedDayNumber} ${currentMonthName} submitted to RBM Rajesh Sharma.`
          );
    } else if (existingAction === 'VISIT_FIRM') {
      Alert.alert('Add Visit Firm', `Added wholesale firm call in ${existingCityName} to your itinerary.`);
    } else {
      Alert.alert('Add New Visit', `Doctor visit added to ${existingCityName}.`);
    }
  };

  const handleSubmitReschedule = async () => {
    if (!rescheduleReason.trim()) {
      Alert.alert('Reason Mandatory', 'Please provide a mandatory justification for rescheduling this visit for RSM approval.');
      return;
    }
    const targetDayInt = parseInt(rescheduleTargetDay, 10);
    if (isNaN(targetDayInt) || targetDayInt < 1 || targetDayInt > 31) {
      Alert.alert('Invalid Target Day', `Please enter a valid day number.`);
      return;
    }
    if (targetDayInt === selectedDayNumber) {
      Alert.alert('Same Day Selected', 'Please choose a different day for rescheduling.');
      return;
    }

    setSubmittingReschedule(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const empCode = currentUser?.employeeCode || '0002';
      const empName = currentUser?.name || 'Pranjal Malakar';
      
      const origDateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(selectedDayNumber).padStart(2, '0')}`;
      const newDateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(targetDayInt).padStart(2, '0')}`;

      const req: TourPlanRescheduleRequest = {
        id: `resched_${empCode}_${Date.now()}`,
        employeeId: empCode,
        employeeName: empName,
        employeeCode: empCode,
        originalDate: origDateStr,
        newDate: newDateStr,
        routeOrCity: existingCityName,
        reason: rescheduleReason.trim(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await SupabaseDbService.submitRescheduleRequest(req);
      setRescheduleModalVisible(false);

      Alert.alert(
        'Reschedule Request Forwarded 📨',
        `Your request to move visit from day ${selectedDayNumber} to day ${targetDayInt} has been sent to RSM Bodrud Jaman Sadiol.\n\nNOTE: The visit will NOT move until approved by the RSM.`
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to submit reschedule request.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const handleSaveDraft = async () => {
    if (mtp) {
      await RouteService.saveMTPDraft(mtp);
      Alert.alert('Draft Saved ✅', `Tour plan draft for ${currentMonthName} 2026 saved successfully.`);
    }
  };

  const handleSubmitForApproval = async () => {
    if (mtp) {
      await RouteService.submitMTPForApproval(mtp);
      Alert.alert(
        'Tour Plan Submitted ✅',
        `Tour plan for ${currentMonthName} 2026 submitted to RBM (Rajesh Sharma) & ABM (G Solanki) for approval.`
      );
    }
  };

  // Calendar Grid Calculations
  // Sep 2026 starts on Tue (idx 2), Oct 2026 starts on Thu (idx 4)
  const getFirstDayOffset = (mName: string) => {
    if (mName === 'September') return 2; // Tuesday
    if (mName === 'October') return 4; // Thursday
    return 0; // November: Sunday
  };

  const getDaysInMonth = (mName: string) => {
    if (mName === 'September') return 30;
    if (mName === 'October') return 31;
    return 30;
  };

  const offset = getFirstDayOffset(currentMonthName);
  const totalDays = getDaysInMonth(currentMonthName);
  const calendarCells = [];
  for (let i = 0; i < offset; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const currentHolidays = holidaysMap[currentMonthName] || [];

  const filteredCities = BARAK_CITIES_LIST.filter(c =>
    c.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bright Green Header */}
      <View style={styles.topGreenHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={onOpenDrawer || onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIconText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitleText}>TOUR PLAN</Text>

        <TouchableOpacity
          style={styles.headerListBtn}
          onPress={() => setViewMode(viewMode === 'CALENDAR' ? 'LIST' : 'CALENDAR')}
          activeOpacity={0.7}
        >
          <Text style={styles.listBtnText}>{viewMode === 'CALENDAR' ? 'List' : 'Cal'}</Text>
        </TouchableOpacity>
      </View>

      {/* Legend Strip */}
      <View style={styles.legendStrip}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.legendText}>tour plan.</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EAB308' }]} />
          <Text style={styles.legendText}>Pending Leave</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Holidays</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#9333EA' }]} />
          <Text style={styles.legendText}>Approved Leave</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Cancelled/Rejected...</Text>
        </View>
      </View>

      {/* Month Navigation Strip (Muted Green) */}
      <View style={styles.monthNavStrip}>
        <TouchableOpacity style={styles.monthNavBtn} onPress={handlePrevMonth}>
          <Text style={styles.monthNavArrow}>{'< Prev'}</Text>
        </TouchableOpacity>

        <Text style={styles.monthNavTitle}>
          {currentMonthName} {currentYear}
        </Text>

        <TouchableOpacity style={styles.monthNavBtn} onPress={handleNextMonth}>
          <Text style={styles.monthNavArrow}>{'Next >'}</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'CALENDAR' ? (
        <ScrollView style={styles.calendarScrollView}>
          {/* Days of Week Header */}
          <View style={styles.daysHeaderRow}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <View key={day} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarCells.map((dayNum, idx) => {
              if (dayNum === null) {
                return <View key={'empty-' + idx} style={styles.calendarCellEmpty} />;
              }

              const isHoliday = currentHolidays.includes(dayNum);
              const plan = dayPlans[dayNum];
              const isSunday = idx % 7 === 0;

              return (
                <TouchableOpacity
                  key={'day-' + dayNum}
                  style={styles.calendarCell}
                  activeOpacity={0.7}
                  onPress={() => handleDayPress(dayNum)}
                >
                  <Text style={styles.cellDayNumber}>{dayNum}</Text>

                  {/* Status Indicator Dot */}
                  {isHoliday ? (
                    <View style={[styles.cellDot, { backgroundColor: '#3B82F6' }]} />
                  ) : plan ? (
                    <View
                      style={[
                        styles.cellDot,
                        {
                          backgroundColor:
                            plan.type === 'LEAVE'
                              ? '#EAB308'
                              : plan.type === 'APPROVED_LEAVE'
                              ? '#9333EA'
                              : '#22C55E',
                        },
                      ]}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Action Buttons */}
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleSubmitForApproval}>
              <Text style={styles.actionBtnText}>Submit for approval</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleSaveDraft}>
              <Text style={styles.actionBtnText}>Save as draft</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Warning Notice */}
          <Text style={styles.bottomWarningNotice}>
            * DO NOT press back button or navigate away from this page without saving your work. Press Save as Draft button for saving your changes.
          </Text>
        </ScrollView>
      ) : (
        /* List Mode View */
        <FlatList
          data={mtp?.days || []}
          keyExtractor={item => 'list-day-' + item.dayNumber}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listCard}
              onPress={() => handleDayPress(item.dayNumber)}
            >
              <View style={styles.listDayBadge}>
                <Text style={styles.listDayNum}>{item.dayNumber}</Text>
                <Text style={styles.listDayName}>{item.dayOfWeek || 'Mon'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.listRouteTitle}>
                  {dayPlans[item.dayNumber]?.city || item.routeName || 'No Beat Assigned'}
                </Text>
                <Text style={styles.listCallTarget}>
                  🎯 Target: {item.targetDoctorCalls} Doctors • {item.targetChemistCalls} Chemists
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* MODAL 1: Tour Not Created Alert Dialog */}
      <Modal visible={tourNotCreatedVisible} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Tour not created</Text>
            <Text style={styles.alertMessage}>
              Tour plan for October 2026month is not submitted yet. Press OK to create, modify and submit tour plan for October 2026
            </Text>
            <View style={styles.alertBtnRow}>
              <TouchableOpacity
                style={styles.alertCancelBtn}
                onPress={() => setTourNotCreatedVisible(false)}
              >
                <Text style={styles.alertCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.alertOkBtn}
                onPress={() => setTourNotCreatedVisible(false)}
              >
                <Text style={styles.alertOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Select Action (Add tour plan, Add leave, Other) */}
      <Modal visible={selectActionVisible} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>Select action</Text>
            </View>

            <View style={styles.dialogBody}>
              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setChosenAction('TOUR_PLAN')}
              >
                <View style={[styles.radioOuter, chosenAction === 'TOUR_PLAN' && styles.radioOuterActive]}>
                  {chosenAction === 'TOUR_PLAN' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Add tour plan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setChosenAction('LEAVE')}
              >
                <View style={[styles.radioOuter, chosenAction === 'LEAVE' && styles.radioOuterActive]}>
                  {chosenAction === 'LEAVE' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Add leave</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setChosenAction('OTHER')}
              >
                <View style={[styles.radioOuter, chosenAction === 'OTHER' && styles.radioOuterActive]}>
                  {chosenAction === 'OTHER' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Other</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dialogFooterRow}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setSelectActionVisible(false)}
              >
                <Text style={styles.dialogCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogOkBtn}
                onPress={handleConfirmAction}
              >
                <Text style={styles.dialogOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Select Zone to Add Visit */}
      <Modal visible={selectZoneVisible} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>Select zone to add visit</Text>
            </View>

            <View style={styles.dialogBody}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setZoneAssamChecked(!zoneAssamChecked)}
              >
                <Text style={styles.checkboxLabel}>Assam</Text>
                <View style={[styles.checkboxBox, zoneAssamChecked && styles.checkboxBoxChecked]}>
                  {zoneAssamChecked && <Text style={styles.checkmarkIcon}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.dialogFooterRow}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setSelectZoneVisible(false)}
              >
                <Text style={styles.dialogCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogOkBtn}
                onPress={handleConfirmZone}
              >
                <Text style={styles.dialogOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: Select City to Add Visit */}
      <Modal visible={selectCityVisible} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>Select city to add visit</Text>
            </View>

            <View style={styles.searchBarWrapper}>
              <Text style={styles.searchIconText}>🔍</Text>
              <TextInput
                style={styles.citySearchInput}
                placeholder="Search city / beat..."
                placeholderTextColor="#94A3B8"
                value={citySearchQuery}
                onChangeText={setCitySearchQuery}
              />
            </View>

            <ScrollView style={styles.cityScrollView}>
              {filteredCities.map(city => {
                const isSelected = selectedCity === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={styles.cityListItem}
                    onPress={() => setSelectedCity(city)}
                  >
                    <Text style={styles.cityNameText}>{city}</Text>
                    <View style={[styles.checkboxBox, isSelected && styles.checkboxBoxChecked]}>
                      {isSelected && <Text style={styles.checkmarkIcon}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.dialogFooterRow}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setSelectCityVisible(false)}
              >
                <Text style={styles.dialogCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogOkBtn}
                onPress={handleConfirmCity}
              >
                <Text style={styles.dialogOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 5: Existing Tour City Options */}
      <Modal visible={existingPlanModalVisible} transparent animationType="fade">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>
                Your city for tourplan is : {existingCityName.split('&')[0].trim()}
              </Text>
            </View>

            <View style={styles.dialogBody}>
              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setExistingAction('RESCHEDULE')}
              >
                <View style={[styles.radioOuter, existingAction === 'RESCHEDULE' && styles.radioOuterActive]}>
                  {existingAction === 'RESCHEDULE' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>View/Reschedule visit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setExistingAction('NEW_VISIT')}
              >
                <View style={[styles.radioOuter, existingAction === 'NEW_VISIT' && styles.radioOuterActive]}>
                  {existingAction === 'NEW_VISIT' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Add new visit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setExistingAction('DEVIATION')}
              >
                <View style={[styles.radioOuter, existingAction === 'DEVIATION' && styles.radioOuterActive]}>
                  {existingAction === 'DEVIATION' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Add deviation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setExistingAction('VISIT_FIRM')}
              >
                <View style={[styles.radioOuter, existingAction === 'VISIT_FIRM' && styles.radioOuterActive]}>
                  {existingAction === 'VISIT_FIRM' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Add Visit Firm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dialogFooterRow}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setExistingPlanModalVisible(false)}
              >
                <Text style={styles.dialogCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogOkBtn}
                onPress={handleConfirmExistingAction}
              >
                <Text style={styles.dialogOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 6: Reschedule Visit with Mandatory Reason (RSM Approval) */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogHeaderText}>
                Reschedule Visit: {existingCityName}
              </Text>
            </View>

            <View style={{ padding: spacing.md }}>
              <View style={{ backgroundColor: '#F1F5F9', padding: 8, borderRadius: radius.xs, marginBottom: 10 }}>
                <Text style={{ fontSize: 11, color: '#64748B', fontWeight: 'bold' }}>CURRENT SCHEDULED DAY:</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0F172A' }}>
                  Day {selectedDayNumber} ({currentMonthName} {currentYear})
                </Text>
              </View>

              <Text style={{ fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 4 }}>
                Proposed Target Day in {currentMonthName}:
              </Text>
              <TextInput
                style={[styles.citySearchInput, { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 4, paddingHorizontal: 8 }]}
                value={rescheduleTargetDay}
                keyboardType="numeric"
                placeholder="Enter day number (1 - 31)"
                onChangeText={setRescheduleTargetDay}
              />

              <Text style={{ fontSize: 12, fontWeight: '600', color: '#475569', marginTop: 10, marginBottom: 4 }}>
                Mandatory Reason for Rescheduling:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                {['Doctor OPD Shifted', 'Barak Route Landslide', 'Emergency Duty Swap', 'Chemist Strike'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, backgroundColor: '#F1F5F9' },
                      rescheduleReason === r && { backgroundColor: '#34C759' },
                    ]}
                    onPress={() => setRescheduleReason(r)}
                  >
                    <Text style={{ fontSize: 10, color: rescheduleReason === r ? '#ffffff' : '#334155' }}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.citySearchInput, { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 4, paddingHorizontal: 8, minHeight: 50 }]}
                value={rescheduleReason}
                multiline
                placeholder="Detail reasons for manager authorization..."
                onChangeText={setRescheduleReason}
              />

              <View style={{ backgroundColor: '#FEF3C7', padding: 8, borderRadius: 4, marginTop: 10 }}>
                <Text style={{ fontSize: 10, color: '#B45309', fontWeight: 'bold' }}>
                  ⚠️ Approval Policy: Visit will NOT move until approved by RSM Bodrud Jaman Sadiol.
                </Text>
              </View>
            </View>

            <View style={styles.dialogFooterRow}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setRescheduleModalVisible(false)}
                disabled={submittingReschedule}
              >
                <Text style={styles.dialogCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogOkBtn}
                onPress={handleSubmitReschedule}
                disabled={submittingReschedule}
              >
                <Text style={styles.dialogOkText}>
                  {submittingReschedule ? 'SENDING...' : 'SEND TO RSM'}
                </Text>
              </TouchableOpacity>
            </View>
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
  topGreenHeader: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerIconBtn: {
    padding: spacing.xs,
  },
  menuIconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  headerListBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  listBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  legendStrip: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
  },
  monthNavStrip: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
  },
  monthNavBtn: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  monthNavArrow: {
    color: '#C8E6C9',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  monthNavTitle: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  calendarScrollView: {
    flex: 1,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  dayHeaderCell: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dayHeaderText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
  },
  calendarCellEmpty: {
    width: '14.285%',
    height: 54,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  calendarCell: {
    width: '14.285%',
    height: 54,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  cellDayNumber: {
    color: '#0F172A',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  cellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#94A3B8',
    paddingVertical: spacing.md,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#0F172A',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  bottomWarningNotice: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    color: '#64748B',
    fontSize: 11,
    lineHeight: 16,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listDayBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listDayNum: {
    color: '#15803D',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  listDayName: {
    color: '#166534',
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
  },
  listRouteTitle: {
    color: '#0F172A',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  listCallTarget: {
    color: '#64748B',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },

  // Alert Modal (Tour Not Created)
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  alertTitle: {
    color: '#0F172A',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  alertMessage: {
    color: '#334155',
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  alertBtnRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: spacing.sm,
  },
  alertCancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  alertCancelText: {
    color: '#3B82F6',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  alertOkBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  alertOkText: {
    color: '#3B82F6',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },

  // Dialog Styles (Green Header)
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  dialogHeader: {
    backgroundColor: '#48BB78',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dialogHeaderText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  dialogBody: {
    padding: spacing.lg,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  radioOuterActive: {
    borderColor: '#F59E0B',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  radioLabel: {
    color: '#0F172A',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  checkboxLabel: {
    color: '#0F172A',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  checkboxBox: {
    width: 26,
    height: 26,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#0F172A',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
  searchIconText: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  citySearchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: '#0F172A',
  },
  cityScrollView: {
    maxHeight: 220,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  cityListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cityNameText: {
    color: '#0F172A',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
    marginRight: spacing.sm,
  },
  dialogFooterRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  dialogCancelBtn: {
    flex: 1,
    backgroundColor: '#8E8E93',
    paddingVertical: spacing.md,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  dialogCancelText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  dialogOkBtn: {
    flex: 1,
    backgroundColor: '#48BB78',
    paddingVertical: spacing.md,
    borderRadius: radius.xs,
    alignItems: 'center',
  },
  dialogOkText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
