const Groq = require("groq-sdk");
const puppeteer = require("puppeteer");

const ai = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


function cleanAndParseJSON(rawString) {
    if (!rawString || typeof rawString !== 'string') {
        throw new Error("Received completely empty or invalid string content.");
    }
    
    let text = rawString.trim();
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    // 💡 ULTIMATE TRAILING TEXT FIX: Locate the first '{' and the absolute last '}'
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
        return { html: `<div>${text}</div>` };
    }

    // This strips out all extra trailing commentary, punctuation, or invisible characters after the JSON object!
    text = text.substring(start, end + 1);

    // Remove any accidental template placeholder remnants just in case
    text = text.replace(/:\s*<number>/gi, ": 85");
    text = text.replace(/:\s*<string>/gi, ': "Completed"');
    text = text.replace(/:\s*<array>/gi, ": []");
    text = text.replace(/<[^>]*>/g, "null"); 

    try {
        return JSON.parse(text);
    } catch (e) {
        // Fallback: try removing trailing commas before closing brackets
        try {
            const fixedText = text.replace(/,\s*([\]}])/g, '$1');
            return JSON.parse(fixedText);
        } catch (innerErr) {
            throw new Error(`JSON Structural Parsing Fault: ${e.message}`);
        }
    }
}



async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        console.log("=== CONNECTING TO GROQ API ENGINE ===");
        
        const safeResume = resume ? resume.toString().slice(0, 3000) : "Not provided";
        const safeDesc = selfDescription ? selfDescription.toString().slice(0, 1000) : "Not provided";
        const safeJob = jobDescription ? jobDescription.toString().slice(0, 1500) : "Not provided";

       // Inside Backend/src/services/ai.service.js

const prompt = `
You are an expert technical interviewer. Analyze this job description and profile to generate a structured interview preparation report.
Job Description: ${jobDescription}
Self Description: ${selfDescription}

CRITICAL INSTRUCTIONS:
1. You MUST return a single, valid JSON object. 
2. Do NOT include any markdown blocks (like \`\`\`json), intro explanations, or trailing commentary text.
3. Keep answers concise (under 2 sentences).
4. You MUST generate exactly 3 distinct, real technical questions and answers. Each question object MUST include an "intention" field explaining what skill is being evaluated.
5. You MUST generate exactly 3 distinct, real behavioral questions and answers. Each question object MUST include an "intention" field explaining the core competency checked.
6. You MUST generate a full 3-day step-by-step roadmap array.
7. 💡 CRITICAL: The "skillGaps" and "skillsGaps" fields MUST be an array of OBJECTS, where each object contains a key named "skill". Do NOT pass simple text strings.

The JSON object MUST follow this exact property key structure precisely:
{
  "matchScore": 85,
  "skillsGaps": [
    { "skill": "TypeScript Core Patterns" },
    { "skill": "Docker Container Architecture" },
    { "skill": "Centralized State Management Systems" }
  ],
  "skillGaps": [
    { "skill": "TypeScript Core Patterns" },
    { "skill": "Docker Container Architecture" },
    { "skill": "Centralized State Management Systems" }
  ],
  "technicalQuestions": [
    { "intention": "Core Language Check", "question": "Real Technical Q1?", "answer": "Short Answer 1." },
    { "intention": "Architecture Check", "question": "Real Technical Q2?", "answer": "Short Answer 2." },
    { "intention": "Framework Check", "question": "Real Technical Q3?", "answer": "Short Answer 3." }
  ],
  "behavioralQuestions": [
    { "intention": "Problem Solving Check", "question": "Real Behavioral Q1?", "answer": "Short Answer 1." },
    { "intention": "Teamwork Check", "question": "Real Behavioral Q2?", "answer": "Short Answer 2." },
    { "intention": "Conflict Check", "question": "Real Behavioral Q3?", "answer": "Short Answer 3." }
  ],
  "roadmap": [
    { "day": 1, "focus": "Day 1 Focus Topic", "tasks": ["Task 1", "Task 2"] },
    { "day": 2, "focus": "Day 2 Focus Topic", "tasks": ["Task 1", "Task 2"] },
    { "day": 3, "focus": "Day 3 Focus Topic", "tasks": ["Task 1", "Task 2"] }
  ]
}
`;



// Inside Backend/src/services/ai.service.js -> generateInterviewReport function

const response = await ai.chat.completions.create({
    model: "qwen/qwen3.6-27b", 
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
});


        const rawText = response.choices && response.choices[0] && response.choices[0].message ? response.choices[0].message.content : "";
        return cleanAndParseJSON(rawText);

    } catch (error) {
        console.error("GROQ API PROCESSING ERROR:", error);
        throw error;
    }
}

async function generatePdfFromHtml(htmlContent) {
    return Buffer.from(htmlContent, "utf-8");
}

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    try {
        console.log("--- GENERATING DESIGNER RESUME HTML PAYLOAD ---");

        const safeResume = resume ? resume.toString().slice(0, 3000) : "Not provided";
        const safeDesc = selfDescription ? selfDescription.toString().slice(0, 1000) : "Not provided";
        const safeJob = jobDescription ? jobDescription.toString().slice(0, 1500) : "Not provided";

        const prompt = `You are an elite executive resume writer. Generate a professionally formatted, highly polished resume tailored to the target role.
        Resume Context: ${safeResume}
        Job Spec: ${safeJob}
        User Info: ${safeDesc}
        Do not output JSON, do not use markdown code fence backticks (\`\`\`html). Start your output directly with <!DOCTYPE html>.`;

        const response = await ai.chat.completions.create({
            model: "qwen/qwen3.6-27b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2
        });

               let rawHtml = response.choices && response.choices[0] && response.choices[0].message ? response.choices[0].message.content : "";
        
        // 💡 FIXED: Strip out any structural <think> chains or markdown tag wrappers completely
        rawHtml = rawHtml.replace(/<think>[\s\S]*?<\/think>/gi, ""); 
        rawHtml = rawHtml.replace(/```html/gi, "").replace(/```/g, "").trim();

        if (!rawHtml.includes("<!DOCTYPE html>") && !rawHtml.includes("<html")) {
            rawHtml = `<!DOCTYPE html><html><head><style>body{font-family: 'Segoe UI',Arial,sans-serif;padding:45px;color:#1e293b;line-height:1.5;}</style></head><body>${rawHtml}</body></html>`;
        }

        return rawHtml;


    } catch (error) {
        console.error("PDF GENERATION EXCEPTION:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };