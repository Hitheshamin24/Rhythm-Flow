import client from "../../../shared/api/client";

export const getAttendance = (date, batchId) =>
  client.get("/attendance", {
    params: { date, batch: batchId },
    validateStatus: (status) => status >= 200 && status < 500,
  });

export const saveAttendance = (body) => client.post("/attendance", body);

// Used by AttendancePage (also fetches students + batches)
export const getStudentsForAttendance = () => client.get("/students");
export const getBatchesForAttendance = () => client.get("/batches");
