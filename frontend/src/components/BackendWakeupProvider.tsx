import React, { createContext, useContext, useEffect, useState } from "react";
import { checkHealth } from "../services/apiClient";
import { Loader2, Server, ShieldCheck, Zap } from "lucide-react";

const BackendContext = createContext<{ isReady: boolean }>({ isReady: false });

export const useBackend = () => useContext(BackendContext);

export const BackendWakeupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let timeoutId: any;

    const performCheck = async () => {
      const ready = await checkHealth();
      if (ready) {
        setIsReady(true);
      } else {
        setIsRetrying(true);
        // Retry every 3 seconds
        timeoutId = setTimeout(performCheck, 3000);
      }
    };

    performCheck();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="relative flex flex-col items-center max-w-md px-6 text-center">
          {/* Animated Icon Container */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-150 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-2xl shadow-blue-500/40">
              <Server className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Preparing Your Experience
          </h1>
          
          <div className="flex items-center gap-2 mb-6 text-blue-600 font-semibold text-lg">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Waking up our servers...</span>
          </div>

          <div className="space-y-4 text-slate-600 dark:text-slate-400">
            <p className="leading-relaxed">
              Our eco-friendly servers take a quick nap when not in use. 
              We're spinning them up now just for you.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-center gap-2 opacity-50">
                <Zap className="w-5 h-5" />
                <span className="text-xs">Fast Access</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-50">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs">Secure Connection</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-100 text-blue-500">
                <Server className="w-5 h-5" />
                <span className="text-xs font-bold">Spinning Up</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-sm text-slate-400">
            {isRetrying ? "This usually takes 60-90 seconds on first load." : "Establishing connection..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <BackendContext.Provider value={{ isReady }}>
      {children}
    </BackendContext.Provider>
  );
};
