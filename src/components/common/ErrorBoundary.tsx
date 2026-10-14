import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RepPulse ErrorBoundary caught error]:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#admin';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 neu-card max-w-2xl mx-auto border border-[#282319] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1c0f0f] border border-[#662B2B]/60 text-rose-400 flex items-center justify-center mx-auto shadow-neu-sunken">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F2ECE1]">
              {this.props.fallbackTitle || 'View Failed to Render'}
            </h3>
            <p className="text-xs text-[#857866] mt-1 max-w-md mx-auto">
              An unexpected data or state error occurred while rendering this module. You can reload this view or return to the main dashboard.
            </p>
            {this.state.error?.message && (
              <pre className="mt-3 text-[11px] font-mono text-amber-300/80 bg-[#0c0c09] p-3 rounded-xl border border-[#282319] max-h-28 overflow-auto text-left shadow-neu-sunken">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-[#F2ECE1] flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="neu-btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
