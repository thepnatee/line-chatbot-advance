
const dialogflow = require('@google-cloud/dialogflow');
const axios = require("axios");

exports.postToDialogflowWithCredential = async (userId, message, language) => {
  // A unique identifier for the given session
  const sessionId = userId;
  const projectId = require('../dialogflow_key.json');
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
    keyFilename: process.env.DIALOGFLOW_API_KEY,
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: (language === 'en') ? "en-US" : "th-TH",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;

  return result
}

exports.postToDialogflow = async (req) => {
  req.headers.host = "dialogflow.cloud.google.com";
  // console.log(req);
  return axios({
    url: `https://dialogflow.cloud.google.com/v1/integrations/line/webhook/${process.env.DIALOGFLOW_AGENT_ID}`,
    headers: req.headers,
    method: "post",
    data: req.body
  });
};