import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// Generous body limit for PDF base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI server-side with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PAPER_EXTRACTION_PROMPT = `You are an expert AI research scientist and literature analyst.
Analyze the provided research paper in depth and convert its dense text into a structured, highly informative visual research model.

Follow these strict rules:
1. ACCURACY & EVIDENCE: Base all extractions solely on the provided paper.
2. NUMBERS & METRICS: Never invent or hallucinate benchmark numbers, BLEU scores, accuracy percentages, or FLOPs. If a baseline or paper metric is not explicitly reported in the text, use "Not reported".
3. RESEARCH MAP GRAPH:
   - Generate 8 to 12 clear nodes covering: 'problem', 'method', 'dataset', 'model', 'experiments', 'findings', 'limitations', 'future_work'.
   - Assign initial layout coordinates (x: 100 to 1100, y: 60 to 550) forming a clean left-to-right information flow (Problem/Data on left -> Methods/Models in center -> Experiments/Findings on right).
   - Generate meaningful directed edges with labels strictly chosen from: 'uses', 'evaluates', 'results in', 'limited by', 'extends', 'addresses', 'benchmarks on', 'compares with'.
4. METHODOLOGY FLOWCHART:
   - Provide 4 to 6 sequential steps that reflect the actual research methodology of this specific paper (not generic placeholders).
   - Each step should have stepNumber, phase, title, description, inputs (list), outputs (list), and keyTechnique.
5. KEY FINDINGS:
   - Extract up to 5 quantitative findings with metricName, baselineValue, paperValue, baselineModel, paperModel, benchmarkOrDataset, improvement, numericBaseline (number or null), numericPaper (number or null), higherIsBetter (boolean), and notes.
   - Extract 3 qualitative discoveries with title, insight, and significance.
6. TIMELINE / EVOLUTION:
   - Extract 3 to 5 prior related works mentioned in the paper chronologically.
   - For each, provide year, workTitle, authorsOrGroup, coreContribution, and paperDifference (how this current paper differs or builds upon it).
7. CONCEPTS & GLOSSARY:
   - Extract 4 to 6 key mathematical terms, variables, or novel concepts with definitions and roleInPaper.
8. RETURN VALID JSON matching this exact structure:
{
  "id": "slug-id",
  "title": "Paper Title",
  "authors": ["Author 1", "Author 2"],
  "year": "2024",
  "venue": "Conference or Journal",
  "abstract": "Full abstract text",
  "tldr": "One sentence punchy summary of core breakthrough",
  "researchProblem": "The fundamental problem addressed",
  "researchObjectives": ["Objective 1", "Objective 2", ...],
  "atAGlance": {
    "problem": { "title": "...", "summary": "...", "significance": "..." },
    "approach": { "title": "...", "summary": "...", "keyInnovation": "..." },
    "data": { "title": "...", "summary": "...", "benchmarks": ["...", "..."] },
    "results": { "title": "...", "summary": "...", "highlight": "..." },
    "limitations": { "title": "...", "summary": "...", "criticalBottleneck": "..." }
  },
  "researchMap": {
    "nodes": [
      {
        "id": "n1",
        "label": "Short Node Title",
        "category": "problem|method|dataset|model|experiments|findings|limitations|future_work",
        "description": "1-2 sentence description",
        "details": "Technical detail or mathematical formulation",
        "x": 150,
        "y": 100
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "n1",
        "target": "n2",
        "label": "uses|evaluates|results in|limited by|extends|addresses"
      }
    ]
  },
  "methodologyFlowchart": [
    {
      "stepNumber": 1,
      "phase": "Phase Name",
      "title": "Step Title",
      "description": "Step detail",
      "inputs": ["Input 1"],
      "outputs": ["Output 1"],
      "keyTechnique": "Core technique or equation"
    }
  ],
  "keyFindings": {
    "quantitative": [
      {
        "metricName": "Top-1 Accuracy",
        "baselineValue": "82.4% or Not reported",
        "paperValue": "85.1%",
        "baselineModel": "Baseline Name",
        "paperModel": "Proposed Model",
        "benchmarkOrDataset": "Dataset Name",
        "improvement": "+2.7%",
        "numericBaseline": 82.4,
        "numericPaper": 85.1,
        "higherIsBetter": true,
        "notes": "Context of this result"
      }
    ],
    "qualitative": [
      {
        "title": "Finding Title",
        "insight": "Deeper explanation",
        "significance": "Why this matters"
      }
    ]
  },
  "timelineEvolution": [
    {
      "year": "2020",
      "workTitle": "Prior Work Title",
      "authorsOrGroup": "Author et al.",
      "coreContribution": "What they introduced",
      "paperDifference": "How this paper innovates beyond it"
    }
  ],
  "conceptsAndVariables": [
    {
      "term": "Term or Symbol",
      "definition": "Clear explanation",
      "roleInPaper": "How it functions in this study"
    }
  ],
  "importantReferences": [
    {
      "citation": "Author et al. (Year)",
      "relevance": "Why cited"
    }
  ]
}

