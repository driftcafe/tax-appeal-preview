import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import Pricing from "./pages/Pricing.tsx";
import Methodology from "./pages/Methodology.tsx";
import FAQ from "./pages/FAQ.tsx";
import Counties from "./pages/Counties.tsx";
import SignIn from "./pages/SignIn.tsx";
import Comparables from "./pages/Comparables.tsx";
import Signup from "./pages/Signup.tsx";
import Success from "./pages/Success.tsx";
import CheckoutCancelled from "./pages/CheckoutCancelled.tsx";
import Report from "./pages/Report.tsx";
import Terms from "./pages/Terms.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/comparables/:lookupId" element={<Comparables />} />
          <Route path="/signup/:lookupId" element={<Signup />} />
          <Route path="/success" element={<Success />} />
          <Route path="/checkout-cancelled" element={<CheckoutCancelled />} />
          <Route path="/r/:token" element={<Report />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/counties" element={<Counties />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<ComingSoon />} />
          <Route path="/signin" element={<SignIn />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
