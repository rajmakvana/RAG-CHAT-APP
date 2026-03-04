import { SystemMessage } from "@langchain/core/messages";
import { groq } from "../config/groq.js";
import { ROUTER_PROMPT } from "../prompts/router.prompt.js";

const ALLOWED_SOURCES = new Set(["platform", "internal", "web", "both"]);

const getRouterPayload = (content) => {
  const text = String(content || "").trim();
  const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");

  try {
    const parsed = JSON.parse(cleaned);
    if (ALLOWED_SOURCES.has(parsed?.source)) {
      return parsed;
    }
  } catch {
    // fall through to default
  }

  return { source: "internal" };
};

export const routerQuestion = async (question) => {
    const response = await groq.invoke([
        new SystemMessage(
            ROUTER_PROMPT.replace("{question}" , question)
        )
    ])
    return getRouterPayload(response.content);
}