Return ONLY the raw JSON object. Do not wrap in markdown quotes if possible, or use standard markdown codeblock.`;

// API endpoint: Analyze research paper PDF or text
app.post('/api/analyze-paper', async (req, res) => {
  try {
    const { pdfBase64, paperText, filename } = req.body;

    if (!pdfBase64 && !paperText) {
      return res.status(400).json({ error: 'Please provide either a PDF file (base64) or paper text content.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please verify your environment settings.',
      });
    }

    let contents: any[] = [];

    if (pdfBase64) {
      // Clean up base64 prefix if present (e.g. data:application/pdf;base64,...)
      const cleanedBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      contents = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanedBase64,
          },
        },
        {
          text: `${PAPER_EXTRACTION_PROMPT}\n\nFilename: ${filename || 'Uploaded_Paper.pdf'}\nAnalyze the full paper comprehensively.`,
        },
      ];
    } else {
      contents = [
        {
          text: `${PAPER_EXTRACTION_PROMPT}\n\nFilename: ${filename || 'Uploaded_Paper.txt'}\n\nPaper Text Content:\n${paperText}`,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini returned an empty response.');
    }

    let parsedData;
    try {
      // Remove any surrounding markdown formatting if present
      const cleaned = textOutput.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse Gemini output as JSON:', textOutput);
      return res.status(500).json({
        error: 'Failed to parse AI output into structured paper analysis.',
        raw: textOutput,
      });
    }

    // Ensure id exists
    if (!parsedData.id) {
      parsedData.id = 'paper-' + Date.now();
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing paper:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred during paper analysis.',
    });
  }
});

// API endpoint: Ask questions about the analyzed paper
app.post('/api/ask-paper', async (req, res) => {
  try {
    const { query, paper } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const systemPrompt = `You are PaperLens, an intelligent academic co-pilot assisting students and researchers in deeply understanding a research paper.
You are given the structured extraction and context of the paper below:

PAPER CONTEXT:
Title: ${paper.title}
Authors: ${paper.authors?.join(', ')}
Year/Venue: ${paper.year} (${paper.venue})
TL;DR: ${paper.tldr}
Abstract: ${paper.abstract}
Research Problem: ${paper.researchProblem}
Objectives: ${JSON.stringify(paper.researchObjectives)}
Key Findings: ${JSON.stringify(paper.keyFindings)}
Methodology: ${JSON.stringify(paper.methodologyFlowchart)}
Limitations: ${JSON.stringify(paper.atAGlance?.limitations)}
Concepts: ${JSON.stringify(paper.conceptsAndVariables)}

Instructions:
1. Answer the user question accurately, citing specific concepts, equations, steps, or findings from the paper.
2. If the user asks about something not reported in the paper, explicitly state "The paper does not report this."
3. Keep the tone academic, pedagogical, precise, and encouraging for students and researchers.
4. Format using clear markdown headings, bullet points, or bold text where appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `${systemPrompt}\n\nUser Question: ${query}`,
        },
      ],
    });

    const answer = response.text;
    return res.json({ answer });
  } catch (error: any) {
    console.error('Error in Ask PaperLens:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred answering the query.',
    });
  }
});

// Setup Vite in Dev or serve dist in Production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[PaperLens] Server running on http://0.0.0.0:${port} (${isDev ? 'Development' : 'Production'})`);
  });
}

startServer();
