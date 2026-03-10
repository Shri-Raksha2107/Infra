import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./app/App.tsx";
import "./styles/index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  createRoot(document.getElementById("root")!).render(
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'white', background: '#0f172a', height: '100vh' }}>
      <h1>Configuration Error</h1>
      <p>The <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable is missing.</p>
      <p>If you are seeing this on Netlify, please go to your Netlify Site Settings &rarr; Environment Variables and add your Clerk Publishable Key.</p>
    </div>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>
  );
}
