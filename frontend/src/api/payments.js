import client from "./client";

export const getPayments = (year, month) => {
  const params = {};
  if (year !== undefined) params.year = year;
  if (month !== undefined) params.month = month;
  return client.get("/payments", { params });
};

export const markPaid = (id, year, month) =>
  client.put(`/payments/pay/${id}`, { year, month });

export const markUnpaid = (id, year, month) =>
  client.put(`/payments/unpay/${id}`, { year, month });

export const resetAllToUnpaid = () => client.put("/payments/reset");
