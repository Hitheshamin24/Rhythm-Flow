import client from "./client";

// Owner – get all pending trainers for their studio
export const getPendingStaff = () => client.get("/studios/staff/pending");

// Owner – approve a trainer
export const approveStaff = (id) => client.put(`/studios/staff/${id}/approve`);

// Owner – reject a trainer
export const rejectStaff = (id) => client.put(`/studios/staff/${id}/reject`);
