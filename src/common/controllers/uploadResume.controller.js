const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const OpenAI = require("openai");
const Course = require("../../modules/courses/course.model");
const Section = require("../../modules/sections/section.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const uploadResumeAndRecommend = async (req, res) => {
  try {
    const { path, mimetype } = req.file;
    let extractedText = "";

    // Extract text based on file type (PDF or DOCX)
    if (mimetype === "application/pdf") {
      const data = await pdfParse(fs.readFileSync(path));
      extractedText = data.text;
    } else if (mimetype.includes("word")) {
      const data = await mammoth.extractRawText({ path });
      extractedText = data.value;
    } else {
      return res.status(400).json({ message: "Invalid file type" });
    }

    // OpenAI API prompt
    const prompt = `Analyze the following resume text and suggest a suitable course and career goal from our database. Resume: ${extractedText}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
    });

    const aiSuggestions = JSON.parse(response.choices[0].message.content);

    const recommendedCourses = await Course.find({
      title: { $in: aiSuggestions.courses },
    });
    const recommendedSections = await Section.find({
      course: { $in: recommendedCourses.map((c) => c._id) },
    });

    return res.json({
      courses: recommendedCourses,
      sections: recommendedSections,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing resume", error: error.message });
  }
};

module.exports = {
  uploadResumeAndRecommend,
};
