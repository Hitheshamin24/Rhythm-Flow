import client from "../../../shared/api/client";

export const getSettings = () => client.get("/settings");

export const updateSettings = (data) =>
  client.put("/settings", data);

