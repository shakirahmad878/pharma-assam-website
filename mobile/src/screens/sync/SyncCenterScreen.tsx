import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SyncService, SyncStats } from '../../services/sync/syncService';
import { SyncQueueItem } from '../../types';

interface SyncCenterScreenProps {
  onBack: () => void;
}

export const SyncCenterScreen: React.FC<SyncCenterScreenProps> = ({ onBack }) => {
  const [stats, setStats] = useState<SyncStats>({
    pending: 0,
    syncing: 0,
    synced: 0,
    failed: 0,
    total: 0,
    lastSyncTime: null,
  });
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SYNCED' | 'FAILED'>('ALL');

  const loadQueue = async () => {
    const q = await SyncService.getQueue();
    setQueue(q);
  };

  useEffect(() => {
    const unsub = SyncService.subscribe(s => {
      setStats(s);
      loadQueue();
    });
    loadQueue();
    return () => unsub();
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    const result = await SyncService.syncAll();
    setSyncing(false);
    if (result.success) {
      Alert.alert('Cloud Sync Complete ✅', result.message);
    } else {
      Alert.alert('Sync Incomplete ⚠️', result.message);
    }
  };

  const handleRetryFailed = async () => {
    setSyncing(true);
    const res = await SyncService.retryFailed();
    setSyncing(false);
    Alert.alert('Retried Records', `Processed: ${res.processedCount}, Failed: ${res.failedCount}`);
  };

  const handleClearSynced = async () => {
    Alert.alert(
      'Clear Synced History',
      'Remove all synced queue records from local memory? (Source records in visits/orders remain preserved)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Synced',
          style: 'destructive',
          onPress: async () => {
            await SyncService.clearSynced();
          },
        },
      ]
    );
  };

  const filteredQueue = queue.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return item.status === 'PENDING' || item.status === 'SYNCING';
    if (filter === 'SYNCED') return item.status === 'SYNCED';
    if (filter === 'FAILED') return item.status === 'FAILED';
    return true;
  });

  const getEntityTitle = (item: SyncQueueItem) => {
    switch (item.entityType) {
      case 'VISIT':
        return item.payload?.doctorName ? `Visit: ${item.payload.doctorName}` : 'Doctor DCR Visit';
      case 'POB_ORDER':
        return item.payload?.firmName ? `POB: ${item.payload.firmName} (₹${item.payload.grandTotal || 0})` : 'Chemist POB Order';
      case 'ATTENDANCE':
        return `Attendance Punch-In (${item.payload?.date || 'Today'})`;
      case 'TELEMETRY':
        return 'GPS Telemetry Ping';
      case 'TOUR_PLAN':
        return `Tour Plan: ${item.payload?.monthName || 'MTP'}`;
      case 'ROUTE_REQUEST':
        return `Route Deviation Request`;
      default:
        return item.entityType.replace('_', ' ');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Sync Center"
        subtitle="Offline Queue & Cloud Dispatch"
        showBack
        onBack={onBack}
        rightAction={
          stats.synced > 0 ? (
            <TouchableOpacity onPress={handleClearSynced} style={styles.clearHeaderBtn}>
              <Text style={styles.clearHeaderText}>Clean</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={styles.content}>
        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statBox, filter === 'PENDING' && styles.statBoxActive, { borderColor: colors.warning }]}
            onPress={() => setFilter(filter === 'PENDING' ? 'ALL' : 'PENDING')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statVal, { color: colors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLbl}>Pending</Text>
          </TouchableOpacity>

          <View style={[styles.statBox, { borderColor: colors.info }]}>
            <Text style={[styles.statVal, { color: colors.info }]}>{stats.syncing}</Text>
            <Text style={styles.statLbl}>Syncing</Text>
          </View>

          <TouchableOpacity
            style={[styles.statBox, filter === 'SYNCED' && styles.statBoxActive, { borderColor: colors.success }]}
            onPress={() => setFilter(filter === 'SYNCED' ? 'ALL' : 'SYNCED')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statVal, { color: colors.success }]}>{stats.synced}</Text>
            <Text style={styles.statLbl}>Synced</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, filter === 'FAILED' && styles.statBoxActive, { borderColor: colors.danger }]}
            onPress={() => setFilter(filter === 'FAILED' ? 'ALL' : 'FAILED')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statVal, { color: colors.danger }]}>{stats.failed}</Text>
            <Text style={styles.statLbl}>Failed</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Click to Sync Action */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.syncNowBtn, syncing && styles.syncNowBtnDisabled]}
            onPress={handleSyncNow}
            disabled={syncing}
            activeOpacity={0.8}
          >
            {syncing ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.syncNowBtnText}>
              {syncing ? 'Synchronizing Records...' : 'Click to Sync All Offline Records'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Extra Action Pills */}
        <View style={styles.subActionsRow}>
          {stats.failed > 0 && (
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetryFailed} disabled={syncing}>
              <Ionicons name="refresh-circle" size={16} color="#EF4444" style={{ marginRight: 4 }} />
              <Text style={styles.retryBtnText}>Retry Failed ({stats.failed})</Text>
            </TouchableOpacity>
          )}

          {stats.synced > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearSynced}>
              <Ionicons name="trash-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
              <Text style={styles.clearBtnText}>Clear Synced Queue</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Indicator & List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionTitle}>
            Queued Records {filter !== 'ALL' ? `(${filter})` : `(${queue.length})`}
          </Text>
          {filter !== 'ALL' && (
            <TouchableOpacity onPress={() => setFilter('ALL')}>
              <Text style={styles.resetFilterText}>Show All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Queue Items List */}
        <FlatList
          data={filteredQueue}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color="#10B981" />
              <Text style={styles.emptyTitle}>All Records Synchronized</Text>
              <Text style={styles.emptySubtitle}>
                No pending offline records. New visits, doctor logs, and orders will queue here automatically.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card style={styles.queueCard}>
              <View style={styles.queueRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={styles.entityName}>{getEntityTitle(item)}</Text>
                  <Text style={styles.createdDate}>
                    Type: {item.entityType} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {item.lastError ? <Text style={styles.errorText}>Error: {item.lastError}</Text> : null}
                  {item.payload?.id && (
                    <Text style={styles.idText}>Local ID: {item.payload.id}</Text>
                  )}
                </View>
                <Badge
                  label={item.status}
                  variant={
                    item.status === 'SYNCED'
                      ? 'success'
                      : item.status === 'FAILED'
                      ? 'danger'
                      : item.status === 'SYNCING'
                      ? 'info'
                      : 'warning'
                  }
                />
              </View>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flex: 1 },
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  statBoxActive: {
    backgroundColor: '#1E293B',
  },
  statVal: { fontSize: 20, fontWeight: 'bold' },
  statLbl: { color: colors.textSecondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  actionRow: { marginBottom: spacing.sm },
  syncNowBtn: {
    backgroundColor: '#2563EB',
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  syncNowBtnDisabled: {
    backgroundColor: '#64748B',
  },
  syncNowBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  subActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    justifyContent: 'flex-end',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: '#FEE2E2',
  },
  retryBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: '#334155',
  },
  clearBtnText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  clearHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearHeaderText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  resetFilterText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  queueCard: { marginBottom: spacing.sm },
  queueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  entityName: { color: colors.textPrimary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  createdDate: { color: colors.textMuted, fontSize: typography.fontSize.xs, marginTop: 2 },
  idText: { color: '#64748B', fontSize: 10, marginTop: 2 },
  errorText: { color: colors.danger, fontSize: typography.fontSize.xs, marginTop: 2 },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
