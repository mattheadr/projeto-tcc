import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PatientAuth from "./pages/PatientAuth";
import DoctorAuth from "./pages/DoctorAuth";
import PatientDashboard from "./pages/PatientDashboard";
import AppointmentHistory from "./pages/AppointmentHistory";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAvailability from "./pages/DoctorAvailability";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/patient" element={<PatientAuth />} />
          <Route path="/auth/doctor" element={<DoctorAuth />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/history" element={<AppointmentHistory />} />
          <Route path="/patient/book" element={<BookAppointment />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/availability" element={<DoctorAvailability />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
