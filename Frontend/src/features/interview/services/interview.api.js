import axios from "axios";

const API = axios.create({
    baseURL: "https://onrender.com", 
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

export const generateResumePdf = async ({ interviewReportId }) => {
    // FIXED: Changed 'api' to 'API'
    const response = await API.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });
    return response.data;
};
