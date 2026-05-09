import { createServerFn } from "@tanstack/react-start";
import Retell from "retell-sdk";

export const getRetellAccessToken = createServerFn({ method: "POST" })
  .handler(async () => {
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.RETELL_AGENT_ID;

    if (!apiKey || !agentId) {
      throw new Error("RETELL_API_KEY or RETELL_AGENT_ID is not set in environment variables.");
    }

    const retell = new Retell({
      apiKey,
    });

    try {
      const response = await retell.call.createWebCall({
        agent_id: agentId,
      });
      return { accessToken: response.access_token };
    } catch (error: any) {
      console.error("Retell error:", error);
      throw new Error(error.message || "Failed to get access token");
    }
  });
