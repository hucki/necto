import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogoutButton from '../../atoms/LogoutButton';
import RefreshButton from '../../atoms/RefreshButton';
import { ErrorDisplay } from '../DataDisplay/ErrorInfo';

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
        <div
          style={{
            display: 'grid',
            gridAutoRows: 'auto',
            margin: 'auto',
            gap: '0.5rem',
            justifyItems: 'center',
          }}
        >
          <ErrorDisplay>
            😯 Sorry, an error occured! Please refresh or logout + login again.
          </ErrorDisplay>
          <div className="controls">
            <RefreshButton />
            <LogoutButton />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
