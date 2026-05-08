import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <section className="card danger">
            <h2>Something went wrong</h2>
            <pre>{this.state.error.message}</pre>
          </section>
        )
      );
    }

    return this.props.children;
  }
}