import React, { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";

const e = React.createElement;

// Error Boundary to catch rendering errors in the application
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return e(
        'div',
        { className: "bg-[#DCD7C9] min-h-screen text-[#4A2C2A] flex items-center justify-center p-4" },
        e(
          'div',
          { className: "bg-red-100 border-l-4 border-red-500 text-red-700 p-6 m-4 rounded-lg shadow-lg max-w-lg w-full", role: "alert" },
          e('h1', { className: "font-bold text-xl mb-2" }, "متاسفانه خطایی رخ داده است"),
          e('p', null, "مشکلی در بارگذاری برنامه پیش آمده است. لطفاً صفحه را مجدداً بارگذاری کنید."),
          e(
            'details',
            { className: "mt-4" },
            e('summary', { className: "cursor-pointer text-sm font-semibold" }, "جزئیات خطا"),
            e('pre', { className: "mt-2 text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap" }, this.state.error?.toString())
          )
        )
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
      e(StrictMode, null,
        e(ErrorBoundary, null,
          e(App, null)
        )
      )
    );
} else {
    console.error("Fatal Error: The root element with id 'root' was not found in the DOM.");
}
