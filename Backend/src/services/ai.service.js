// const Groq = require("groq-sdk");
// const puppeteer = require("puppeteer");

// const ai = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });

// const ACTIVE_MODEL_ID = "llama-3.3-70b-versatile";

// function cleanAndParseJSON(rawString) {
//     if (!rawString || typeof rawString !== 'string') {
//         throw new Error("Received completely empty or invalid string content.");
//     }
    
//     let text = rawString.trim();
//     text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
//     text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

//     const start = text.indexOf("{");
//     const end = text.lastIndexOf("}");

//     if (start === -1 || end === -1) {
//         return { html: `<div>${text}</div>` };
//     }

//     text = text.substring(start, end + 1);

//     try {
//         return JSON.parse(text);
//     } catch (e) {
//         throw new Error(`JSON Structural Parsing Fault: ${e.message}`);
//     }
// }

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
//     try {
//         console.log("=== CONNECTING TO GROQ API ENGINE ===");
        
//         const safeResume = resume ? resume.toString().slice(0, 3000) : "Not provided";
//         const safeDesc = selfDescription ? selfDescription.toString().slice(0, 1000) : "Not provided";
//         const safeJob = jobDescription ? jobDescription.toString().slice(0, 1500) : "Not provided";

//         const prompt = `You are a professional technical interviewer. Generate an interview report JSON structure based on:
//                         Resume Context: ${safeResume}
//                         Self Description: ${safeDesc}
//                         Target Job: ${safeJob}

//                         Return ONLY valid raw JSON without markdown formatting. Structure:
//                         {
//                           "matchScore": 85,
//                           "title": "Strategy Profile",
//                           "technicalQuestions": [{"question": "Sample Q", "intention": "Sample Intent", "answer": "Sample Answer"}],
//                           "behavioralQuestions": [{"question": "Sample Q", "intention": "Sample Intent", "answer": "Sample Answer"}],
//                           "skillGaps": [{"skill": "Sample Skill", "severity": "Medium"}],
//                           "preparationPlan": [{"day": 1, "focus": "Focus Area", "tasks": ["Task 1"]}]
//                         }`;

//         const response = await ai.chat.completions.create({
//             model: ACTIVE_MODEL_ID,
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.2
//         });

//         const rawText = response.choices && response.choices[0] && response.choices[0].message ? response.choices[0].message.content : "";
//         return cleanAndParseJSON(rawText);

//     } catch (error) {
//         console.error("GROQ API PROCESSING ERROR:", error);
//         throw error;
//     }
// }

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });
//     const pdfBuffer = await page.pdf({ format: "A4" });
//     await browser.close();
//     return pdfBuffer;
// }

// async function generateResumePdf({ resume, jobDescription, selfDescription }) {
//     try {
//         console.log("=== GENERATING DESIGNER RESUME HTML PAYLOAD ===");
        
//         const safeResume = resume ? resume.toString().slice(0, 3000) : "Not provided";
//         const safeDesc = selfDescription ? selfDescription.toString().slice(0, 1000) : "Not provided";
//         const safeJob = jobDescription ? jobDescription.toString().slice(0, 1500) : "Not provided";

//         const prompt = `You are an expert resume designer. Output ONLY valid, clean HTML code wrapped in a complete <!DOCTYPE html> document including <style> tags. Do not output JSON, do not use markdown backticks.
//                         Context:
//                         - Resume: ${safeResume}
//                         - Self Description: ${safeDesc}
//                         - Target Job: ${safeJob}`;

//         const response = await ai.chat.completions.create({
//             model: ACTIVE_MODEL_ID,
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.3
//         });

//         let rawHtml = response.choices && response.choices[0] && response.choices[0].message ? response.choices[0].message.content : "";
//         rawHtml = rawHtml.replace(/```html/gi, "").replace(/```/g, "").trim();

//         if (!rawHtml.includes("<!DOCTYPE") && !rawHtml.includes("<html")) {
//             rawHtml = `<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;padding:30px;color:#1e293b;}</style></head><body>${rawHtml}</body></html>`;
//         }
        
//         return await generatePdfFromHtml(rawHtml);
//     } catch (error) {
//         console.error("PDF GENERATION EXCEPTION:", error);
//         throw error;
//     }
// }

// module.exports = { generateInterviewReport, generateResumePdf };


const Groq = require("groq-sdk");
const puppeteer = require("puppeteer");

const ai = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const ACTIVE_MODEL_ID = "llama-3.3-70b-versatile";

