import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogoutButton from '../../atoms/LogoutButton';
import RefreshButton from '../../atoms/RefreshButton';
import { ErrorDisplay } from '../DataDisplay/ErrorInfo';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: ErrorInfo | undefined;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    errorInfo: undefined,
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(
    _: Error,
    errorInfo: ErrorInfo
  ): State {
    return {
      hasError: true,
      errorInfo,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('uncaught:', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <ErrorDisplay>{this.state.errorInfo?.componentStack}</ErrorDisplay>
          <RefreshButton />
          <LogoutButton />
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
