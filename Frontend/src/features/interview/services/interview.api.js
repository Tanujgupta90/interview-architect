import axios from "axios";

const API = axios.create({
    baseURL: "https://interview-architect.onrender.com", 
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default API;

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    // FIXED: Changed 'api' to 'API'
    const response = await API.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

export const getInterviewReportById = async (interviewId) => {
    // FIXED: Changed 'api' to 'API'
    const response = await API.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

export const getAllInterviewReports = async () => {
    // FIXED: Changed 'api' to 'API'
    const response = await API.get("/api/interview/");
    return response.data;
};
/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    // FIXED: Switched back to .post, but changed 'null' to an empty object '{}' so the server can parse it correctly
    const response = await API.post(`/api/interview/resume/pdf/${interviewReportId}`, {}, {
        responseType: "blob"
    });

    return response.data;
};
