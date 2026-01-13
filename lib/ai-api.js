/* global process */
import OpenAI from "openai";

/**
 * 获取 OpenAI API 配置
 * @returns {object} - { baseURL, apiKey }
 */
function getAPIConfig() {
  return {
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  };
}

/**
 * 调用 AI API 获取回复
 * @param {string} model - 模型名称 (例如: "gpt-4o", "meta-llama/Llama-3.2-1B-Instruct")
 * @param {string} userPrompt - 用户提示
 * @param {string} [systemPrompt] - 系统提示 (可选)
 * @param {object} [options] - 额外配置选项
 * @param {number} [options.temperature] - 温度参数 (0-2)
 * @param {number} [options.max_tokens] - 最大token数
 * @param {object} [options.response_format] - 响应格式 (例如: { type: "json_object" })
 * @returns {Promise<string>} - AI 的回复内容
 */
export async function callAI(
  model,
  userPrompt,
  systemPrompt = null,
  options = {}
) {
  const config = getAPIConfig();

  const client = new OpenAI({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
  });

  const messages = [];

  // 如果有系统提示，添加到消息列表
  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  // 添加用户提示
  messages.push({
    role: "user",
    content: userPrompt,
  });

  try {
    const requestOptions = {
      model: model,
      messages: messages,
      stream: false,
    };

    // 添加可选配置
    if (options.temperature !== undefined) {
      requestOptions.temperature = options.temperature;
    }
    if (options.max_tokens !== undefined) {
      requestOptions.max_tokens = options.max_tokens;
    }
    if (options.response_format !== undefined) {
      requestOptions.response_format = options.response_format;
    }

    const response = await client.chat.completions.create(requestOptions);

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI API 调用失败: ${error.message}`);
  }
}

/**
 * 调用 AI API 获取流式回复
 * @param {string} model - 模型名称
 * @param {string} userPrompt - 用户提示
 * @param {string} [systemPrompt] - 系统提示 (可选)
 * @param {object} [options] - 额外配置选项
 * @param {number} [options.temperature] - 温度参数 (0-2)
 * @param {number} [options.max_tokens] - 最大token数
 * @param {object} [options.response_format] - 响应格式 (例如: { type: "json_object" })
 * @returns {Promise<AsyncGenerator<string>>} - 流式回复的生成器
 */
export async function callAIStream(
  model,
  userPrompt,
  systemPrompt = null,
  options = {}
) {
  const config = getAPIConfig();

  const client = new OpenAI({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
  });

  const messages = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: userPrompt,
  });

  const requestOptions = {
    model: model,
    messages: messages,
    stream: true,
  };

  // 添加可选配置
  if (options.temperature !== undefined) {
    requestOptions.temperature = options.temperature;
  }
  if (options.max_tokens !== undefined) {
    requestOptions.max_tokens = options.max_tokens;
  }
  if (options.response_format !== undefined) {
    requestOptions.response_format = options.response_format;
  }

  try {
    const stream = await client.chat.completions.create(requestOptions);
    return stream;
  } catch (error) {
    console.error("OpenAI stream error:", error);

    const details = {
      name: error?.name,
      message: error?.message,
      status: error?.status,
      code: error?.code,
      cause: error?.cause,
    };

    throw new Error(
      "AI Stream Connection Error: " + JSON.stringify(details, null, 2)
    );
  }
}
