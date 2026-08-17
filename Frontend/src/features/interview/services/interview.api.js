import axios from "axios";

const API = axios.create({
    baseURL: "https://interview-architect.onrender.com", 
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default API;

export const generateInterviewReport = async (formData) => {
    // This sends your text fields and files directly to your backend on Render
    const response = await API.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

export const getInterviewReportById = async (interviewId) => {
    const response = await API.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

export const getAllInterviewReports = async () => {
    const response = await API.get("/api/interview/");
    return response.data;
};

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await API.post(`/api/interview/resume/pdf/${interviewReportId}`, {});
    return response.data;
};
