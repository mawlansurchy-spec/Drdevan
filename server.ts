import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Store history in memory for simplicity
  const history: any[] = [];

  // API endpoints
  app.post("/api/generate-signal", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an advanced Forex Trading AI Analyst.

Analyze every chart and trading pair using the following methodologies.
CRITICAL RULES FOR ANALYSIS:
- Entry and Stop Loss (SL) MUST be determined purely by SNR (Support and Resistance).
- Trend/Direction MUST be determined by SMC (Smart Money Concepts).
- MSS (Market Structure Shift), Order Blocks, and FVG (Fair Value Gaps) MUST be identified using ICT (Inner Circle Trader) concepts.
- For Entry, use IFC (Institutional Funding Candle / Order Block) waiting for the market to move and return to it.

1. Market Structure
   - Higher High (HH), Higher Low (HL), Lower High (LH), Lower Low (LL)
   - Trend Direction, Range Market
   - Break of Structure (BOS), Change of Character (CHoCH)
2. Price Action Analysis
   - Breakout, Retest, Rejection, Trend Continuation, Pullback, Market Momentum
3. Support and Resistance
   - Major Support/Resistance Levels, Key Zones, Psychological Levels
4. Supply and Demand Zones
   - Fresh Supply/Demand Zones, Tested Zones
5. Smart Money Concepts (SMC)
   - Liquidity Analysis, Liquidity Sweeps, Internal/External Liquidity
   - Order Blocks, Breaker Blocks, Mitigation Blocks, Fair Value Gaps (FVG)
   - Imbalances, Premium and Discount Zones
6. ICT Concepts
   - Market Structure Shift, Optimal Trade Entry (OTE)
   - Kill Zones, Liquidity Runs, Institutional Order Flow
7. Candlestick Pattern Analysis
   - Pin Bar, Engulfing Pattern, Doji, Hammer, Shooting Star, Morning/Evening Star, Inside/Outside Bar
8. Technical Indicators
   - RSI, MACD, EMA 20, EMA 50, EMA 100, EMA 200, Bollinger Bands, ATR, Volume Analysis
9. Fundamental Analysis
   - Interest Rates, Inflation Data, CPI, PPI, GDP, NFP, FOMC
   - Central Bank Decisions, High Impact Economic News
10. Session Analysis
   - Asian, London, New York Session, Session Overlaps
11. Multi-Timeframe Analysis
   - Monthly, Weekly, Daily, H4, H1, M15, M5
12. Risk Management
   - Maximum Risk Per Trade, Stop Loss Placement, Take Profit Targets
   - Position Sizing, Risk/Reward Ratio

Only provide high-probability setups with clear reasoning and professional risk management.

RETURN ONLY JSON. No other text. The JSON must exactly match this structure:
{
  "trading_pair": "...",
  "current_trend": "...",
  "market_structure": "...",
  "support_levels": "...",
  "resistance_levels": "...",
  "supply_zone": "...",
  "demand_zone": "...",
  "liquidity_areas": "...",
  "order_blocks": "...",
  "fair_value_gaps": "...",
  "rsi_reading": "...",
  "macd_reading": "...",
  "volume_analysis": "...",
  "fundamental_impact": "...",
  "session_context": "...",
  "final_decision": "STRONG BUY, BUY, NEUTRAL, SELL, or STRONG SELL",
  "entry": "Entry price",
  "sl": "Stop loss",
  "tp1": "Take profit 1",
  "tp2": "Take profit 2",
  "tp3": "Take profit 3",
  "risk_reward_ratio": "e.g. 1:3",
  "confidence_score": "Percentage %",
  "trade_quality_score": "Score /10"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json"
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: req.file.buffer.toString("base64"),
                  mimeType: req.file.mimetype,
                },
              },
            ],
          },
        ],
      });

      const signalReport = response.text || "";
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        image: base64Image,
        report: signalReport,
      };

      history.unshift(historyItem);
      // Keep only last 20 for memory safety
      if (history.length > 20) {
        history.pop();
      }

      res.json({ status: "success", signal_report: signalReport, item: historyItem });
    } catch (error: any) {
      console.error("Error generating signal:", error);
      res.status(500).json({ status: "error", message: error.message || "An error occurred" });
    }
  });

  app.get("/api/tv-news", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
      }

      // Fetch financial news RSS
      const rssResponse = await fetch("https://feeds.finance.yahoo.com/rss/2.0/headline?s=GC=F,SI=F,EURUSD=X,GBPUSD=X");
      const xml = await rssResponse.text();

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `ئەم دەقە هەواڵی داراییە بە شێوەی XML لە Yahoo Finance وە وەرگیراوە. تکایە گرنگترین 10 هەواڵی دارایی ئەمڕۆ (بەتایبەتی ساڵی ٢٠٢٤) سەبارەت بە زێڕ، زیو، دۆلار و دراوەکانی تر بدۆزەرەوە.
دواتر وەریانگێڕە بۆ زمانی کوردی (سۆرانی) و تەنیا بە فۆرماتی JSON ئەم داتایانەم پێبدە:
[
  {
    "title": "سەردێڕی هەواڵ بە کوردی",
    "description": "کورتەی هەواڵەکە بە کوردی",
    "time": "کاتی بڵاوکردنەوەی (بۆ نموونە: 2 کاتژمێر پێش ئێستا)",
    "source": "سەرچاوە (نموونە: Reuters)"
  }
]
هیچ تێکستێکی تر جگە لە JSON مەنووسە. دڵنیابە کە هەواڵەکان ڕاستەقینە و تازەن.

دەقی XML:
${xml.substring(0, 5000)}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json"
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      });

      const newsData = JSON.parse(response.text || "[]");
      res.json(newsData);
    } catch (error) {
      console.error("News fetch error:", error);
      res.json([
        {
          title: "هەڵە لە هێنانی هەواڵەکان",
          description: "ناتوانرێت هەواڵەکان نوێ بکرێنەوە، تکایە دواتر هەوڵ بدەرەوە.",
          time: "ئێستا",
          source: "سیستەم"
        }
      ]);
    }
  });

  app.get("/api/history", (req, res) => {
    // Exclude full images to save bandwidth on initial load
    const lightweightHistory = history.map(item => {
      let summary = item.report.substring(0, 150) + "...";
      try {
        const parsed = JSON.parse(item.report);
        if (parsed && parsed.type) {
          summary = `سیگناڵ: ${parsed.type} | چوونەژوورەوە: ${parsed.entry} | ئامانج: ${parsed.tp1}`;
        }
      } catch (e) {}

      return {
        id: item.id,
        timestamp: item.timestamp,
        reportSummary: summary,
        imagePreview: item.image // Sending full image for simplicity in this prototype, could be optimized
      };
    });
    res.json(lightweightHistory);
  });
  
  app.get("/api/history/:id", (req, res) => {
    const item = history.find(i => i.id === req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
