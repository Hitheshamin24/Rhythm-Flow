import client from "./client";

export const getPayments = () => client.get("/payments");
export const markPaid = (id) => client.put(`/payments/pay/${id}`);
export const markUnpaid = (id) => client.put(`/payments/unpay/${id}`);

export const resetAllToUnpaid = () => client.put("/payments/reset");
