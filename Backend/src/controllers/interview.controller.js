const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        console.log("=== INCOMING REQUEST ===");
        console.log("FILE OBJECT STATUS:", req.file ? "Uploaded Successfully" : "Not Found");
        console.log("JOB SPEC RECEIVED:", req.body.jobDescription);

        let parsedResumeText = "";

        if (req.file && req.file.buffer) {
            parsedResumeText = req.file.buffer.toString("utf8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
        }

        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: parsedResumeText || "Not provided",
            selfDescription,
            jobDescription
        });

        // CRITICAL RESTRUCTURE: Pass fields exactly how your frontend expects them 
        // to prevent parsing exceptions on the workspace component layer.
        const savedReport = await interviewReportModel.create({
            user: req.user.id,
            resume: parsedResumeText || "Not provided",
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore,
            title: interViewReportByAi.title,
            technicalQuestions: interViewReportByAi.technicalQuestions,
            behavioralQuestions: interViewReportByAi.behavioralQuestions,
            skillGaps: interViewReportByAi.skillGaps,
            preparationPlan: interViewReportByAi.preparationPlan
        });

        console.log("=== DISPATCHING PACKED MONGO DOCUMENT OVER TO CLIENT ===");

        return res.status(201).json({
            message: "Interview report generated successfully.",
            data: savedReport
        });

    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error);
        return res.status(500).json({
            message: "An internal parsing or AI processing error occurred.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }
        return res.status(200).json({ message: "Interview report fetched successfully.", interviewReport });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
        return res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });
        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
};
