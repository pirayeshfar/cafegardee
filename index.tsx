import React, { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Error Boundary to catch rendering errors in the application
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: The constructor-based state initialization was causing TypeScript errors
  // indicating that 'state' and 'props' properties did not exist. Declaring state
  // as a class property resolves these issues.
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#DCD7C9] min-h-screen text-[#4A2C2A] flex items-center justify-center p-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 m-4 rounded-lg shadow-lg max-w-lg w-full" role="alert">
            <h1 className="font-bold text-xl mb-2">متاسفانه خطایی رخ داده است</h1>
            <p>مشکلی در بارگذاری برنامه پیش آمده است. لطفاً صفحه را مجدداً بارگذاری کنید.</p>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold">جزئیات خطا</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">{this.state.error?.toString()}</pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    rootElement.innerHTML = ''; // Clear the initial loader
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
} else {
    console.error("Fatal Error: The root element with id 'root' was not found in the DOM.");
}