import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogoutButton from '../../atoms/LogoutButton';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('uncaught:', { error, errorInfo });
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