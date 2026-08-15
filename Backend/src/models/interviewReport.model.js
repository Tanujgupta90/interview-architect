const mongoose = require("mongoose");

const InterviewReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        resume: {
            type: String,
            default: "Not provided"
        },
        selfDescription: {
            type: String,
            default: "Not provided"
        },
        jobDescription: {
            type: String,
            default: "Not provided"
        },
        title: {
            type: String,
            default: "Interview Strategy Profile"
        },
        matchScore: {
            type: Number,
            default: 0
        },
        // CRITICAL ARRAYS CONFIGURATION: Tells Mongoose explicitly to expect arrays of objects
        technicalQuestions: [
            {
                question: { type: String, required: true },
                intention: { type: String, required: true },
                answer: { type: String, required: true }
            }
        ],
        behavioralQuestions: [
            {
                question: { type: String, required: true },
                intention: { type: String, required: true },
                answer: { type: String, required: true }
            }
        ],
        skillGaps: [
            {
                skill: { type: String, required: true },
                severity: { type: String, default: "Medium" }
            }
        ],
        preparationPlan: [
            {
                day: { type: Number, required: true },
                focus: { type: String, required: true },
                tasks: [{ type: String }]
            }
        ]
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model("InterviewReport", InterviewReportSchema);
