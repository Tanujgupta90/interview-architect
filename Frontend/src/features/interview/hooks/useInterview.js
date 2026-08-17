import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async (formData) => { // 👈 Changed to accept the FormData directly
        setLoading(true)
        let response = null
        try {
            // Pass the formData directly into your API call
            response = await generateInterviewReport(formData)
            
            // CRITICAL FIX: Extract from either '.data' (from generation) or '.interviewReport' (from fetching)
            const extractedReport = response?.data || response?.interviewReport || response;
            
            if (extractedReport) {
                setReport(extractedReport)
            }
            
            return extractedReport;
        } catch (error) {
            console.error("Hook Generation Error:", error)
            throw error; // Throw error so the frontend Home.jsx catch block can see it
        } finally {
            setLoading(false)
        }
    }


    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            const extractedReport = response?.interviewReport || response?.data || response;
            setReport(extractedReport)
            return extractedReport;
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
        return null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            const extractedReports = response?.interviewReports || response?.data || response;
            setReports(extractedReports || [])
            return extractedReports;
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
        return []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}
