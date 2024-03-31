// const apiKey = "AIzaSyB21MiUr4oWcaBre0w3v7J_Dktc8eItH8c";
//const apiKey2 = "AIzaSyANqPLdrAe8CJf5Sx86zKEbrKXFZAYaSJA";
//created gemini api which give us embedded code for js .. 60 per day
const Chats = require("../models/chats");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyB21MiUr4oWcaBre0w3v7J_Dktc8eItH8c";

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });
  //
  let flag =
    "Is the question below related to coding or programming? Answer in one word: yes or no. " +
    prompt;
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const result2 = await chat.sendMessage(flag);
  const response2 = result2.response;

  if (response2.text() === "yes") {
    const ans = response.text(); //converted in text cause it is by default in object
    const newObjChat = new Chats({
      response: ans,
      prompted: prompt,
    });
    await newObjChat.save();
    return ans; // Return the response from Gemini
  } else {
    // console.log("Please provide a question related to coding or programming.");
    const ans1 = "Please enter the prompt related programming."; //converted in text cause it is by default in object
    const newObjChat = new Chats({
      response: ans1,
      prompted: prompt,
    });
    await newObjChat.save();
    return ans1; // Return
  }
}
module.exports = runChat;
