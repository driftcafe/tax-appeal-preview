import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Result from "./pages/Result.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/r/:token" element={<Result />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/how-it-works" element={<ComingSoon />} />
          <Route path="/pricing" element={<ComingSoon />} />
          <Route path="/methodology" element={<ComingSoon />} />
          <Route path="/counties" element={<ComingSoon />} />
          <Route path="/faq" element={<ComingSoon />} />
          <Route path="/about" element={<ComingSoon />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
