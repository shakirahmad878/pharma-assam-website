import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  MOCK_SFC_ROUTES,
  MOCK_LEAVE_BALANCE,
  MOCK_ASSAM_HOLIDAYS,
  MOCK_BUSINESS_DOCTORS,
  MOCK_BUSINESS_RETAILERS,
  MOCK_EXPENSES_LOG,
  DailyExpenseItem,
  SFCRouteEntry,
  DoctorBusinessPlan,
  RetailerSalesPlan,
} from '../../constants/mockData';
import { PdfReportService } from '../../services/pdfReportService';

const { width } = Dimensions.get('window');

interface AuxScreenProps {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  type?: 'EXPENSES' | 'LEAVES' | 'TOUR_PLAN' | 'HOLIDAYS' | 'BUSINESS_PLAN' | 'REPORTS' | 'MONTHLY_SUMMARY' | 'NOTIFICATIONS' | 'FILES';
  onNavigate?: (screen: string, params?: any) => void;
}

export const AuxScreen: React.FC<AuxScreenProps> = ({ onBack, type = 'EXPENSES', onNavigate }) => {
  if (type === 'TOUR_PLAN') return <TourPlanScreen onBack={onBack} onNavigate={onNavigate} />;
  if (type === 'LEAVES') return <LeavesScreen onBack={onBack} />;
  if (type === 'HOLIDAYS') return <HolidaysScreen onBack={onBack} />;
  if (type === 'BUSINESS_PLAN') return <BusinessPlanningScreen onBack={onBack} />;
  if (type === 'REPORTS') return <ReportsHubScreen onBack={onBack} />;
  if (type === 'MONTHLY_SUMMARY') return <MonthlySummaryScreen onBack={onBack} />;
  if (type === 'NOTIFICATIONS') return <NotificationsScreen onBack={onBack} />;
  if (type === 'FILES') return <FilesScreen onBack={onBack} />;
  return <ExpensesScreen onBack={onBack} />;
};

/* =========================================================================================
   1. TOUR PLAN CALENDAR & DAY ACTIONS (Images 32 & 34)
   ========================================================================================= */
