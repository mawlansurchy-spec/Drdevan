import { useEffect, useState } from "react";
import { MonitorPlay, RefreshCw, AlertCircle } from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  time: string;
  source: string;
}

export function TvNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tv-news");
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setNews(data);
      } else {
        throw new Error("Response was not JSON");
      }
    } catch (err) {
      console.error("Failed to fetch news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 items-center">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-bold tracking-widest uppercase mb-4 border border-red-500/20">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          ڕاستەوخۆ
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          هەواڵی بازاڕ و پێشهاتەکان
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          نوێترین هەواڵەکانی زێڕ، زیو و دۆلار لە سەرچاوە جیهانییەکانەوە بە شێوەی ڕاستەوخۆ وەردەگێڕدرێنە سەر زمانی کوردی.
        </p>
      </div>

      <div className="w-full flex justify-end">
        <button
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all text-gray-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          نوێکردنەوە
        </button>
      </div>

      <div className="w-full grid grid-cols-1 gap-4">
        {loading && news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            <p>لە هێنانی هەواڵەکاندا...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4 bg-white/[0.02] border border-white/5 rounded-3xl">
            <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
            <p>هیچ هەواڵێک نەدۆزرایەوە.</p>
          </div>
        ) : (
          news.map((item, index) => (
            <div
              key={index}
              className="group bg-black/40 border border-white/5 hover:border-emerald-500/30 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
              
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                      <MonitorPlay className="w-3.5 h-3.5" />
                      {item.source}
                    </span>
                    <span className="text-emerald-500/70">{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
