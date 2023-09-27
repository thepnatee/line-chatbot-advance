const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.GPT_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



exports.openaiRequest = async (message,userId) => {
  const completion = await openai.createCompletion({
    model: process.env.GPT_MODEL,
    prompt: message,
    max_tokens: 500,
    temperature: 0,
    user: userId
  });
  return completion.data.choices[0].text;
};
exports.openaiRequestImage = async (message) => {
  const completion = await openai.createImage({
    prompt: message,
    n: 1,
    size: "1024x1024",
  });
  return completion.data.data[0].url;
};


