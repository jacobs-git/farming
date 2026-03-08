import { ok } from "../_shared/http";

export const onRequestGet: PagesFunction = async () => {
  return ok({ status: "ok", service: "garden-planner-api" });
};
