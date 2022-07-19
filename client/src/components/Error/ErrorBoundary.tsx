import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false
  }
  public static getDerivedStateFromError(_: Error): State {
    return {
      hasError: true
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('uncaught:', {error, errorInfo});
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <pre>ERROR!!11!</pre>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;