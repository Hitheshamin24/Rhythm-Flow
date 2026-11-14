import client from "../../../shared/api/client";

export const getDashboardStudents = () => client.get("/students");
export const getDashboardBatches = () => client.get("/batches");
export const getAttendanceSummary = () => client.get("/attendance/summary");
export const getWeeklyAttendance = () => client.get("/attendance/weekly");
