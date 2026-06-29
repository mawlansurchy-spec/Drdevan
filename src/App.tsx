/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { UploadZone } from "./components/UploadZone";
import { ResultReport } from "./components/ResultReport";
import { HistoryList } from "./components/HistoryList";
import { TvNews } from "./components/TvNews";
import { HistoryItem, FullHistoryItem } from "./types";
import { Activity, History, Home, MonitorPlay, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

// Use the new logo URL
const newLogoImg = "https://i.ibb.co/pvZFfqVD/file-00000000b5a47243bcd78b6c1f67584b.png";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<"analyze" | "history" | "tv">("analyze");
  const [isUploading, setIsUploading] = useState(false);
  const [currentResult, setCurrentResult] = useState<FullHistoryItem | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!showSplash) return;
    const duration = 4000;
    const interval = 40;
    const steps = duration / interval;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(Math.round((currentStep / steps) * 100), 100));
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setShowSplash(false), 300);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [showSplash]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setHistoryItems(data);
      } else {
        throw new Error("Response was not JSON");
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Dr.devan1@") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setCurrentResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/generate-signal", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to generate signal");
      }

      const data = await res.json();
      if (data.status === "success" && data.item) {
        setCurrentResult(data.item);
      } else {
        alert("هەڵەیەک ڕوویدا لە کاتی شیکردنەوە");
      }
    } catch (err) {
      console.error(err);
      alert("کێشەیەک هەیە لە پەیوەندیکردن بە سێرڤەر");
    } finally {
      setIsUploading(false);
    }
  };

  const loadHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setCurrentResult(data);
        setActiveTab("analyze");
      } else {
        throw new Error("Response was not JSON");
      }
    } catch (err) {
      console.error("Failed to load history item", err);
    }
  };

  if (showSplash) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity duration-1000 bg-fixed" 
        style={{ backgroundImage: 'url("https://i.ibb.co/Ps0KFbvt/Picsart-26-06-30-01-51-46-497.jpg")' }}
      >
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10"></div>
        <div className="relative z-10 flex flex-col items-center gap-8 animate-pulse">
          <img src={newLogoImg} alt="Logo" className="w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40 rounded-full border-4 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.5)] object-cover transition-all" />
          <div className="text-4xl md:text-6xl font-bold text-white font-poppins drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">
            {progress}%
          </div>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" 
        style={{ backgroundImage: 'url("https://i.ibb.co/Ps0KFbvt/Picsart-26-06-30-01-51-46-497.jpg")' }}
      >
        {/* Blur effect overlay on the entire background */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10"></div>

        <div className="w-full max-w-[260px] sm:max-w-[310px] md:max-w-[340px] lg:max-w-[380px] bg-white/10 border border-white/20 rounded-3xl p-5 sm:p-6 md:p-8 backdrop-blur-xl relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transform transition-all mx-4">
          <div className="flex flex-col items-center mb-6">
            <img src={newLogoImg} alt="Logo" className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] object-cover mb-4 transition-all" />

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 w-full" dir="rtl">
              <p className="text-amber-400/90 text-[10px] text-center leading-relaxed font-medium">
                ئەمە Ai تکایە ئاگەداربە مەسولیاتی هیچ شتێک هەڵناگرم ئەمە بازاڕە
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="Password"
                  className={`w-full bg-white/5 border ${loginError ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-emerald-400/80'} rounded-2xl px-12 py-3 text-white placeholder:text-gray-300 outline-none transition-all duration-300 hover:bg-white/10 font-poppins text-sm`}
                />
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${loginError ? 'text-red-400' : 'text-gray-300 group-focus-within:text-emerald-400'}`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-red-400 text-xs mt-1 font-medium font-poppins">Incorrect password</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-1 mb-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/40 bg-white/5 group-hover:border-emerald-400 transition-colors">
                  <input type="checkbox" className="peer opacity-0 absolute inset-0 cursor-pointer" />
                  <svg className="w-3 h-3 text-emerald-400 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-200 font-poppins">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:-translate-y-0.5 active:translate-y-0 font-poppins text-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen font-sans text-gray-200 selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" 
      dir="rtl"
      style={{ backgroundImage: 'url("https://i.ibb.co/NdxLnfBZ/Picsart-26-06-30-01-45-32-294.jpg")' }}
    >
      <div className="absolute inset-0 bg-[#050608]/15 backdrop-blur-[0.5px] z-0"></div>
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/20 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-black">
              <img src={newLogoImg} alt="Dr.Devan Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Dr.Devan
              </h1>
              <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">AI Signals</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide max-w-[55vw] md:max-w-none">
            <button
              onClick={() => setActiveTab("analyze")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "analyze"
                  ? "bg-white/10 text-emerald-400 border border-white/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Home className="w-4 h-4" /> شیکردنەوەی نوێ
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white/10 text-emerald-400 border border-white/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <History className="w-4 h-4" /> ئەرشیف
            </button>
            <button
              onClick={() => setActiveTab("tv")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "tv"
                  ? "bg-white/10 text-emerald-400 border border-white/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <MonitorPlay className="w-4 h-4" /> هەواڵ (TV)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 overflow-y-auto">
        {activeTab === "analyze" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                بە دەستکردنی سیگناڵی بەهێز لە وێنەی چارتەوە
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                وێنەی چارتەکەت (زێڕ، زیو، دراوەکان) لە MT5 وەربگرە و لێرە بەرزی بکەرەوە بۆ شیکردنەوەیەکی وردی تایبەت.
              </p>
            </div>
            
            {!currentResult && (
              <UploadZone onUpload={handleUpload} isUploading={isUploading} />
            )}

            {currentResult && (
              <div className="mt-8">
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => setCurrentResult(null)}
                    className="text-sm font-medium text-black bg-emerald-500 px-6 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    شیکردنەوەیەکی نوێ ئەنجام بدە
                  </button>
                </div>
                <ResultReport item={currentResult} />
              </div>
            )}
          </div>
        ) : activeTab === "history" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">ئەرشیفی سیگناڵەکان</h2>
              <p className="text-gray-400 text-lg">
                گەڕانەوە بۆ شیکردنەوەکانی پێشوو
              </p>
            </div>
            <HistoryList items={historyItems} onSelect={loadHistoryItem} />
          </div>
        ) : activeTab === "tv" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TvNews />
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            درستکراوە لەلایەن 
            <span className="text-emerald-500/80 font-bold tracking-wider">Dr.Devan</span>
          </div>
          <span className="hidden sm:inline text-white/10">•</span>
          <a 
            href="https://t.me/Qss_treding" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative px-4 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">کلیک لێرە بکە بۆ پێشنیار</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
          </a>
        </div>
      </footer>
    </div>
  );
}