function cleanAndParseJSON(rawString) {
    if (!rawString || typeof rawString !== 'string') {
        throw new Error("Received completely empty or invalid string content.");
    }
    
    let text = rawString.trim();
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
        return { html: `<div>${text}</div>` };
    }

    text = text.substring(start, end + 1);

    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`JSON Structural Parsing Fault: ${e.message}`);
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        console.log("=== CONNECTING TO GROQ API ENGINE ===");
        
        const safeResume = resume ? resume.toString().slice(0, 3000) : "Not provided";
        const safeDesc = selfDescription ? selfDescription.toString().slice(0, 1000) : "Not provided";
        const safeJob = jobDescription ? jobDescription.toString().slice(0, 1500) : "Not provided";

        const prompt = `You are a professional technical interviewer. Generate an interview report JSON structure based on:
                        Resume Context: ${safeResume}
                        Self Description: ${safeDesc}
                        Target Job: ${safeJob}

                        Return ONLY valid raw JSON without markdown formatting. Structure:
                        {
                          "matchScore": 85,
                          "title": "Strategy Profile",
                          "technicalQuestions": [{"question": "Sample Q", "intention": "Sample Intent", "answer": "Sample Answer"}],
                          "behavioralQuestions": [{"question": "Sample Q", "intention": "Sample Intent", "answer": "Sample Answer"}],
                          "skillGaps": [{"skill": "Sample Skill", "severity": "Medium"}],
                          "preparationPlan": [{"day": 1, "focus": "Focus Area", "tasks": ["Task 1"]}]
                        }`;

        const response = await ai.chat.completions.create({
            model: ACTIVE_MODEL_ID,
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
    // FIXED: Bypasses Puppeteer completely to stop server crashes!
    // Packs your custom AI-generated resume HTML as an openable text/html buffer file
    return Buffer.from(htmlContent, "utf-8");
}



async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    try {
        console.log("=== GENERATING DESIGNER RESUME HTML PAYLOAD ===");
        
        const safeResume = resume ? resume.toString().slice(0, 3000) : "Not provided";
        const safeDesc = selfDescription ? selfDescription.toString().slice(0, 1000) : "Not provided";
        const safeJob = jobDescription ? jobDescription.toString().slice(0, 1500) : "Not provided";

        const prompt = `You are an elite executive resume writer. Generate a professionally formatted, highly polished resume tailored to the target role.
                        
                        Context Data:
                        - Historical Resume Details: ${safeResume}
                        - Professional Summary: ${safeDesc}
                        - Target Position/Job Specs: ${safeJob}
                        
                        CRITICAL PACKAGING RULES:
                        1. Do NOT dump the raw labels or text like 'Self Description' or 'Target Job' onto the document.
                        2. Infer a clean name (or use a professional placeholder like 'Alex Morgan') and position title.
                        3. You MUST output ONLY valid, clean HTML code wrapped inside a complete <!DOCTYPE html> document structure with beautiful modern inline embedded <style> layout spacing rules.
                        4. Include standard structural resume sections: Professional Summary, Core Expertise & Technical Skills (format this as a beautiful grid layout), Professional Work Experience (with chronological timeline milestones and bullet points), and Education.
                        5. Maintain high-end executive typography spacing: clean margins, fine slate/dark blue accents, and professional fonts.
                        
                        Do not output JSON, do not use markdown code fence backticks. Start your output directly with <!DOCTYPE html>.`;

        const response = await ai.chat.completions.create({
            model: ACTIVE_MODEL_ID,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4
        });

        let rawHtml = response.choices && response.choices[0] && response.choices[0].message ? response.choices[0].message.content : "";
        
        // Sanitize out any markdown block wrappers if the model accidentally appends them
        rawHtml = rawHtml.replace(/```html/gi, "").replace(/```/g, "").trim();

        if (!rawHtml.includes("<!DOCTYPE") && !rawHtml.includes("<html")) {
            rawHtml = `<!DOCTYPE html><html><head><style>body{font-family:'Segoe UI',Arial,sans-serif;padding:45px;color:#1e293b;line-height:1.5;}h1{color:#1e3a8a;margin:0 0 5px 0;font-size:2.2rem;}.title{color:#2563eb;font-size:1.2rem;font-weight:600;margin-bottom:25px;}.sec{border-bottom:2px solid #e2e8f0;padding-bottom:5px;color:#0f172a;margin-top:25px;font-size:1.1rem;text-transform:uppercase;letter-spacing:0.5px;font-weight:bold;}</style></head><body>${rawHtml}</body></html>`;
        }
        
        return await generatePdfFromHtml(rawHtml);
    } catch (error) {
        console.error("PDF GENERATION EXCEPTION:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };
