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
        <div className="p-8 my-6 neu-card max-w-2xl mx-auto border border-[#DCE4EB] bg-white text-center space-y-4 rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#10243A]">
              {this.props.fallbackTitle || 'View Failed to Render'}
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              An unexpected data or state error occurred while rendering this module. You can reload this view or return to the main dashboard.
            </p>
            {this.state.error?.message && (
              <pre className="mt-3 text-[11px] font-mono text-rose-700 bg-rose-50/60 p-3 rounded-xl border border-rose-200 max-h-28 overflow-auto text-left">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#10243A] hover:bg-[#182F49] flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
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
