import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { ConnectCloud } from "./pages/ConnectCloud";
import { Dashboard } from "./pages/Dashboard";
import { CostOptimization } from "./pages/CostOptimization";
import { SecurityScanner } from "./pages/SecurityScanner";
import { AIRecommendations } from "./pages/AIRecommendations";
import { Resources } from "./pages/Resources";
import { Automation } from "./pages/Automation";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/connect",
    Component: ConnectCloud,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/cost-optimization",
    Component: CostOptimization,
  },
  {
    path: "/security-scanner",
    Component: SecurityScanner,
  },
  {
    path: "/ai-recommendations",
    Component: AIRecommendations,
  },
  {
    path: "/resources",
    Component: Resources,
  },
  {
    path: "/automation",
    Component: Automation,
  },
  {
    path: "/reports",
    Component: Reports,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);