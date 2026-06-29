import Markdown from "react-markdown";
import { FullHistoryItem } from "../types";

interface ResultReportProps {
  item: FullHistoryItem;
}

export function ResultReport({ item }: ResultReportProps) {
  let signalData: any = null;
  try {
    signalData = JSON.parse(item.report);
  } catch (e) {
    // Not JSON, ignore
  }

  const isAdvanced = signalData && signalData.final_decision;
  const decisionType = isAdvanced ? signalData.final_decision : signalData?.type;
  const isBuy = decisionType?.toLowerCase().includes("buy");

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column - Image & Detailed Analysis */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 h-auto lg:h-[800px] overflow-y-auto pr-2 scrollbar-hide">
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-lg font-medium text-white">
              چارتی شیکراوە
            </h3>
            {isAdvanced && signalData.trading_pair && (
              <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-gray-300">
                {signalData.trading_pair}
              </span>
            )}
          </div>
          <img
            src={item.image}
            alt="Analyzed Chart"
            className="w-full rounded-2xl border border-white/10"
          />
          <p className="text-xs text-gray-500 text-center">
            کاتی شیکردنەوە: {new Date(item.timestamp).toLocaleString("ku-IQ")}
          </p>
        </div>

        {isAdvanced && (
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="text-lg font-medium text-white border-b border-white/5 pb-4 col-span-1 md:col-span-2">
              شیکردنەوەی ورد (Detailed Analysis)
            </h3>
            
            {/* Market Structure & Trend */}
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase mb-2">Trend & Structure</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300"><span className="text-emerald-500/70 mr-2">Trend:</span>{signalData.current_trend}</p>
                <p className="text-sm text-gray-300"><span className="text-emerald-500/70 mr-2">Struct:</span>{signalData.market_structure}</p>
              </div>
            </div>

            {/* Support & Resistance */}
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase mb-2">Support & Resistance</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300"><span className="text-blue-400/70 mr-2">Sup:</span>{signalData.support_levels}</p>
                <p className="text-sm text-gray-300"><span className="text-red-400/70 mr-2">Res:</span>{signalData.resistance_levels}</p>
              </div>
            </div>

            {/* Supply & Demand */}
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase mb-2">Supply & Demand</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300"><span className="text-emerald-500/70 mr-2">Demand:</span>{signalData.demand_zone}</p>
                <p className="text-sm text-gray-300"><span className="text-red-400/70 mr-2">Supply:</span>{signalData.supply_zone}</p>
              </div>
            </div>

            {/* SMC & Liquidity */}
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase mb-2">SMC & Liquidity</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300"><span className="text-purple-400/70 mr-2">Liq:</span>{signalData.liquidity_areas}</p>
                <p className="text-sm text-gray-300"><span className="text-amber-400/70 mr-2">OB:</span>{signalData.order_blocks}</p>
                <p className="text-sm text-gray-300"><span className="text-indigo-400/70 mr-2">FVG:</span>{signalData.fair_value_gaps}</p>
              </div>
            </div>

            {/* Indicators & Volume */}
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase mb-2">Indicators & Volume</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300"><span className="text-blue-400/70 mr-2">RSI:</span>{signalData.rsi_reading}</p>
                <p className="text-sm text-gray-300"><span className="text-indigo-400/70 mr-2">MACD:</span>{signalData.macd_reading}</p>
                <p className="text-sm text-gray-300"><span className="text-gray-400/70 mr-2">Vol:</span>{signalData.volume_analysis}</p>
              </div>
            </div>

            {/* Fundamentals & Session */}
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase mb-2">Context</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300"><span className="text-amber-400/70 mr-2">Fund:</span>{signalData.fundamental_impact}</p>
                <p className="text-sm text-gray-300"><span className="text-emerald-400/70 mr-2">Session:</span>{signalData.session_context}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Signal Actions */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 h-auto lg:h-[800px]">
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-[#0a0b0d] border border-white/10 rounded-[40px] p-8 flex flex-col shadow-2xl relative overflow-y-auto scrollbar-hide">
          <div className="absolute top-8 left-8 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase">
            سیگناڵی نوێ
          </div>
          
          {signalData ? (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">سیگناڵ</h2>
                  <p className={`font-mono text-xl uppercase tracking-widest font-black ${isBuy ? 'text-emerald-500' : 'text-red-500'}`}>
                    {decisionType}
                  </p>
                </div>
                {isAdvanced && (
                  <div className="flex gap-2 text-right">
                    <div className="bg-white/5 px-3 py-2 rounded-xl text-center">
                      <p className="text-[10px] text-gray-500">Quality</p>
                      <p className="text-lg font-bold text-amber-400">{signalData.trade_quality_score}</p>
                    </div>
                    <div className="bg-white/5 px-3 py-2 rounded-xl text-center">
                      <p className="text-[10px] text-gray-500">Conf</p>
                      <p className="text-lg font-bold text-blue-400">{signalData.confidence_score}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 mb-1 uppercase">خاڵی چوونەژوورەوە</p>
                  <p className="text-xl font-mono text-white">{signalData.entry}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 mb-1 uppercase">ڕاگرتنی زیان (SL)</p>
                  <p className="text-xl font-mono text-red-400">{signalData.sl}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-emerald-500 uppercase font-bold">ئامانجی یەکەم (TP1)</p>
                    <p className="text-xl font-mono text-white">{signalData.tp1}</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-blue-400 uppercase font-bold">ئامانجی دووەم (TP2)</p>
                    <p className="text-xl font-mono text-white">{signalData.tp2}</p>
                  </div>
                </div>
                {signalData.tp3 && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-indigo-400 uppercase font-bold">ئامانجی سێیەم (TP3)</p>
                      <p className="text-xl font-mono text-white">{signalData.tp3}</p>
                    </div>
                  </div>
                )}
                {signalData.risk_reward_ratio && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-amber-400 uppercase font-bold">ڕێژەی مەترسی/قازانج (Risk/Reward)</p>
                      <p className="text-xl font-mono text-white">{signalData.risk_reward_ratio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6 mt-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <h2 className="text-xl font-bold text-white">ڕاپۆرتی سیگناڵ</h2>
              </div>
              <div className="markdown-body prose prose-invert prose-emerald max-w-none text-gray-300">
                <Markdown>{item.report}</Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
