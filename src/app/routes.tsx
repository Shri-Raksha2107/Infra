import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ConnectCloud } from "./pages/ConnectCloud";
import { Dashboard } from "./pages/Dashboard";
import { CostOptimization } from "./pages/CostOptimization";
import { SecurityScanner } from "./pages/SecurityScanner";
import { AIRecommendations } from "./pages/AIRecommendations";
import { Resources } from "./pages/Resources";
import { Automation } from "./pages/Automation";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { ProtectedRoute } from "./auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/connect",
    Component: ConnectCloud,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cost-optimization",
    element: (
      <ProtectedRoute>
        <CostOptimization />
      </ProtectedRoute>
    ),
  },
  {
    path: "/security-scanner",
    element: (
      <ProtectedRoute>
        <SecurityScanner />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ai-recommendations",
    element: (
      <ProtectedRoute>
        <AIRecommendations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/resources",
    element: (
      <ProtectedRoute>
        <Resources />
      </ProtectedRoute>
    ),
  },
  {
    path: "/automation",
    element: (
      <ProtectedRoute>
        <Automation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
]);