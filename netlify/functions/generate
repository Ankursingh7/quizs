const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const multiparty = require("multiparty");
const fs = require("fs");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Set in Netlify dashboard
});

exports.handler = async (event) => {
  try {
    // Parse file upload
    const form = new multiparty.Form();
    const data = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });

    const file = data.pdf[0];
    const pdfBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text.slice(0, 3000);

    const prompt = `
      Create 5 multiple-choice (4 options each) and 5 true/false questions
      from the following text. Return valid JSON array like:
      [{ "type":"mcq","question":"...","choices":["a","b","c","d"],"answer":"a"}]

      Text:
      ${text}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let questions = [];
    try {
      questions = JSON.parse(response.text);
    } catch {
      questions = [{ type: "note", question: response.text, answer: "" }];
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ questions }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error generating questions" }) };
  }
};
