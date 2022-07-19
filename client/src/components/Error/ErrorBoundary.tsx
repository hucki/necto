import React, { Component, ErrorInfo, ReactNode, useContext } from 'react';
import LogoutButton from '../Auth/LogoutButton';

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
          <LogoutButton />
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;