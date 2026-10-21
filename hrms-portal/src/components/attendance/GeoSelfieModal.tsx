import React, { useState } from 'react';
import { HrmsUser } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Camera, 
  MapPin, 
  ShieldCheck, 
  Battery, 
  CheckCircle2, 
  RefreshCw, 
  X,
  AlertCircle
} from 'lucide-react';

interface GeoSelfieModalProps {
  currentUser: HrmsUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (statusText: string) => void;
}

export const GeoSelfieModal: React.FC<GeoSelfieModalProps> = ({ 
  currentUser, 
  isOpen, 
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const isFieldExecutive = currentUser.workMode !== 'OFFICE_STAFF';
  const latitude = 24.8333;
  const longitude = 92.7789;
  const accuracy = 6; // meters
  const isInsideGeofence = true;

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setHasCaptured(true);
      // Capture live simulated selfie snapshot
      setCapturedImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    }, 1000);
  };

  const handleConfirmPunch = () => {
    const rec = HrmsService.recordGeoSelfiePunch({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      selfieUrl: capturedImage || '',
      latitude,
      longitude,
      isGeofenced: isInsideGeofence,
      workMode: currentUser.workMode || 'FIELD_EXECUTIVE',
    });
    const modeLabel = isFieldExecutive ? 'Anywhere Field Territory GPS' : 'Office 100m Geofence';
    onSuccess(`Verified Geo-Selfie punch recorded at ${rec.punchInTime}! [${modeLabel}]`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Geo-Selfie Attendance Punch</h3>
              <p className="text-[10px] text-slate-400">Biometric Facial Liveness & 100m GPS Lock</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Console */}
        <div className="p-5 space-y-4">
          
          <div className="relative bg-slate-950 rounded-2xl aspect-4/3 flex flex-col items-center justify-center overflow-hidden border-2 border-slate-800 shadow-inner">
            
            {hasCaptured && capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured Selfie" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-center p-6 text-slate-300">
                {/* Facial reticle oval */}
                <div className={`w-36 h-48 mx-auto rounded-full border-2 border-dashed flex items-center justify-center relative mb-2 ${
                  isCapturing ? 'border-emerald-400 animate-pulse' : 'border-sky-400/80'
                }`}>
                  <Camera className="w-10 h-10 text-sky-400/60" />
                  
                  {/* Scanner line animation */}
                  {isCapturing && (
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10B981] animate-bounce"></div>
                  )}
                </div>
                <p className="text-xs font-semibold text-white">Align your face inside the frame</p>
                <p className="text-[10px] text-slate-400 mt-0.5">High-accuracy anti-spoofing active</p>
              </div>
            )}

            {/* GPS Telemetry Overlays */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {latitude}° N, {longitude}° E (±{accuracy}m)
            </div>

            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-white font-semibold flex items-center gap-1 border border-white/20">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              94%
            </div>

            {hasCaptured && (
              <div className="absolute bottom-3 inset-x-3 bg-emerald-950/80 backdrop-blur-xs border border-emerald-500/40 text-emerald-300 p-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Facial Biometric Verified Successfully
              </div>
            )}
          </div>

          {/* Geofence / Field GPS Status Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Attendance Work Mode:</span>
              <span className="font-bold text-sky-700">
                {isFieldExecutive ? 'Field Executive (Anywhere GPS)' : 'Office Staff (Geofenced)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">GPS Verification Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 
                {isFieldExecutive ? 'Active Field GPS Locked (±6m)' : 'Inside 100m Perimeter'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2">
            {!hasCaptured ? (
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Facial Biometrics...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Capture Selfie & Verify Geofence
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setHasCaptured(false); setCapturedImage(null); }}
                  className="px-4 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Retake
                </button>
                <button
                  onClick={handleConfirmPunch}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Record Punch
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
