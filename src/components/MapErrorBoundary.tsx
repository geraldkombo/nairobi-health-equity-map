"use client";

import { Component } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MapErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 text-center" role="alert">
            <svg className="h-8 w-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <div>
              <p className="text-sm font-medium text-stone-700">Map unavailable</p>
              <p className="mt-1 text-xs text-stone-500">Connect to the internet and reload to view the interactive map.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-stone-800 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-700 min-h-[44px] focus-visible:outline-2 focus-visible:outline-accent-600"
            >
              Reload page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
