import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { FirestoreService } from '../../services/firestoreService';
import { Database, Download, Upload, CheckCircle2, AlertTriangle, RefreshCw, X, Copy, Check, Cloud, CloudLightning, ShieldCheck } from 'lucide-react';

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

  const isCloudConnected = FirestoreService.isConnected();
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
      // 1. Fetch any newly added records from Cloud Firestore
      const [cloudDocs, cloudChems, cloudProds] = await Promise.all([
        FirestoreService.fetchDoctors(),
        FirestoreService.fetchChemists(),
        FirestoreService.fetchProducts(),
      ]);

      if (cloudDocs.length > 0) StorageService.saveDoctors(cloudDocs);
      if (cloudChems.length > 0) StorageService.saveChemists(cloudChems);
      if (cloudProds.length > 0) StorageService.saveProducts(cloudProds);

      // 2. Push local master records to cloud
      const syncResult = await FirestoreService.syncAllLocalToCloud({
        doctors: StorageService.getDoctors(),
        chemists: StorageService.getChemists(),
        products: StorageService.getProducts(),
        users,
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
        setJsonInput(content);
        handleRestoreFromText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreFromText = (rawText?: string) => {
    const textToImport = rawText || jsonInput;
    if (!textToImport.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste JSON data or select a backup file.' });
      return;
    }

    const result = StorageService.importFullDatabaseJSON(textToImport);
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Database Sync & Cloud Center</span>
                {isCloudConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Cloud Firestore Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Local Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Connected to Google Cloud Firestore (<code>reppulse-pharma</code>)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mt-3 p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          
          {/* Section 1: Live Cloud Firestore Synchronization */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-4 rounded-xl border border-teal-800/50 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Google Cloud Firestore Database</h4>
                  <p className="text-[11px] text-teal-200/70">Real-time sync between Web Portal, Field Mobile App, and Admin DB</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                reppulse-pharma
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700">
                <div className="text-base font-bold text-white">{doctors.length}</div>
                <div className="text-[10px] text-slate-400">Doctors</div>
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700">
                <div className="text-base font-bold text-white">{chemists.length}</div>
                <div className="text-[10px] text-slate-400">Chemists</div>
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700">
                <div className="text-base font-bold text-white">{products.length}</div>
                <div className="text-[10px] text-slate-400">Products</div>
              </div>
            </div>

            <button
              onClick={handleCloudSyncNow}
              disabled={isSyncingCloud}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-md shadow-teal-500/20 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Synchronizing with Firestore...' : 'Sync Database with Cloud Firestore Now'}</span>
            </button>
          </div>

          {/* Section 2: Export Backup */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Download className="w-4 h-4 text-teal-600" />
              1. Export / Backup Database
            </h4>
            <p className="text-slate-500 text-[11px]">
              Download your complete database file to transfer to another device or retain an offline backup.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON Backup
              </button>
              <button
                onClick={handleCopyJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Import / Restore */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Upload className="w-4 h-4 text-blue-600" />
              2. Import / Restore Database File
            </h4>
            <p className="text-slate-500 text-[11px]">
              Restore or load doctor and chemist database from a JSON file.
            </p>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-sm transition-colors">
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
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Or paste JSON content directly:</label>
              <textarea
                rows={2}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"version": "1.0", "doctors": [...]}'
                className="w-full font-mono text-[11px] p-2.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              {jsonInput && (
                <button
                  onClick={() => handleRestoreFromText()}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Apply & Restore Pasted Data
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Reset */}
          <div className="pt-2 flex items-center justify-between text-slate-500 border-t border-slate-100">
            <span className="text-[11px]">Need to clear local cache?</span>
            <button
              onClick={handleResetToDefault}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Local Storage
            </button>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
