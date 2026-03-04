import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { routerQuestion } from "./questionRouter.js";
import { genrateSearchQuery } from "./searchQuery.js";
import { similaritySearch } from "./similaritySearch.js";
import { webSearch } from "./webSearch.js";
import { FINAL_SYSTEM_PROMPT } from "../prompts/system.prompt.js";
import { PLATFORM_SYSTEM_PROMPT } from "../prompts/platform.prompt.js";
import { groq } from "../config/groq.js";
import prisma from "../config/dataBase.js";

// Fetch org context and custom system prompt from DB
const getOrgContext = async (organizationId) => {
  if (!organizationId) return { context: "", systemPrompt: null };

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { name: true, type: true, description: true, context: true, systemPrompt: true },
  });

  if (!org) return { context: "", systemPrompt: null };

  let orgContext = "";
  if (org.name) orgContext += `Organization: ${org.name}\n`;
  if (org.type) orgContext += `Type: ${org.type}\n`;
  if (org.description) orgContext += `About: ${org.description}\n`;
  if (org.context) orgContext += `Key Info:\n${org.context}\n`;

  return {
    context: orgContext,
    systemPrompt: org.systemPrompt || null,
  };
};

export const getFinalResponse = async (question, chatHistory, organizationId) => {

    const { source } = await routerQuestion(question);

    // Fetch org-specific context and custom prompt
    const orgData = await getOrgContext(organizationId);

    if (source === "platform") {
      const platformMessages = [
        new SystemMessage(PLATFORM_SYSTEM_PROMPT),
      ];
      // Inject org context even for platform questions so AI knows the org
      if (orgData.context) {
        platformMessages.push(new SystemMessage(`ORGANIZATION INFO:\n${orgData.context}`));
      }
      platformMessages.push(...chatHistory, new HumanMessage(question));
      return groq.invoke(platformMessages);
    }

    let context = "";

    const searchQuery = await genrateSearchQuery(question);

    // Prepend org context so the LLM knows about the organization
    if (orgData.context) {
      context += `ORGANIZATION INFO:\n${orgData.context}\n\n`;
    }

    if (source === "internal" || source === "both") {
      const internalContext = await similaritySearch(searchQuery, organizationId);
      context += `INTERNAL CONTEXT:\n${internalContext}\n\n`;
    }

    if (source === "web" || source === "both") {
      const webSearchContext = await webSearch(searchQuery);
      context += `WEBSEARCH CONTEXT:\n${webSearchContext}\n\n`;
    }

    // Use org's custom system prompt if set, otherwise default
    const systemPrompt = orgData.systemPrompt || FINAL_SYSTEM_PROMPT;

    const messages = [
      new SystemMessage(systemPrompt),
      new SystemMessage(context),
      ...chatHistory,
      new HumanMessage(question),
    ];

    const response = await groq.invoke(messages);
    return response;
};
