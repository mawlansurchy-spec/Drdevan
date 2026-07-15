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

      const prompt = `You are an elite, institutional-grade Forex and Cryptocurrency Trading AI Analyst. Your goal is to analyze the uploaded chart image with extreme precision and professional depth.

Analyze the chart and trading pair using the following 12 detailed methodologies:

1. Market Structure
   - Higher High (HH) / Higher Low (HL) / Lower High (LH) / Lower Low (LL)
   - Trend Direction (Bullish, Bearish, Sideways)
   - Range Market Identification
   - Break of Structure (BOS) & Change of Character (CHoCH)

2. Price Action Analysis
   - Breakout, Retest, Rejection
   - Trend Continuation & Pullbacks
   - Market Momentum

3. Support and Resistance
   - Major Support and Resistance Levels
   - Key Supply/Demand Turn Zones
   - Psychological Levels (Round Numbers)

4. Supply and Demand Zones
   - Fresh Supply and Demand Zones
   - Tested Zones

5. Smart Money Concepts (SMC)
   - Liquidity Analysis (Liquidity Sweeps, Internal vs External Liquidity)
   - Order Blocks, Breaker Blocks, Mitigation Blocks
   - Fair Value Gaps (FVG) and Imbalances
   - Premium and Discount Zones

6. ICT Concepts
   - Market Structure Shift (MSS)
   - Optimal Trade Entry (OTE)
   - Kill Zones (London, NY, Asian)
   - Liquidity Runs & Institutional Order Flow

7. Candlestick Pattern Analysis
   - Pin Bar, Engulfing Pattern, Doji, Hammer, Shooting Star, Morning/Evening Star, Inside Bar, Outside Bar

8. Technical Indicators
   - RSI and MACD Readings and Divergences
   - EMA 20, EMA 50, EMA 100, EMA 200 placements
   - Bollinger Bands, ATR (Average True Range), and Volume Analysis

9. Fundamental Analysis
   - Anticipated impact of Interest Rates, Inflation Data, CPI, PPI, GDP, NFP, FOMC, Central Bank Decisions, and High Impact Economic News on this pair

10. Session Analysis
    - Asian, London, New York Session Context & Session Overlaps

11. Multi-Timeframe Analysis
    - Synthesis of Monthly, Weekly, Daily, H4, H1, M15, M5 perspectives

12. Risk Management
    - Maximum Risk Per Trade guidance
    - Stop Loss placement rationale
    - Take Profit Targets (TP1, TP2, TP3)
    - Position Sizing and Risk/Reward Ratio

INSTRUCTIONS FOR THE OUTPUT FIELDS:
- Translate all analytical text fields into professional, rich, and highly accurate Sorani Kurdish (زمانی کوردی - سۆرانی), while keeping key technical terms in English inside parentheses, e.g., "ڕاماڵینی نەختینەیی (Liquidity Sweep)" or "شکاندنی پێکهاتە (BOS)".
- Provide extremely comprehensive explanations for each field. Avoid generalities; analyze the exact candles, levels, and indicators shown in the image.
- The "final_decision" MUST be one of: STRONG BUY, BUY, NEUTRAL, SELL, STRONG SELL.
- Provide clear mathematical targets for entry, sl, tp1, tp2, tp3.

RETURN ONLY VALID JSON. No other text. The JSON must exactly match this structure so the frontend can display it correctly:
{
  "trading_pair": "Trading Pair (e.g. EUR/USD or BTC/USDT)",
  "current_trend": "Current Market Trend description in Sorani Kurdish (with English term in parentheses)",
  "market_structure": "Market Structure Analysis in Sorani Kurdish with terms like HH, HL, LH, LL, BOS, CHoCH",
  "support_levels": "Major Support Levels identified in the chart with price values",
  "resistance_levels": "Major Resistance Levels identified in the chart with price values",
  "supply_zone": "Supply Zone identified in the chart with details",
  "demand_zone": "Demand Zone identified in the chart with details",
  "liquidity_areas": "Liquidity Areas, Liquidity Sweeps, Internal/External Liquidity in Sorani Kurdish",
  "order_blocks": "Order Blocks, Breaker Blocks, Mitigation Blocks in Sorani Kurdish",
  "fair_value_gaps": "Fair Value Gaps, Imbalances identified in Sorani Kurdish",
  "rsi_reading": "RSI Reading and Divergence analysis in Sorani Kurdish",
  "macd_reading": "MACD Reading and Trend Momentum analysis in Sorani Kurdish",
  "volume_analysis": "Volume Analysis, EMA placements (20, 50, 100, 200) in Sorani Kurdish",
  "fundamental_impact": "Fundamental Impact (CPI, PPI, Interest Rates, News) in Sorani Kurdish",
  "session_context": "Session Context (Asian, London, NY, Kill Zones) in Sorani Kurdish",
  "final_decision": "STRONG BUY, BUY, NEUTRAL, SELL, or STRONG SELL",
  "entry": "Entry Price (exact number)",
  "sl": "Stop Loss (exact number)",
  "tp1": "Take Profit 1 (exact number)",
  "tp2": "Take Profit 2 (exact number)",
  "tp3": "Take Profit 3 (exact number)",
  "risk_reward_ratio": "Risk/Reward Ratio (e.g. 1:2.5)",
  "confidence_score": "Confidence Score (e.g. 85%)",
  "trade_quality_score": "Trade Quality Score (e.g. 9/10)"
}`;

      const sysInstruction = "You are an elite, institutional-grade Forex and Crypto Trading AI Analyst with decades of experience in Market Structure, Price Action, Smart Money Concepts (SMC), and Inner Circle Trader (ICT) concepts. Your task is to perform an exceptionally deep, accurate, and professional analysis of the provided chart image, leaving no detail behind. Be precise, mathematically sound, and rigorous in your evaluation.";

      console.log("Performing market analysis with gemini-2.5-flash...");
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          systemInstruction: sysInstruction,
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
