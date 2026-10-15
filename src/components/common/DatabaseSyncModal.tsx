import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { SupabaseService } from '../../services/supabaseService';
import { Database, Download, Upload, CheckCircle2, AlertTriangle, RefreshCw, X, Copy, Check, Cloud } from 'lucide-react';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatabaseUpdated: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({
  isOpen,
  onClose,
  onDatabaseUpdated,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const isCloudConnected = SupabaseService.isConnected();
  const currentBackupJSON = StorageService.exportFullDatabaseJSON();
  const doctors = StorageService.getDoctors();
  const chemists = StorageService.getChemists();
  const products = StorageService.getProducts();
  const users = StorageService.getUsers();
  const territories = StorageService.getTerritories();
  const companies = StorageService.getCompanies();
  const dcrLogs = StorageService.getDCRLogs();

  const handleCloudSyncNow = async () => {
    setIsSyncingCloud(true);
    setStatusMessage(null);
    try {
      // 1. Fetch any newly added records from Supabase Server
      const [cloudDocs, cloudChems, cloudUsers] = await Promise.all([
        SupabaseService.fetchDoctors(),
        SupabaseService.fetchChemists(),
        SupabaseService.fetchUsers(),
      ]);

      if (cloudDocs.length > 0) StorageService.saveDoctors(cloudDocs);
      if (cloudChems.length > 0) StorageService.saveChemists(cloudChems);
      if (cloudUsers.length > 0) StorageService.saveUsers(cloudUsers);

      // 2. Push local master records to cloud
      const syncResult = await SupabaseService.syncAllLocalToCloud({
        doctors: StorageService.getDoctors(),
        chemists: StorageService.getChemists(),
        products: StorageService.getProducts(),
        users: StorageService.getUsers(),
        companies,
        territories,
        dcrLogs,
      });

      if (syncResult.success) {
        setStatusMessage({ type: 'success', text: syncResult.message });
        onDatabaseUpdated();
      } else {
        setStatusMessage({ type: 'error', text: syncResult.message });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e?.message || 'Error communicating with Cloud Firestore.' });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleDownloadFile = () => {
    try {
      const blob = new Blob([currentBackupJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reppulse_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Backup file downloaded successfully!' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: 'Failed to download file.' });
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(currentBackupJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setStatusMessage({ type: 'success', text: 'Database JSON copied to clipboard!' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleRestoreFromText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreFromText = (raw?: string) => {
    const target = raw || jsonInput;
    if (!target.trim()) return;

    const result = StorageService.importFullDatabaseJSON(target);
    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      onDatabaseUpdated();
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all data to default mock records? Any unsaved changes will be replaced.')) {
      localStorage.clear();
      onDatabaseUpdated();
      setStatusMessage({ type: 'success', text: 'Reset database to default seed state!' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="neu-card rounded-2xl max-w-xl w-full p-6 shadow-neu-raised border border-[#282319] animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] rounded-xl shadow-neu-sunken">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F2ECE1] flex items-center gap-2">
                <span>Database Sync & Cloud Center</span>
                {isCloudConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#101912] text-[#A6C48A] border border-[#384D2B]/60 shadow-neu-sunken">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supabase PostgreSQL Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1a140b] text-[#D4BD95] border border-[#8A7049]/60">
                    Local Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#857866] mt-0.5">
                Connected to Serverless PostgreSQL (<code className="text-[#B99D73]">ibcyqtnpzdttwuhyhlra.supabase.co</code>)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mt-3 p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold shadow-neu-sunken ${
            statusMessage.type === 'success' 
              ? 'bg-[#101912] border-[#384D2B]/60 text-[#A6C48A]' 
              : 'bg-[#1c0f0f] border-[#662B2B]/60 text-rose-400'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          
          {/* Section 1: Live Cloud Supabase Synchronization */}
          <div className="bg-[#0c0c09] p-4 rounded-xl border border-[#282319] shadow-neu-sunken">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#6C5636]/20 text-[#B99D73] rounded-lg border border-[#6C5636]/40">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#F2ECE1] text-xs">Supabase Serverless PostgreSQL</h4>
                  <p className="text-[11px] text-[#857866]">Real-time sync between Web Portal, Field Mobile APK, and Admin DB</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-[#181712] text-[#B99D73] px-2 py-0.5 rounded border border-[#282319]">
                Live Field DB
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="bg-[#181712] p-2 rounded-xl border border-[#282319]">
                <div className="text-base font-bold text-[#F2ECE1]">{doctors.length}</div>
                <div className="text-[10px] text-[#857866]">Doctors</div>
              </div>
              <div className="bg-[#181712] p-2 rounded-xl border border-[#282319]">
                <div className="text-base font-bold text-[#F2ECE1]">{chemists.length}</div>
                <div className="text-[10px] text-[#857866]">Chemists / Firms</div>
              </div>
              <div className="bg-[#181712] p-2 rounded-xl border border-[#282319]">
                <div className="text-base font-bold text-[#B99D73]">{users.length}</div>
                <div className="text-[10px] text-[#857866]">Field Staff / Users</div>
              </div>
            </div>

            <button
              onClick={handleCloudSyncNow}
              disabled={isSyncingCloud}
              className="neu-btn-gold w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Synchronizing with Supabase...' : 'Sync Database with Supabase Server Now'}</span>
            </button>
          </div>

          {/* Section 2: Export Backup */}
          <div className="bg-[#0c0c09] p-4 rounded-xl border border-[#282319] space-y-2 shadow-neu-sunken">
            <h4 className="font-bold text-[#F2ECE1] flex items-center gap-1.5 text-xs">
              <Download className="w-4 h-4 text-[#B99D73]" />
              1. Export / Backup Database
            </h4>
            <p className="text-[#857866] text-[11px]">
              Download your complete database file to transfer to another device or retain an offline backup.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleDownloadFile}
                className="neu-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#F2ECE1] hover:text-[#B99D73] font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON Backup
              </button>
              <button
                onClick={handleCopyJSON}
                className="neu-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1] font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#857866]" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Import / Restore */}
          <div className="bg-[#0c0c09] p-4 rounded-xl border border-[#282319] space-y-2 shadow-neu-sunken">
            <h4 className="font-bold text-[#F2ECE1] flex items-center gap-1.5 text-xs">
              <Upload className="w-4 h-4 text-[#B99D73]" />
              2. Import / Restore Database File
            </h4>
            <p className="text-[#857866] text-[11px]">
              Restore or load doctor and chemist database from a JSON file.
            </p>
            
            <div className="flex items-center gap-2">
              <label className="neu-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#B99D73] hover:text-[#F2ECE1] font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Choose Backup File (.json)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-[#857866] mb-1">Or paste JSON content directly:</label>
              <textarea
                rows={2}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"version": "1.0", "doctors": [...]}'
                className="neu-input w-full font-mono text-[11px] p-2.5"
              />
              {jsonInput && (
                <button
                  onClick={() => handleRestoreFromText()}
                  className="neu-btn-gold mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Apply & Restore Pasted Data
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Reset */}
          <div className="pt-2 flex items-center justify-between text-[#857866] border-t border-[#282319]">
            <span className="text-[11px]">Need to clear local cache?</span>
            <button
              onClick={handleResetToDefault}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Local Storage
            </button>
          </div>

        </div>

        <div className="mt-4 pt-3.5 border-t border-[#282319] flex items-center justify-end">
          <button
            onClick={onClose}
            className="neu-btn px-4 py-2 rounded-xl text-[#857866] hover:text-[#F2ECE1] font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
