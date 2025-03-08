import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createGroq } from "@ai-sdk/groq";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const DEFAULT_BASE_URLS = {
  OPENAI: "https://api.openai.com/v1",
  GROQ: "https://api.groq.com/openai/v1",
  ANTHROPIC: "https://api.anthropic.com/v1",
  GOOGLE: "https://generativelanguage.googleapis.com/v1beta",
  DEEPSEEK: "https://api.deepseek.com/v1",
  OPENROUTER: "https://openrouter.ai/api/v1"
};

const getBaseUrl = (type: string): string => {
  const baseUrl = process.env[`${type}_API_BASE`];
  if (!baseUrl) {
    console.warn(`No base URL found for ${type}, using default ${type} URL`);
    return DEFAULT_BASE_URLS[type];
  }
  return baseUrl;
};

const baseURL = getBaseUrl("OPENAI");
const openrouterBaseUrl = getBaseUrl("OPENROUTER");
const groqBaseURL = getBaseUrl("GROQ");
const anthropicBaseURL = getBaseUrl("ANTHROPIC");
const googleBaseURL = getBaseUrl("GOOGLE");
const deepseekBaseURL = getBaseUrl("DEEPSEEK");
const DEFAULT_MODEL = "anthropic/claude-3.7-sonnet:thinking";

const createBedrockConfig = () => ({
  region: process.env.AWS_REGION || "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const models = {
  "deepseek/deepseek-r1:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL,
  })("deepseek/deepseek-r1:free"),
  "deepseek/deepseek-r1-distill-llama-70b:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("deepseek/deepseek-r1-distill-llama-70b:free"),
  "deepseek/deepseek-chat:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("deepseek/deepseek-chat:free"),
  "google/gemini-2.0-pro-exp-02-05:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("google/gemini-2.0-pro-exp-02-05:free"),
  "google/gemini-2.0-flash-exp:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("google/gemini-2.0-flash-exp:free"),
  "google/gemini-2.0-flash-thinking-exp-1219:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("google/gemini-2.0-flash-thinking-exp-1219:free"),
  "google/gemma-2-9b-it:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("google/gemma-2-9b-it:free"),
  "google/learnlm-1.5-pro-experimental:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("google/learnlm-1.5-pro-experimental:free"),
  "google/gemini-flash-1.5-8b": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("google/gemini-flash-1.5-8b"),
  "mistralai/mistral-nemo": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("mistralai/mistral-nemo"),
  "mistralai/mistral-7b-instruct": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("mistralai/mistral-7b-instruct"),
  "nousresearch/hermes-3-llama-3.1-405b": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("nousresearch/hermes-3-llama-3.1-405b"),
  "nvidia/llama-3.1-nemotron-70b-instruct:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("nvidia/llama-3.1-nemotron-70b-instruct:free"),
  "qwen/qwen2.5-vl-72b-instruct:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("qwen/qwen2.5-vl-72b-instruct:free"),
  "sophosympatheia/rogue-rose-103b-v0.2:free": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("sophosympatheia/rogue-rose-103b-v0.2:free"),
  "microsoft/phi-3-medium-128k-instruct": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("microsoft/phi-3-medium-128k-instruct"),
  "microsoft/phi-4": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL,
  })("microsoft/phi-4"),
  "anthropic/claude-3.7-sonnet:thinking": createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: openrouterBaseUrl,
  })("anthropic/claude-3.7-sonnet:thinking"),
  "gpt-4o": createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL,
  })("gpt-4o"),
  "gpt-4o-mini-2024-08-06": createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL,
  })("gpt-4o-mini-2024-08-06"),
  "gpt-4o-mini": createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL,
  })("gpt-4o-mini"),
  "claude-3-5-sonnet-20240620": createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: anthropicBaseURL,
  })("claude-3-5-sonnet-20240620"),
  "claude-3-5-sonnet-20241022": createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })("claude-3-5-sonnet-20241022"),
  "claude-3-5-haiku-20241022": createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })("claude-3-5-haiku-20241022"),
  "gemini-2.0-flash-exp": createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    baseURL: googleBaseURL,
  })("gemini-2.0-flash-exp", {
    useSearchGrounding: true,
  }),

  "gemini-1.5-pro-search": createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    baseURL: googleBaseURL,
  })("gemini-1.5-pro"),
  // bedrock
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        // Llama Models
        "llama-3-3-70b": createAmazonBedrock(createBedrockConfig())("meta.llama3-3-70b-instruct-v1:0"),
        "llama-3-2-90b": createAmazonBedrock(createBedrockConfig())("meta.llama3-2-90b-instruct-v1:0"),
        // Mistral Models
        "mistral-large": createAmazonBedrock(createBedrockConfig())("mistral.mistral-large-2407-v1:0"),
        "mixtral-8x7b": createAmazonBedrock(createBedrockConfig())("mistral.mixtral-8x7b-instruct-v0:1"),
        // Anthropic Models
        "anthropic.claude-3-5-sonnet-20240620-v1:0": createAmazonBedrock(createBedrockConfig())("anthropic.claude-3-5-sonnet-20240620-v1:0"),
        "anthropic.claude-3-5-haiku-20241022-v1:0": createAmazonBedrock(createBedrockConfig())("anthropic.claude-3-5-haiku-20241022-v1:0"),
      }
    : {}),
  ...(process.env.GROQ_API_KEY
    ? {
        "mixtral-8x7b-32768": createGroq({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: groqBaseURL,
        })("mixtral-8x7b-32768"),
        "llama-3.3-70b-versatile": createGroq({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: groqBaseURL,
        })("llama-3.3-70b-versatile"),
        "gemma2-9b-it": createGroq({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: groqBaseURL,
        })("gemma2-9b-it"),
      }
    : {}),
  ...(process.env.DEEPSEEK_API_KEY
    ? {
        "deepseek-chat": createDeepSeek({
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: deepseekBaseURL,
        })("deepseek-chat"),
      }
    : {}),
};

export const getModel = (name: string) => {
  if (!models[name]) {
    console.log(`Model ${name} not found`);
    console.log(`Defaulting to ${DEFAULT_MODEL}`);
    return models[DEFAULT_MODEL];
  }
  console.log(`Using model ${name}`);

  return models[name];
};

export const getAvailableModels = () => {
  return Object.keys(models);
};
