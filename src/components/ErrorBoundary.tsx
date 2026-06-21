import React, { Component, ErrorInfo, ReactNode } from "react";

import * as Sentry from '@sentry/react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Sentry Telemetry Integration
    if (typeof window !== "undefined") {
      Sentry.captureException(error, { extra: errorInfo });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", color: "var(--color-primary)", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
