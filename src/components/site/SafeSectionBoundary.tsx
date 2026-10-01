import React, { Component, type ReactNode } from "react";

interface SafeSectionBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface SafeSectionBoundaryState {
  hasError: boolean;
}

/**
 * Public Site Safe Error Boundary
 * Prevents an individual section failure from crashing the entire page or layout.
 */
export class SafeSectionBoundary extends Component<
  SafeSectionBoundaryProps,
  SafeSectionBoundaryState
> {
  constructor(props: SafeSectionBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SafeSectionBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn(
      `[SafeSectionBoundary] Handled rendering notice in section "${this.props.sectionName || "unnamed"}":`,
      error?.message,
      info?.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
