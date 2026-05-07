import React, { createContext, useContext, useEffect, useState } from "react";
import { checkHealth } from "../services/apiClient";
import { Loader2 } from "lucide-react";

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
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-zinc-50/50 rounded-full blur-[120px]" />
        
        <div className="relative flex flex-col items-center max-w-lg px-8 text-center animate-in fade-in zoom-in-95 duration-1000">
          {/* 3D Image Graphic */}
          <div className="relative w-full max-w-[320px] mb-10 group">
            <div className="absolute inset-0 bg-zinc-200/20 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/20">
              <img 
                src="/business-printing-graphic.png" 
                alt="System Preparing" 
                className="w-full h-auto object-cover transform animate-pulse duration-[3000ms]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 mb-3 tracking-tighter">
                Printify<span className="text-zinc-400">X</span>
              </h1>
              <div className="h-1 w-12 bg-zinc-900 mx-auto rounded-full mb-6"></div>
              <p className="text-xl font-bold text-zinc-800">
                Waking up our servers...
              </p>
            </div>

            <p className="text-zinc-500 font-medium leading-relaxed max-w-sm mx-auto">
              Our cloud resources are spinning up to provide you with a premium printing experience.
            </p>

            {/* Connection Status */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-zinc-50 rounded-full border border-zinc-100">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                <span className="text-[13px] font-bold text-zinc-600 uppercase tracking-widest">
                  {isRetrying ? "Establishing Secure Link" : "Initial Connection"}
                </span>
              </div>
              
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                {isRetrying ? "This usually takes 60-90 seconds on first load" : "Preparing Workspace"}
              </p>
            </div>
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
