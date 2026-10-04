import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import { SyncService, SyncStats } from '../../services/sync/syncService';

interface SyncStatusBarProps {
  onOpenSyncCenter?: () => void;
  compact?: boolean;
}

export const SyncStatusBar: React.FC<SyncStatusBarProps> = ({
  onOpenSyncCenter,
  compact = false,
}) => {
  const [stats, setStats] = useState<SyncStats>({
    pending: 0,
    syncing: 0,
    synced: 0,
    failed: 0,
    total: 0,
    lastSyncTime: null,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsub = SyncService.subscribe(s => {
      setStats(s);
      setIsSyncing(s.syncing > 0);
    });
    return () => unsub();
  }, []);

  const handleClickToSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await SyncService.syncAll();
      if (result.success) {
        if (result.processedCount > 0) {
          Alert.alert('Cloud Sync Complete ✅', result.message);
        } else {
          Alert.alert('Up to Date 🟢', 'All field visits, orders, and telemetry are already synced.');
        }
      } else {
        Alert.alert('Sync Incomplete ⚠️', result.message);
      }
    } catch (e: any) {
      Alert.alert('Sync Error', e?.message || 'Failed to sync with cloud server.');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (iso: string | null) => {
    if (!iso) return 'Not yet synced';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  const hasPending = stats.pending > 0 || stats.failed > 0;

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          hasPending ? styles.compactPending : styles.compactSynced,
        ]}
        onPress={handleClickToSync}
        activeOpacity={0.8}
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
        ) : (
          <Ionicons
            name={hasPending ? 'cloud-upload-outline' : 'checkmark-circle-outline'}
            size={16}
            color="#FFFFFF"
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={styles.compactText}>
          {isSyncing
            ? 'Syncing...'
            : hasPending
            ? `${stats.pending + stats.failed} Pending • Click to Sync`
            : 'All Synced'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftInfo}>
        <View style={styles.statusIndicatorRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isSyncing
                  ? colors.info
                  : stats.failed > 0
                  ? colors.danger
                  : stats.pending > 0
                  ? colors.warning
                  : colors.success,
              },
            ]}
          />
          <Text style={styles.statusTitle}>
            {isSyncing
              ? 'Synchronizing with Cloud...'
              : stats.failed > 0
              ? `${stats.failed} Record${stats.failed > 1 ? 's' : ''} Failed`
              : stats.pending > 0
              ? `${stats.pending} Offline Record${stats.pending > 1 ? 's' : ''} Pending`
              : 'All Field Data Synced'}
          </Text>
        </View>

        <Text style={styles.lastSyncSubtitle}>
          Last Synced: {formatLastSync(stats.lastSyncTime)} • {stats.synced} Synced Total
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.syncBtn,
            hasPending ? styles.syncBtnActive : styles.syncBtnNeutral,
          ]}
          onPress={handleClickToSync}
          disabled={isSyncing}
          activeOpacity={0.8}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.syncBtnText}>
                {hasPending ? 'Click to Sync' : 'Re-sync'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {onOpenSyncCenter && (
          <TouchableOpacity
            style={styles.openCenterBtn}
            onPress={onOpenSyncCenter}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="layers-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
    ...shadows.sm,
  },
  leftInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusTitle: {
    color: '#F8FAFC',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  lastSyncSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
  },
  syncBtnActive: {
    backgroundColor: '#2563EB',
  },
  syncBtnNeutral: {
    backgroundColor: '#334155',
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
  },
  openCenterBtn: {
    padding: 6,
    borderRadius: radius.sm,
    backgroundColor: '#0F172A',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  compactPending: {
    backgroundColor: '#F59E0B',
  },
  compactSynced: {
    backgroundColor: '#10B981',
  },
  compactText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
