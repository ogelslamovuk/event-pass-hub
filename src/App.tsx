import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import OrganizerPage from "./pages/OrganizerPage";
import ChannelPage from "./pages/ChannelPage";
import DemoPage from "./pages/DemoPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import OrganizerLoginPage from "./pages/OrganizerLoginPage";
import OrganizerRegistrationStubPage from "./pages/OrganizerRegistrationStubPage";
import OrganizerEventCompliancePage from "./pages/OrganizerEventCompliancePage";
import { useStorageSync } from "./hooks/useStorageSync";

const queryClient = new QueryClient();

function OrganizerRouteGuard() {
  const { state } = useStorageSync();
  if (!state.currentOrganizerId) {
    return <Navigate to="/organizer/login" replace />;
  }
  return <OrganizerPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/organizer" element={<OrganizerRouteGuard />} />
          <Route path="/organizer/login" element={<OrganizerLoginPage />} />
          <Route path="/organizer/register" element={<OrganizerRegistrationStubPage />} />
          <Route path="/organizer/compliance" element={<OrganizerEventCompliancePage />} />
          <Route path="/channel" element={<ChannelPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