export const TourPlanScreen: React.FC<{ onBack: () => void; onNavigate?: (s: string, p?: any) => void }> = ({
  onBack,
  onNavigate,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const [selectedDay, setSelectedDay] = useState<number>(26);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('VIEW_RESCHEDULE');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCity, setNewCity] = useState('Karimganj Town');
  const [newDoctorTarget, setNewDoctorTarget] = useState('10');
  const [newChemistTarget, setNewChemistTarget] = useState('4');

  // Days in month: 30 days for September
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getDayStatusColor = (day: number) => {
    if (day === 27) return '#2563EB'; // Sunday / Holiday
    if (day === 15 || day === 16) return '#2563EB'; // Holiday
    if (day === 10) return '#CA8A04'; // Pending Leave
    if (day === 18) return '#DC2626'; // Rejected Leave
    if (day === 5) return '#9333EA'; // Approved Leave
    if (day < 26) return '#06B6D4'; // Date Back Date Visit
    return '#16A34A'; // TourPlan green
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    setActionModalVisible(true);
  };

  const handleExecuteAction = () => {
    setActionModalVisible(false);
    if (selectedAction === 'VIEW_RESCHEDULE' || selectedAction === 'VIEW_SELECTED_DOC') {
      if (onNavigate) onNavigate('DOCTORS');
    } else if (selectedAction === 'ADD_NEW_DOC_VISIT') {
      if (onNavigate) onNavigate('DOCTORS');
    } else if (selectedAction === 'ADD_NEW_FIRM_VISIT') {
      if (onNavigate) onNavigate('FIRMS');
    } else if (selectedAction === 'ADD_DEVIATION') {
      Alert.alert(
        'Tour Plan Deviation Logged',
        `Tour Plan deviation requested for ${selectedDay} Sep in Karimganj. Sent to ABM for auto-approval.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header matching Image 32 */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={onBack} style={styles.headerLeftBtn}>
          <Ionicons name="menu-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Tour Plan Calendar</Text>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'CALENDAR' ? 'LIST' : 'CALENDAR')}>
          <Text style={styles.headerRightActionText}>{viewMode === 'CALENDAR' ? 'LIST VIEW' : 'CALENDAR VIEW'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month Navigator Header Card */}
        <View style={styles.monthNavCard}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="chevron-back" size={20} color="#2563EB" />
          </TouchableOpacity>
          <Text style={styles.monthNavTitle}>{selectedMonth}</Text>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="chevron-forward" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Days of Week Header */}
        <View style={styles.calendarWeekRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <Text key={d} style={styles.weekHeaderText}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid 1-30 */}
        <View style={styles.calendarGrid}>
          {/* September 2026 starts on Tuesday (2 blank spaces) */}
          <View style={styles.calCellEmpty} />
          <View style={styles.calCellEmpty} />
          {days.map(day => {
            const isToday = day === 26;
            const dotColor = getDayStatusColor(day);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.calCell, isToday && styles.calCellToday]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[styles.calDayNum, isToday && styles.calDayNumToday]}>{day}</Text>
                <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend / Status Key matching Image 32 */}
        <View style={styles.legendCard}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.legendText}>• TourPlan</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#CA8A04' }]} />
            <Text style={styles.legendText}>• Pending Leave</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.legendText}>• Cancelled/Rejected Leave</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#9333EA' }]} />
            <Text style={styles.legendText}>• Approved Leave</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.legendText}>• Holiday</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#06B6D4' }]} />
            <Text style={styles.legendText}>• Date Back Date Visit</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button matching Image 32 */}
      <View style={styles.bottomBarFixed}>
        <TouchableOpacity style={styles.fullWidthBtn} onPress={() => setCreateModalVisible(true)}>
          <Text style={styles.fullWidthBtnText}>CREATE TOUR PLAN</Text>
        </TouchableOpacity>
      </View>

      {/* Day Action Modal matching Image 34 */}
      <Modal visible={actionModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.actionModalBox}>
            <View style={styles.actionModalHeader}>
              <Text style={styles.actionModalHeaderTitle}>Select action</Text>
            </View>
            <View style={styles.actionModalBody}>
              <Text style={styles.actionModalCityNote}>Your work city for the day is Karimganj</Text>

              {[
                { id: 'VIEW_RESCHEDULE', label: 'View/Reschedule visit' },
                { id: 'VIEW_SELECTED_DOC', label: 'View selected doctor' },
                { id: 'ADD_NEW_DOC_VISIT', label: 'Add new visits to Doctors' },
                { id: 'ADD_NEW_FIRM_VISIT', label: 'Add new visit to firm' },
                { id: 'ADD_DEVIATION', label: 'Add Tour Plan Deviation' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.radioRow}
                  onPress={() => setSelectedAction(opt.id)}
                >
                  <View style={[styles.radioCircle, selectedAction === opt.id && styles.radioCircleActive]}>
                    {selectedAction === opt.id && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actionModalFooter}>
              <TouchableOpacity style={styles.actionModalCancelBtn} onPress={() => setActionModalVisible(false)}>
                <Text style={styles.actionModalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionModalOkBtn} onPress={handleExecuteAction}>
                <Text style={styles.actionModalOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Tour Plan Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.createModalBox}>
            <Text style={styles.modalHeaderTitle}>Create Tour Plan (October 2026)</Text>
            <Text style={styles.modalFieldLabel}>Assigned Work Beat / City</Text>
            <TextInput style={styles.modalInput} value={newCity} onChangeText={setNewCity} />
            <Text style={styles.modalFieldLabel}>Target Doctor Calls / Day</Text>
            <TextInput style={styles.modalInput} value={newDoctorTarget} keyboardType="numeric" onChangeText={setNewDoctorTarget} />
            <Text style={styles.modalFieldLabel}>Target Chemist / Stockist Calls</Text>
            <TextInput style={styles.modalInput} value={newChemistTarget} keyboardType="numeric" onChangeText={setNewChemistTarget} />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#94A3B8' }]} onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#2563EB' }]}
                onPress={() => {
                  setCreateModalVisible(false);
                  Alert.alert('Tour Plan Submitted ✅', 'Monthly Tour Programme submitted to Area Business Manager for approval.');
                }}
              >
                <Text style={styles.modalBtnText}>Submit Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* =========================================================================================
   2. EXPENSES & STANDARD FARE CHART (SFC) (Images 6, 7, 26, 27)
   ========================================================================================= */
export const ExpensesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'EXPENSES' | 'SFC'>('EXPENSES');
  const [selectedExpense, setSelectedExpense] = useState<DailyExpenseItem | null>(null);
  const [searchRoute, setSearchRoute] = useState('');

  const filteredSFC = MOCK_SFC_ROUTES.filter(
    r =>
      r.fromLocation.toLowerCase().includes(searchRoute.toLowerCase()) ||
      r.toLocation.toLowerCase().includes(searchRoute.toLowerCase())
  );

  const handleExportPDF = async () => {
    const headers = ['Date', 'Route & Destination', 'Distance (Km)', 'TA (₹)', 'DA (₹)', 'Total (₹)', 'Status'];
    const rows = MOCK_EXPENSES_LOG.map(e => [
      e.date,
      e.route,
      `${e.distanceKm} km`,
      `₹${e.taAmount}`,
      `₹${e.daAmount}`,
      `₹${e.totalAmount}`,
      e.status,
    ]);
    const summary = [
      { label: 'Total Allowance Claimed', value: '₹4,116' },
      { label: 'Total Distance', value: '332 Km' },
      { label: 'Approved Claims', value: '4 of 5' },
    ];
    await PdfReportService.generateAndShareReport(
      { title: 'Barak Valley Monthly Expense Report', subtitle: 'Standard Fare Chart (SFC) Verified Ledger' },
      headers,
      rows,
      summary
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Expenses & SFC" subtitle="Barak Valley TA/DA & Standard Fares" showBack onBack={onBack} />

      {/* Top Switcher */}
      <View style={styles.topTabRow}>
        <TouchableOpacity
          style={[styles.topTabBtn, activeTab === 'EXPENSES' && styles.topTabBtnActive]}
          onPress={() => setActiveTab('EXPENSES')}
        >
          <Text style={[styles.topTabBtnText, activeTab === 'EXPENSES' && styles.topTabBtnTextActive]}>
            DAILY EXPENSES
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topTabBtn, activeTab === 'SFC' && styles.topTabBtnActive]}
          onPress={() => setActiveTab('SFC')}
        >
          <Text style={[styles.topTabBtnText, activeTab === 'SFC' && styles.topTabBtnTextActive]}>
            SFC ROUTE CHART
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'EXPENSES' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Action Bar */}
          <View style={styles.exportBar}>
            <Text style={styles.exportBarTitle}>Recent Travel Claims</Text>
            <TouchableOpacity style={styles.exportPdfBtn} onPress={handleExportPDF}>
              <Ionicons name="document-text-outline" size={16} color="#ffffff" />
              <Text style={styles.exportPdfBtnText}>Export PDF</Text>
            </TouchableOpacity>
          </View>

          {MOCK_EXPENSES_LOG.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.expenseCard}
              onPress={() => setSelectedExpense(item)}
            >
              <View style={styles.expenseCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.expenseDate}>{item.date}</Text>
                  <Text style={styles.expenseRoute}>{item.route}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    item.status === 'Approved' ? styles.statusApproved : styles.statusUnapproved,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      item.status === 'Approved' ? styles.statusApprovedText : styles.statusUnapprovedText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.expenseMetaRow}>
                <Text style={styles.expenseMetaItem}>📍 {item.distanceKm} km</Text>
                <Text style={styles.expenseMetaItem}>🚗 TA: ₹{item.taAmount}</Text>
                <Text style={styles.expenseMetaItem}>🍲 DA: ₹{item.daAmount}</Text>
                <Text style={styles.expenseTotalText}>₹{item.totalAmount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Search bar */}
          <View style={styles.searchBarBox}>
            <Ionicons name="search-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search SFC route (e.g. Makunda, Patharkandi)..."
              value={searchRoute}
              onChangeText={setSearchRoute}
            />
          </View>

          <View style={styles.sfcTableHeader}>
            <Text style={[styles.sfcHeaderCol, { flex: 2 }]}>Destination Route</Text>
            <Text style={[styles.sfcHeaderCol, { flex: 1, textAlign: 'center' }]}>Distance</Text>
            <Text style={[styles.sfcHeaderCol, { flex: 1, textAlign: 'center' }]}>Fare (₹)</Text>
            <Text style={[styles.sfcHeaderCol, { flex: 1, textAlign: 'right' }]}>DA (₹)</Text>
          </View>

          {filteredSFC.map(sfc => (
            <View key={sfc.id} style={styles.sfcTableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.sfcDestText}>{sfc.toLocation}</Text>
                <Text style={styles.sfcFromText}>From {sfc.fromLocation}</Text>
              </View>
              <Text style={[styles.sfcCellText, { flex: 1, textAlign: 'center' }]}>{sfc.distanceKm} km</Text>
              <Text style={[styles.sfcCellBold, { flex: 1, textAlign: 'center' }]}>₹{sfc.standardFare}</Text>
              <Text style={[styles.sfcCellText, { flex: 1, textAlign: 'right' }]}>₹{sfc.daAllowed}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Expense Detail Popup matching Images 26 & 27 */}
      <Modal visible={!!selectedExpense} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.expenseDetailModal}>
            <View style={styles.expenseDetailHeader}>
              <Text style={styles.expenseDetailTitle}>Expense Breakdown</Text>
              <TouchableOpacity onPress={() => setSelectedExpense(null)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
            {selectedExpense && (
              <View style={styles.expenseDetailBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{selectedExpense.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Route:</Text>
                  <Text style={styles.detailValue}>{selectedExpense.route}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Distance:</Text>
                  <Text style={styles.detailValue}>{selectedExpense.distanceKm} km</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Travel Allowance (TA):</Text>
                  <Text style={styles.detailValue}>₹{selectedExpense.taAmount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Daily Allowance (DA):</Text>
                  <Text style={styles.detailValue}>₹{selectedExpense.daAmount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={[styles.detailValue, { fontWeight: 'bold', color: '#2563EB' }]}>
                    ₹{selectedExpense.totalAmount}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, { fontWeight: 'bold' }]}>{selectedExpense.status}</Text>
                </View>
                <View style={styles.detailRemarkBox}>
                  <Text style={styles.detailRemarkLabel}>Admin Remark:</Text>
                  <Text style={styles.detailRemarkText}>
                    {selectedExpense.adminRemark || 'Standard Fare Chart verified against GPS route telemetry.'}
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.detailCloseBtn} onPress={() => setSelectedExpense(null)}>
              <Text style={styles.detailCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* =========================================================================================
   3. LEAVE BALANCE & ENTITLEMENTS (Images 28 & 37)
   ========================================================================================= */
export const LeavesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [recentModalVisible, setRecentModalVisible] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave(CL)');
  const [leaveReason, setLeaveReason] = useState('');
  const [startDate, setStartDate] = useState('28 Sep 2026');
  const [endDate, setEndDate] = useState('29 Sep 2026');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Leave Balance" subtitle="Entitlements & Applications" showBack onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Table matching Images 28 & 37 */}
        <View style={styles.leaveTableBox}>
          <View style={styles.leaveTableHeaderRow}>
            <Text style={styles.leaveTableHeaderCol1}>Leave Entitlement</Text>
            <Text style={styles.leaveTableHeaderCol2}>BALANCE/MAXIMUM</Text>
          </View>

          {MOCK_LEAVE_BALANCE.map((item, idx) => (
            <View key={item.code} style={[styles.leaveTableRow, idx % 2 === 1 && { backgroundColor: '#F8FAFC' }]}>
              <Text style={styles.leaveTypeName}>{item.type}</Text>
              <Text style={styles.leaveBalanceText}>
                {item.available}/{item.total}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Dual Action Buttons matching Images 28 & 37 */}
      <View style={styles.leaveBottomBar}>
        <TouchableOpacity style={styles.recentActivityBtn} onPress={() => setRecentModalVisible(true)}>
          <Text style={styles.recentActivityBtnText}>RECENT ACTIVITY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyLeaveBtn} onPress={() => setApplyModalVisible(true)}>
          <Text style={styles.applyLeaveBtnText}>APPLY LEAVE</Text>
        </TouchableOpacity>
      </View>

      {/* Apply Leave Modal */}
      <Modal visible={applyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.createModalBox}>
            <Text style={styles.modalHeaderTitle}>Apply for Leave</Text>
            <Text style={styles.modalFieldLabel}>Leave Category</Text>
            <View style={styles.pillSelectRow}>
              {['Casual Leave(CL)', 'Sick Leave(SL)', 'Earn Leave(EL)'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.pillOption, leaveType === t && styles.pillOptionActive]}
                  onPress={() => setLeaveType(t)}
                >
                  <Text style={[styles.pillOptionText, leaveType === t && styles.pillOptionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalFieldLabel}>Start Date</Text>
            <TextInput style={styles.modalInput} value={startDate} onChangeText={setStartDate} />
            <Text style={styles.modalFieldLabel}>End Date</Text>
            <TextInput style={styles.modalInput} value={endDate} onChangeText={setEndDate} />
            <Text style={styles.modalFieldLabel}>Reason for Leave</Text>
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              multiline
              placeholder="State reason for absence..."
              value={leaveReason}
              onChangeText={setLeaveReason}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#94A3B8' }]} onPress={() => setApplyModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#2563EB' }]}
                onPress={() => {
                  setApplyModalVisible(false);
                  Alert.alert('Leave Application Submitted ✅', `Your application for ${leaveType} has been submitted to your ABM.`);
                }}
              >
                <Text style={styles.modalBtnText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recent Activity Modal */}
      <Modal visible={recentModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.createModalBox}>
            <Text style={styles.modalHeaderTitle}>Recent Leave Log</Text>
            <View style={{ marginVertical: 12 }}>
              <View style={styles.historyRow}>
                <Text style={styles.historyType}>Casual Leave (CL)</Text>
                <Text style={styles.historyDates}>12 Aug 2026 - 13 Aug 2026</Text>
                <Badge label="Approved" variant="success" />
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyType}>Sick Leave (SL)</Text>
                <Text style={styles.historyDates}>02 Jul 2026</Text>
                <Badge label="Approved" variant="success" />
              </View>
            </View>
            <TouchableOpacity style={styles.detailCloseBtn} onPress={() => setRecentModalVisible(false)}>
              <Text style={styles.detailCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* =========================================================================================
   4. ASSAM REGIONAL HOLIDAY CALENDAR (Image 24)
   ========================================================================================= */
export const HolidaysScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Holiday List" subtitle="Assam Regional Calendar 2026" showBack onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MOCK_ASSAM_HOLIDAYS.map(h => (
          <View key={h.id} style={styles.holidayCard}>
            <View style={styles.holidayDateBadge}>
              <Text style={styles.holidayDateNum}>{h.date.split(' ')[0]}</Text>
              <Text style={styles.holidayDateMonth}>{h.date.split(' ')[1]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.holidayName}>{h.name}</Text>
              <Text style={styles.holidaySub}>
                {h.dayOfWeek} • {h.type} Holiday
              </Text>
            </View>
            <Ionicons name="calendar-outline" size={20} color="#2563EB" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

/* =========================================================================================
   5. BUSINESS PLANNING SCREEN (Images 21, 22, 23, 25)
   ========================================================================================= */
export const BusinessPlanningScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'DOCTORS' | 'RETAILERS'>('DOCTORS');
  const [doctorsPlan, setDoctorsPlan] = useState<DoctorBusinessPlan[]>(MOCK_BUSINESS_DOCTORS);
  const [retailersPlan, setRetailersPlan] = useState<RetailerSalesPlan[]>(MOCK_BUSINESS_RETAILERS);

  const totalDoctorTarget = doctorsPlan.reduce((sum, d) => sum + d.targetCurrentMonth, 0);
  const totalRetailerTarget = retailersPlan.reduce((sum, r) => sum + r.targetCurrentMonth, 0);

  const updateDoctorTarget = (id: string, val: string) => {
    const num = parseInt(val, 10) || 0;
    setDoctorsPlan(doctorsPlan.map(d => (d.id === id ? { ...d, targetCurrentMonth: num } : d)));
  };

  const updateRetailerTarget = (id: string, val: string) => {
    const num = parseInt(val, 10) || 0;
    setRetailersPlan(retailersPlan.map(r => (r.id === id ? { ...r, targetCurrentMonth: num } : r)));
  };

  const handleExportPDF = async () => {
    if (activeTab === 'DOCTORS') {
      const headers = ['Doctor Name', 'Specialty', 'Location', 'Last Month Sale (₹)', 'Target (₹)'];
      const rows = doctorsPlan.map(d => [d.doctorName, d.specialty, d.area, `₹${d.lastMonthSale}`, `₹${d.targetCurrentMonth}`]);
      await PdfReportService.generateAndShareReport(
        { title: 'Doctor Business Planning (Barak Valley)', subtitle: 'Monthly Commitment & Potential Target' },
        headers,
        rows,
        [{ label: 'Total Doctor Target', value: `₹${totalDoctorTarget.toLocaleString('en-IN')}` }]
      );
    } else {
      const headers = ['Firm Name', 'Type', 'Area', 'Last Month Sale (₹)', 'Target (₹)'];
      const rows = retailersPlan.map(r => [r.firmName, r.type, r.area, `₹${r.lastMonthSale}`, `₹${r.targetCurrentMonth}`]);
      await PdfReportService.generateAndShareReport(
        { title: 'Retailer Sales Planning (Barak Valley)', subtitle: 'Secondary Sales Commitment' },
        headers,
        rows,
        [{ label: 'Total Retailer Target', value: `₹${totalRetailerTarget.toLocaleString('en-IN')}` }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Business Planning" subtitle="Barak Valley Monthly Targets" showBack onBack={onBack} />

      {/* Dual Tab Switcher matching Images 21, 23, 25 */}
      <View style={styles.topTabRow}>
        <TouchableOpacity
          style={[styles.topTabBtn, activeTab === 'DOCTORS' && styles.topTabBtnActive]}
          onPress={() => setActiveTab('DOCTORS')}
        >
          <Text style={[styles.topTabBtnText, activeTab === 'DOCTORS' && styles.topTabBtnTextActive]}>
            DOCTOR PLANNING
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topTabBtn, activeTab === 'RETAILERS' && styles.topTabBtnActive]}
          onPress={() => setActiveTab('RETAILERS')}
        >
          <Text style={[styles.topTabBtnText, activeTab === 'RETAILERS' && styles.topTabBtnTextActive]}>
            RETAILER PLANNING
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        {/* Export & Summary Bar */}
        <View style={styles.exportBar}>
          <Text style={styles.exportBarTitle}>
            {activeTab === 'DOCTORS' ? 'Prescriber Targets' : 'Retail Pharmacy Targets'}
          </Text>
          <TouchableOpacity style={styles.exportPdfBtn} onPress={handleExportPDF}>
            <Ionicons name="document-text-outline" size={16} color="#ffffff" />
            <Text style={styles.exportPdfBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'DOCTORS'
          ? doctorsPlan.map(doc => (
              <View key={doc.id} style={styles.bpCard}>
                <View style={styles.bpCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bpDocName}>{doc.doctorName}</Text>
                    <Text style={styles.bpDocSpecialty}>{doc.specialty}</Text>
                    <Text style={styles.bpArea}>📍 {doc.area}</Text>
                  </View>
                  <Badge label={doc.category} variant="info" />
                </View>

                <View style={styles.bpInputsRow}>
                  <View style={styles.bpInputCol}>
                    <Text style={styles.bpInputLabel}>Last Month Sale</Text>
                    <Text style={styles.bpReadOnlyVal}>₹{doc.lastMonthSale.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.bpInputCol}>
                    <Text style={styles.bpInputLabel}>Target (₹)</Text>
                    <TextInput
                      style={styles.bpTextInput}
                      keyboardType="numeric"
                      value={doc.targetCurrentMonth.toString()}
                      onChangeText={val => updateDoctorTarget(doc.id, val)}
                    />
                  </View>
                </View>
              </View>
            ))
          : retailersPlan.map(ret => (
              <View key={ret.id} style={styles.bpCard}>
                <View style={styles.bpCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bpDocName}>{ret.firmName}</Text>
                    <Text style={styles.bpDocSpecialty}>{ret.type}</Text>
                    <Text style={styles.bpArea}>📍 {ret.area}</Text>
                  </View>
                </View>

                <View style={styles.bpInputsRow}>
                  <View style={styles.bpInputCol}>
                    <Text style={styles.bpInputLabel}>Last Month Sale</Text>
                    <Text style={styles.bpReadOnlyVal}>₹{ret.lastMonthSale.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.bpInputCol}>
                    <Text style={styles.bpInputLabel}>Target (₹)</Text>
                    <TextInput
                      style={styles.bpTextInput}
                      keyboardType="numeric"
                      value={ret.targetCurrentMonth.toString()}
                      onChangeText={val => updateRetailerTarget(ret.id, val)}
                    />
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>

      {/* Sticky Bottom Total Footer matching Images 21, 23 */}
      <View style={styles.bpFooter}>
        <View style={styles.bpFooterLeft}>
          <Text style={styles.bpFooterLabel}>TOTAL SALES TARGET</Text>
          <Text style={styles.bpFooterVal}>
            ₹{(activeTab === 'DOCTORS' ? totalDoctorTarget : totalRetailerTarget).toLocaleString('en-IN')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bpSubmitBtn}
          onPress={() =>
            Alert.alert(
              'Targets Saved ✅',
              `Monthly target of ₹${(activeTab === 'DOCTORS' ? totalDoctorTarget : totalRetailerTarget).toLocaleString('en-IN')} has been submitted to HQ.`
            )
          }
        >
          <Text style={styles.bpSubmitBtnText}>SUBMIT TARGET</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* =========================================================================================
   6. MONTHLY SUMMARY & CIRCULAR GAUGES (Images 29 & 31)
   ========================================================================================= */
export const MonthlySummaryScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedAgent, setSelectedAgent] = useState({
    id: 'usr-01',
    name: 'Pranjal Malakar',
    role: 'MEDICAL_REP',
    territory: 'Karimganj Beat (Barak Valley)',
  });
  const [userRole, setUserRole] = useState<'MEDICAL_REP' | 'AREA_MANAGER'>('MEDICAL_REP');
  
  const [monthYearModalVisible, setMonthYearModalVisible] = useState(false);
  const [agentModalVisible, setAgentModalVisible] = useState(false);

  const teamAgents = [
    { id: 'usr-0002', name: 'Pranjal Malakar', role: 'MEDICAL_REP', employeeCode: '0002', territory: 'Silchar & Karimganj Beat (Barak Valley)' },
    { id: 'usr-0001', name: 'Bodrud Jaman Sadiol', role: 'REGIONAL_MANAGER', employeeCode: '0001', territory: 'Barak Valley Division HQ' },
    { id: 'usr-0003', name: 'Rahul Das', role: 'MEDICAL_REP', employeeCode: '0003', territory: 'Hailakandi District' },
    { id: 'usr-0004', name: 'Bikash Paul', role: 'MEDICAL_REP', employeeCode: '0004', territory: 'Badarpur & Rural Corridor' },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2025', '2026', '2027'];

  const handleAgentClick = () => {
    if (userRole === 'MEDICAL_REP') {
      Alert.alert(
        '🔒 Access Restricted to RSM / Admin',
        'Medical Representatives (MR) are only authorized to view their own Monthly Performance Summary.\n\nOnly a Regional Sales Manager (RSM) or System Admin can inspect and switch between other agents.'
      );
    } else {
      setAgentModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Monthly Summary" subtitle="Barak Division Field Performance" showBack onBack={onBack} />
      
      {/* Role Switcher Pill for Demo/Testing Authority */}
      <View style={styles.authBadgeBanner}>
        <Text style={styles.authBadgeLabel}>Current Authority:</Text>
        <TouchableOpacity
          style={[styles.authRolePill, userRole === 'AREA_MANAGER' && styles.authRolePillABM]}
          onPress={() => {
            const next = userRole === 'MEDICAL_REP' ? 'AREA_MANAGER' : 'MEDICAL_REP';
            setUserRole(next);
            Alert.alert(
              `Switched to ${next === 'AREA_MANAGER' ? 'ABM (Admin Access)' : 'Medical Representative (MR)'}`,
              next === 'AREA_MANAGER'
                ? 'You now have full authority to select and view any field agent summary.'
                : 'Locked mode: MR can only view their own profile summary.'
            );
          }}
        >
          <Ionicons
            name={userRole === 'AREA_MANAGER' ? 'shield-checkmark' : 'lock-closed'}
            size={13}
            color={userRole === 'AREA_MANAGER' ? '#16A34A' : '#2563EB'}
          />
          <Text style={[styles.authRoleText, userRole === 'AREA_MANAGER' && styles.authRoleTextABM]}>
            {userRole === 'AREA_MANAGER' ? 'ABM / Admin Mode' : 'MR Mode (Own Profile Only)'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month, Year & User Selector Card */}
        <View style={styles.summarySelectorCard}>
          {/* Month & Year Row */}
          <TouchableOpacity
            style={styles.summarySelectorRow}
            onPress={() => setMonthYearModalVisible(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="calendar-outline" size={16} color="#2563EB" />
              <Text style={styles.summarySelectorText}>{selectedMonth} {selectedYear}</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* Agent Row with ABM Authority Lock */}
          <TouchableOpacity
            style={styles.agentSelectorRow}
            onPress={handleAgentClick}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryUserName}>{selectedAgent.name}</Text>
              <Text style={styles.summaryUserTerritory}>{selectedAgent.territory}</Text>
            </View>
            <View style={styles.agentLockBadge}>
              {userRole === 'AREA_MANAGER' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Text style={styles.switchAgentText}>Switch Agent</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="lock-closed" size={12} color="#94A3B8" />
                  <Text style={styles.lockedText}>Locked</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* 3 Circular Dials / Gauges matching Images 29 & 31 */}
        <View style={styles.gaugesContainer}>
          <View style={styles.gaugeCard}>
            <View style={styles.circleDial}>
              <Text style={styles.dialCount}>4</Text>
              <Text style={styles.dialLabel}>Doctor</Text>
            </View>
          </View>
          <View style={styles.gaugeCard}>
            <View style={styles.circleDial}>
              <Text style={styles.dialCount}>0</Text>
              <Text style={styles.dialLabel}>Chem / Stk</Text>
            </View>
          </View>
          <View style={styles.gaugeCard}>
            <View style={styles.circleDial}>
              <Text style={styles.dialCount}>0</Text>
              <Text style={styles.dialLabel}>Hospital</Text>
            </View>
          </View>
        </View>

        {/* POB Section matching Images 29 & 31 */}
        <Text style={styles.sectionHeaderLabel}>POB</Text>
        <View style={styles.pobSectionCard}>
          <View style={styles.pobMainBox}>
            <Text style={styles.pobMainVal}>₹0</Text>
            <Text style={styles.pobMainLabel}>Total POB</Text>
          </View>
          <View style={styles.pobSubCols}>
            <View style={styles.pobSubBox}>
              <Text style={styles.pobSubVal}>₹0</Text>
              <Text style={styles.pobSubLabel}>Doctor</Text>
            </View>
            <View style={styles.pobSubBox}>
              <Text style={styles.pobSubVal}>₹0</Text>
              <Text style={styles.pobSubLabel}>Chem / Stk</Text>
            </View>
          </View>
        </View>

        {/* Tour Program Status */}
        <Text style={styles.sectionHeaderLabel}>Tour Program Status</Text>
        <View style={styles.tpStatusCard}>
          <Ionicons name="calendar-outline" size={20} color="#16A34A" />
          <Text style={styles.tpStatusText}>Approved</Text>
        </View>
      </ScrollView>

      {/* Month & Year Selection Modal */}
      <Modal visible={monthYearModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.createModalBox}>
            <Text style={styles.modalHeaderTitle}>Select Month & Year</Text>
            
            <Text style={styles.modalFieldLabel}>Year</Text>
            <View style={styles.pillSelectRow}>
              {years.map(y => (
                <TouchableOpacity
                  key={y}
                  style={[styles.pillOption, selectedYear === y && styles.pillOptionActive]}
                  onPress={() => setSelectedYear(y)}
                >
                  <Text style={[styles.pillOptionText, selectedYear === y && styles.pillOptionTextActive]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalFieldLabel}>Month</Text>
            <View style={[styles.pillSelectRow, { maxHeight: 180 }]}>
              {months.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.pillOption, selectedMonth === m && styles.pillOptionActive]}
                  onPress={() => setSelectedMonth(m)}
                >
                  <Text style={[styles.pillOptionText, selectedMonth === m && styles.pillOptionTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.detailCloseBtn, { marginTop: 16 }]}
              onPress={() => setMonthYearModalVisible(false)}
            >
              <Text style={styles.detailCloseBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Agent Selection Modal (ABM/Admin Authority) */}
      <Modal visible={agentModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.createModalBox}>
            <Text style={styles.modalHeaderTitle}>Select Field Representative (ABM)</Text>
            <Text style={styles.modalSubtitle}>Barak Valley Division Team Members</Text>

            <View style={{ marginVertical: 12, gap: 8 }}>
              {teamAgents.map(ag => (
                <TouchableOpacity
                  key={ag.id}
                  style={[
                    styles.agentListItem,
                    selectedAgent.id === ag.id && styles.agentListItemActive,
                  ]}
                  onPress={() => {
                    setSelectedAgent(ag);
                    setAgentModalVisible(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.agentListName, selectedAgent.id === ag.id && styles.agentListNameActive]}>
                      {ag.name}
                    </Text>
                    <Text style={styles.agentListTerritory}>{ag.territory}</Text>
                  </View>
                  {selectedAgent.id === ag.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setAgentModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* =========================================================================================
   7. REPORTS HUB (18+ Reports Grid with In-App Preview before Share)
   ========================================================================================= */
interface ReportDataPayload {
  id: string;
  title: string;
  subtitle: string;
  kpis: { label: string; value: string }[];
  headers: string[];
  rows: string[][];
}

export const ReportsHubScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeReport, setActiveReport] = useState<ReportDataPayload | null>(null);
  const [viewerModalVisible, setViewerModalVisible] = useState(false);
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  const reportItems = [
    { id: 'DOCTOR_PREFERRED_DAY', title: 'Doctor Preferred Day', icon: 'time-outline' },
    { id: 'DOCTORS_WISE_SALES', title: 'Doctors Wise Sales Report', icon: 'trending-up-outline' },
    { id: 'HQ_WISE_TARGET', title: 'HQ Wise Target Report', icon: 'business-outline' },
    { id: 'ACTIVITY_REPORT', title: 'Activity Report', icon: 'document-text-outline' },
    { id: 'MISSED_CALL_REPORT', title: 'Missed Call Report', icon: 'close-circle-outline' },
    { id: 'COVERAGE_REPORT', title: 'Coverage Report', icon: 'pie-chart-outline' },
    { id: 'TARGET_VS_ACHIEVE', title: 'Target Vs Achievement', icon: 'analytics-outline' },
    { id: 'EXPENSE_REPORT', title: 'Expense Report', icon: 'cash-outline' },
    { id: 'ATTENDANCE_REPORT', title: 'Attendance Report', icon: 'calendar-outline' },
    { id: 'FIRM_COVERAGE', title: 'Firm Coverage Report', icon: 'storefront-outline' },
    { id: 'INCHARGE_POB', title: 'Incharge POB Report', icon: 'receipt-outline' },
    { id: 'PAYMENT_COLLECTION', title: 'Payment Collection Report', icon: 'wallet-outline' },
    { id: 'YEARLY_SALES', title: 'Yearly Sales Report', icon: 'bar-chart-outline' },
    { id: 'HOSPITAL_CALL', title: 'Hospital Call Report', icon: 'medkit-outline' },
    { id: 'PRODUCT_TARGET', title: 'Product Target Report', icon: 'cube-outline' },
    { id: 'BIFURCATE_SALES', title: 'Bifurcate Sales Report', icon: 'git-branch-outline' },
    { id: 'SECONDARY_PRIMARY', title: 'Secondary / Primary Sales', icon: 'swap-horizontal-outline' },
    { id: 'TEAM_SUMMARY', title: 'Team Summary Report', icon: 'people-outline' },
    { id: 'ROI_REPORT', title: 'ROI Report', icon: 'stats-chart-outline' },
    { id: 'RCPA_REPORT', title: 'RCPA Report', icon: 'newspaper-outline' },
  ];

  const getReportData = (id: string, title: string): ReportDataPayload => {
    switch (id) {
      case 'DOCTOR_PREFERRED_DAY':
        return {
          id,
          title,
          subtitle: 'Doctor Calling Schedules & Preferred Time Windows',
          kpis: [
            { label: 'Total Doctors', value: '4 Prescribers' },
            { label: 'Morning Visits', value: '3' },
            { label: 'Evening Visits', value: '1' },
          ],
          headers: ['Doctor Name', 'Specialty', 'Preferred Day', 'Preferred Time', 'Area'],
          rows: [
            ['Dr. Sanjay Solanki', 'Cardiologist', 'Mon, Wed, Fri', '11:30 AM - 01:30 PM', 'Hospital Road, Silchar'],
            ['Dr. Vijay Thakur', 'Orthopedic', 'Tue, Thu, Sat', '12:00 PM - 02:00 PM', 'SMCH Ghungoor, Silchar'],
            ['Dr. Debashis Nath', 'Pediatrician', 'Daily', '05:00 PM - 07:30 PM', 'Park Road, Silchar'],
            ['Dr. Abdul Basit', 'Physician', 'Mon, Thu', '10:30 AM - 01:00 PM', 'Station Road, Karimganj'],
          ],
        };
      case 'DOCTORS_WISE_SALES':
        return {
          id,
          title,
          subtitle: 'Doctor-Level Secondary Rx & Sales Contribution',
          kpis: [
            { label: 'Total Target', value: '₹95,000' },
            { label: 'Achieved Rx', value: '₹1,02,500' },
            { label: 'Achievement', value: '107.8%' },
          ],
          headers: ['Doctor Name', 'Territory', 'Target (₹)', 'Achieved (₹)', 'Growth %'],
          rows: [
            ['Dr. Gautam Roy Sharma', 'Karimganj Town', '₹35,000', '₹38,200', '+9.1%'],
            ['Dr. Sanjay Solanki', 'Silchar Central', '₹30,000', '₹32,500', '+8.3%'],
            ['Dr. Abul Hussain', 'Karimganj Beat', '₹18,000', '₹19,800', '+10.0%'],
            ['Dr. Vijay Thakur', 'SMCH Beat', '₹12,000', '₹12,000', '0.0%'],
          ],
        };
      case 'ATTENDANCE_REPORT':
        return {
          id,
          title,
          subtitle: 'Monthly Field Check-In & GPS Geofence Attendance Log',
          kpis: [
            { label: 'Working Days', value: '26 Days' },
            { label: 'Present / On Time', value: '24' },
            { label: 'Late Approved', value: '2' },
          ],
          headers: ['Date', 'Check-In', 'Check-Out', 'GPS Accuracy', 'Status'],
          rows: [
            ['26 Sep 2026', '09:42 AM', '06:15 PM', '12m (High)', 'On Time ✅'],
            ['25 Sep 2026', '09:50 AM', '06:30 PM', '10m (High)', 'On Time ✅'],
            ['24 Sep 2026', '10:45 AM', '07:00 PM', '15m (High)', 'Late (Approved) ⚠️'],
            ['23 Sep 2026', '09:30 AM', '06:00 PM', '8m (High)', 'On Time ✅'],
            ['22 Sep 2026', '09:40 AM', '06:20 PM', '14m (High)', 'On Time ✅'],
          ],
        };
      case 'EXPENSE_REPORT':
        return {
          id,
          title,
          subtitle: 'Standard Fare Chart (SFC) Verified Expense Claims',
          kpis: [
            { label: 'Total Claimed', value: '₹4,116' },
            { label: 'Approved Claims', value: '4 of 5' },
            { label: 'Total Travel', value: '332 Km' },
          ],
          headers: ['Date', 'Route Destination', 'Distance', 'TA/DA', 'Status'],
          rows: [
            ['26 Sep 2026', 'Karimganj Central Beat', '18 km', '₹304', 'UnApproved ⏳'],
            ['25 Sep 2026', 'Patharkandi Route', '70 km', '₹710', 'Approved ✅'],
            ['24 Sep 2026', 'Makunda Outstation', '154 km', '₹2,132', 'Approved ✅'],
            ['23 Sep 2026', 'Badarpur Junction', '66 km', '₹648', 'Approved ✅'],
            ['22 Sep 2026', 'Lakhibazar Route', '24 km', '₹322', 'Approved ✅'],
          ],
        };
      default:
        return {
          id,
          title,
          subtitle: 'Barak Valley Division Territory MIS Analytics',
          kpis: [
            { label: 'Total Records', value: '5 Entries' },
            { label: 'Target / Scheduled', value: '18 Calls' },
            { label: 'Coverage Rate', value: '88.5%' },
          ],
          headers: ['Entity / Name', 'Category', 'Target / Scheduled', 'Achieved / Actual', 'Variance / %'],
          rows: [
            ['Dr. Gautam Roy Sharma', 'Core Prescriber', '4 Calls', '4 Calls', '100%'],
            ['Dr. Abul Hussain', 'General Prescriber', '2 Calls', '1 Call', '50%'],
            ['Asha Medical', 'Retail Pharmacy', '₹40,000', '₹42,500', '+6.2%'],
            ['Alif Medication', 'Retail Pharmacy', '₹30,000', '₹28,000', '-6.6%'],
            ['SMCH Tertiary Corridor', 'Hospital Beat', '12 Calls', '10 Calls', '83.3%'],
          ],
        };
    }
  };

  const handleOpenReport = (reportId: string, title: string) => {
    const data = getReportData(reportId, title);
    setActiveReport(data);
    setReportSearchQuery('');
    setViewerModalVisible(true);
  };

  const handleShareCurrentReport = async () => {
    if (!activeReport) return;
    await PdfReportService.generateAndShareReport(
      { title: activeReport.title, subtitle: `${activeReport.subtitle} (Barak Valley)` },
      activeReport.headers,
      activeReport.rows,
      activeReport.kpis
    );
  };

  const filteredRows = activeReport
    ? activeReport.rows.filter(row =>
        row.some(cell => cell.toLowerCase().includes(reportSearchQuery.toLowerCase()))
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Reports & Analytics" subtitle="18+ Strategic MIS Reports" showBack onBack={onBack} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.reportsGrid}>
          {reportItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.reportTile}
              onPress={() => handleOpenReport(item.id, item.title)}
            >
              <View style={styles.reportIconBox}>
                <Ionicons name={item.icon as any} size={24} color="#2563EB" />
              </View>
              <Text style={styles.reportTileText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* In-App Report Viewer Modal */}
      <Modal visible={viewerModalVisible} animationType="slide">
        <SafeAreaView style={styles.viewerContainer}>
          {activeReport && (
            <>
              {/* Top Viewer Header */}
              <View style={styles.viewerHeader}>
                <TouchableOpacity
                  style={styles.viewerBackBtn}
                  onPress={() => setViewerModalVisible(false)}
                >
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.viewerHeaderTitle}>{activeReport.title}</Text>
                  <Text style={styles.viewerHeaderSubtitle}>{activeReport.subtitle}</Text>
                </View>
              </View>

              {/* KPI Summary Strip */}
              <View style={styles.viewerKpiRow}>
                {activeReport.kpis.map((kpi, idx) => (
                  <View key={idx} style={styles.viewerKpiCard}>
                    <Text style={styles.viewerKpiVal}>{kpi.value}</Text>
                    <Text style={styles.viewerKpiLabel}>{kpi.label}</Text>
                  </View>
                ))}
              </View>

              {/* In-Report Search Bar */}
              <View style={styles.viewerSearchBox}>
                <Ionicons name="search-outline" size={16} color="#64748B" />
                <TextInput
                  style={styles.viewerSearchInput}
                  placeholder={`Search in ${activeReport.title}...`}
                  placeholderTextColor="#94A3B8"
                  value={reportSearchQuery}
                  onChangeText={setReportSearchQuery}
                />
                {reportSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setReportSearchQuery('')}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Scrollable Data Table Preview */}
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 90 }}>
                <View style={styles.tableCard}>
                  {/* Table Header */}
                  <View style={styles.tableHeaderRow}>
                    {activeReport.headers.map((h, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.tableHeaderCell,
                          i === 0 ? { flex: 2 } : { flex: 1.2, textAlign: 'center' },
                        ]}
                      >
                        {h}
                      </Text>
                    ))}
                  </View>

                  {/* Table Body Rows */}
                  {filteredRows.map((row, rIdx) => (
                    <View
                      key={rIdx}
                      style={[
                        styles.tableDataRow,
                        rIdx % 2 === 1 && { backgroundColor: '#F8FAFC' },
                      ]}
                    >
                      {row.map((cell, cIdx) => (
                        <Text
                          key={cIdx}
                          style={[
                            styles.tableDataCell,
                            cIdx === 0
                              ? { flex: 2, fontWeight: '700', color: colors.textPrimary }
                              : { flex: 1.2, textAlign: 'center' },
                          ]}
                        >
                          {cell}
                        </Text>
                      ))}
                    </View>
                  ))}

                  {filteredRows.length === 0 && (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                      <Text style={{ color: '#64748B', fontSize: 13 }}>No matching records found.</Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Bottom Sticky Actions: Close & Share PDF */}
              <View style={styles.viewerBottomBar}>
                <TouchableOpacity
                  style={styles.viewerCloseBtn}
                  onPress={() => setViewerModalVisible(false)}
                >
                  <Text style={styles.viewerCloseText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.viewerSharePdfBtn}
                  onPress={handleShareCurrentReport}
                >
                  <Ionicons name="share-social-outline" size={18} color="#ffffff" />
                  <Text style={styles.viewerSharePdfText}>Export & Share PDF</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

/* =========================================================================================
   8. NOTIFICATIONS & FILES SCREENS
   ========================================================================================= */
export const NotificationsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <Header title="Notifications" subtitle="HQ Broadcasts & Circulars" showBack onBack={onBack} />
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.notifRow}>
          <Ionicons name="megaphone-outline" size={20} color="#2563EB" />
          <Text style={styles.notifTitle}>New Incentive Scheme Active for Barak Valley</Text>
        </View>
        <Text style={styles.notifSub}>
          Special Q3 rewards on CardioPulse & CefoPulse-CV prescriptions in Silchar, Hailakandi & Karimganj.
        </Text>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

export const FilesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <SafeAreaView style={styles.container}>
    <Header title="Visual Aids & Literature" subtitle="e-Detailing Literature" showBack onBack={onBack} />
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card>
        <View style={styles.notifRow}>
          <Ionicons name="document-attach-outline" size={20} color="#DC2626" />
          <Text style={styles.notifTitle}>CardioPulse-AM Visual Aid (Barak Ed.)</Text>
        </View>
        <Text style={styles.notifSub}>Interactive detailing flipchart with clinical trial charts.</Text>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

/* =========================================================================================
   STYLES
   ========================================================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: 60 },

  // Custom Header matching Image 32
  customHeader: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeftBtn: { padding: 4 },
  headerTitleText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  headerRightActionText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  // Month Navigator
  monthNavCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  monthNavTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },

  // Calendar
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  weekHeaderText: { fontSize: 12, fontWeight: '700', color: '#64748B', width: (width - 32) / 7, textAlign: 'center' },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 6,
    ...shadows.sm,
  },
  calCell: {
    width: (width - 44) / 7,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
    borderRadius: radius.sm,
  },
  calCellEmpty: { width: (width - 44) / 7, height: 48 },
  calCellToday: { backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#3B82F6' },
  calDayNum: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  calDayNumToday: { color: '#1D4ED8', fontWeight: '800' },
  statusDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 3 },

  // Legend Card
  legendCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 12, color: colors.textPrimary, fontWeight: '500' },

  // Full width bottom button
  bottomBarFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  fullWidthBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fullWidthBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  actionModalBox: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    ...shadows.lg,
  },
  actionModalHeader: { backgroundColor: '#3B82F6', padding: 14 },
  actionModalHeaderTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  actionModalBody: { padding: 16 },
  actionModalCityNote: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleActive: { borderColor: '#3B82F6' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' },
  radioLabel: { fontSize: 13, color: colors.textPrimary },
  actionModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionModalCancelBtn: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  actionModalCancelText: { color: '#64748B', fontWeight: '700' },
  actionModalOkBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  actionModalOkText: { color: '#3B82F6', fontWeight: '800' },

  createModalBox: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalHeaderTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  modalFieldLabel: { fontSize: 12, fontWeight: '600', color: '#475569', marginTop: 8, marginBottom: 4 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
  },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  modalBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.sm },
  modalBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },

  // Top Tab Switchers
  topTabRow: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, margin: spacing.md, borderRadius: radius.md },
  topTabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  topTabBtnActive: { backgroundColor: '#3B82F6' },
  topTabBtnText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  topTabBtnTextActive: { color: '#ffffff' },

  // Expenses Styles
  exportBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exportBarTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  exportPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    gap: 4,
  },
  exportPdfBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  expenseCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    ...shadows.sm,
  },
  expenseCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expenseDate: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  expenseRoute: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusApproved: { backgroundColor: '#DCFCE7' },
  statusApprovedText: { color: '#16A34A', fontSize: 10, fontWeight: '800' },
  statusUnapproved: { backgroundColor: '#FEF3C7' },
  statusUnapprovedText: { color: '#D97706', fontSize: 10, fontWeight: '800' },
  expenseMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  expenseMetaItem: { fontSize: 11, color: '#64748B' },
  expenseTotalText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },

  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    borderRadius: radius.md,
    marginBottom: 12,
    ...shadows.sm,
  },
  searchBarInput: { flex: 1, paddingVertical: 10, paddingLeft: 8, fontSize: 13, color: colors.textPrimary },
  sfcTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
  },
  sfcHeaderCol: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  sfcTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  sfcDestText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  sfcFromText: { fontSize: 10, color: '#64748B' },
  sfcCellText: { fontSize: 12, color: '#475569' },
  sfcCellBold: { fontSize: 12, fontWeight: '700', color: '#2563EB' },

  expenseDetailModal: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 18,
    width: '100%',
    maxWidth: 380,
    ...shadows.lg,
  },
  expenseDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  expenseDetailTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  expenseDetailBody: { marginVertical: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  detailLabel: { fontSize: 12, color: '#64748B' },
  detailValue: { fontSize: 12, color: colors.textPrimary, fontWeight: '600' },
  detailRemarkBox: { backgroundColor: '#F8FAFC', padding: 8, borderRadius: radius.sm, marginTop: 8 },
  detailRemarkLabel: { fontSize: 11, fontWeight: '700', color: '#475569' },
  detailRemarkText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  detailCloseBtn: { backgroundColor: '#3B82F6', borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  detailCloseBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },

  // Leave Styles
  leaveTableBox: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  leaveTableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaveTableHeaderCol1: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  leaveTableHeaderCol2: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  leaveTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#F8FAFC',
  },
  leaveTypeName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  leaveBalanceText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  leaveBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  recentActivityBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  recentActivityBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  applyLeaveBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  applyLeaveBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },

  pillSelectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  pillOption: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: '#F1F5F9' },
  pillOptionActive: { backgroundColor: '#3B82F6' },
  pillOptionText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  pillOptionTextActive: { color: '#ffffff' },
  historyRow: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  historyType: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  historyDates: { fontSize: 11, color: '#64748B', marginVertical: 2 },

  // Holidays
  holidayCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  holidayDateBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  holidayDateNum: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  holidayDateMonth: { fontSize: 9, fontWeight: '700', color: '#3B82F6', textTransform: 'uppercase' },
  holidayName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  holidaySub: { fontSize: 11, color: '#64748B', marginTop: 2 },

  // Business Planning
  bpCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    ...shadows.sm,
  },
  bpCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bpDocName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  bpDocSpecialty: { fontSize: 12, color: '#2563EB', fontWeight: '600', marginTop: 2 },
  bpArea: { fontSize: 11, color: '#64748B', marginTop: 2 },
  bpInputsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  bpInputCol: { flex: 1 },
  bpInputLabel: { fontSize: 11, fontWeight: '600', color: '#64748B', marginBottom: 4 },
  bpReadOnlyVal: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: radius.sm,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  bpTextInput: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: radius.sm,
    padding: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  bpFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.lg,
  },
  bpFooterLeft: { flex: 1 },
  bpFooterLabel: { fontSize: 10, fontWeight: '800', color: '#64748B' },
  bpFooterVal: { fontSize: 18, fontWeight: '900', color: '#2563EB' },
  bpSubmitBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.sm,
  },
  bpSubmitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },

  // Monthly Summary & Authority Styles
  authBadgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#BFDBFE',
  },
  authBadgeLabel: { fontSize: 11, fontWeight: '700', color: '#1E40AF' },
  authRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  authRolePillABM: { backgroundColor: '#DCFCE7' },
  authRoleText: { fontSize: 11, fontWeight: '800', color: '#1D4ED8' },
  authRoleTextABM: { color: '#16A34A' },

  summarySelectorCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 12,
    ...shadows.sm,
  },
  summarySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  summarySelectorText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  agentSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  summaryUserName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  summaryUserTerritory: { fontSize: 11, color: '#64748B', marginTop: 2 },
  agentLockBadge: { flexDirection: 'row', alignItems: 'center' },
  switchAgentText: { fontSize: 11, fontWeight: '800', color: '#2563EB' },
  lockedText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },

  agentListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  agentListItemActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  agentListName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  agentListNameActive: { color: '#2563EB' },
  agentListTerritory: { fontSize: 11, color: '#64748B', marginTop: 2 },
  modalCancelBtn: { alignItems: 'center', paddingVertical: 10, marginTop: 8 },
  modalCancelText: { color: '#64748B', fontWeight: '700', fontSize: 13 },

  gaugesContainer: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  gaugeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    ...shadows.sm,
  },
  circleDial: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialCount: { fontSize: 18, fontWeight: '800', color: '#2563EB' },
  dialLabel: { fontSize: 10, color: '#64748B', marginTop: 2 },
  sectionHeaderLabel: { fontSize: 12, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: 6 },
  pobSectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    flexDirection: 'row',
    padding: 14,
    marginBottom: 14,
    ...shadows.sm,
  },
  pobMainBox: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: '#F1F5F9' },
  pobMainVal: { fontSize: 20, fontWeight: '900', color: '#D97706' },
  pobMainLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  pobSubCols: { flex: 1, paddingLeft: 12, justifyContent: 'center', gap: 6 },
  pobSubBox: { flexDirection: 'row', justifyContent: 'space-between' },
  pobSubVal: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  pobSubLabel: { fontSize: 11, color: '#64748B' },
  tpStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadows.sm,
  },
  tpStatusText: { fontSize: 13, fontWeight: '700', color: '#16A34A' },

  // Reports Hub & Viewer
  reportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reportTile: {
    width: (width - 42) / 2,
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    ...shadows.sm,
  },
  reportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  reportTileText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },

  viewerContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  viewerBackBtn: { padding: 4 },
  viewerHeaderTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  viewerHeaderSubtitle: { color: '#DBEAFE', fontSize: 11, marginTop: 2 },
  viewerKpiRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewerKpiCard: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  viewerKpiVal: { fontSize: 13, fontWeight: '900', color: '#1D4ED8' },
  viewerKpiLabel: { fontSize: 9, fontWeight: '700', color: '#64748B', marginTop: 2, textTransform: 'uppercase' },
  viewerSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  viewerSearchInput: { flex: 1, paddingVertical: 8, paddingLeft: 6, fontSize: 12, color: colors.textPrimary },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderCell: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  tableDataCell: { fontSize: 11, color: '#475569' },
  viewerBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  viewerCloseBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  viewerCloseText: { color: '#475569', fontWeight: '800', fontSize: 13 },
  viewerSharePdfBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.sm,
    gap: 6,
  },
  viewerSharePdfText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },

  notifRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginLeft: 6 },
  notifSub: { fontSize: 11, color: '#64748B', marginLeft: 26 },
});
