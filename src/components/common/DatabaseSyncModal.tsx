import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { Database, Download, Upload, CheckCircle2, AlertTriangle, RefreshCw, X, Copy, Check } from 'lucide-react';

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
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentBackupJSON = StorageService.exportFullDatabaseJSON();
  const doctorsCount = StorageService.getDoctors().length;
  const chemistsCount = StorageService.getChemists().length;
  const productsCount = StorageService.getProducts().length;

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
              <h3 className="text-base font-bold text-slate-900">
                Database Sync & Backup Center
              </h3>
              <p className="text-xs text-slate-500">
                Persistent storage across devices • Currently saving <strong>{doctorsCount} Doctors</strong>, <strong>{chemistsCount} Chemists</strong>
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
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          
          {/* Section 1: Export Backup */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Download className="w-4 h-4 text-teal-600" />
              1. Export / Backup Current Master Database
            </h4>
            <p className="text-slate-500 text-[11px]">
              Download your complete database file (doctors, chemists, products, call logs) to transfer to another device or keep a backup.
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

          {/* Section 2: Import / Restore */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Upload className="w-4 h-4 text-blue-600" />
              2. Import / Sync Database File
            </h4>
            <p className="text-slate-500 text-[11px]">
              Restore or load doctor database from a JSON backup file or paste the JSON text below.
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
                rows={3}
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

          {/* Section 3: Reset */}
          <div className="pt-2 flex items-center justify-between text-slate-500 border-t border-slate-100">
            <span className="text-[11px]">Need to start fresh with default demo data?</span>
            <button
              onClick={handleResetToDefault}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Defaults
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
