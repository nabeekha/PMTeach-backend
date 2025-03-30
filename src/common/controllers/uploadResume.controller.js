const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const OpenAI = require("openai");
const Course = require("../../modules/courses/course.model");
const Section = require("../../modules/sections/section.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const uploadResumeAndRecommend = async (req, res) => {
  try {
    const { path, mimetype } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      const data = await pdfParse(fs.readFileSync(path));
      extractedText = data.text;
    } else if (mimetype.includes("word")) {
      const data = await mammoth.extractRawText({ path });
      extractedText = data.value;
    } else {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const messages = [
      {
        role: "system",
        content: `You are an AI that extracts key skills and determines the current level of the user from resumes. Analyze the resume and return a JSON with an array of skills and the user's inferred level (e.g., "entry-level", "mid-level", "senior", "principal").`,
      },
      { role: "user", content: extractedText },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    const aiSuggestions = JSON.parse(response.choices[0].message.content);
    const userSkills = aiSuggestions.skills;
    const userLevel = aiSuggestions.level;

    const allCourses = await Course.find({});
    const allSections = await Section.find({});

    const levelMapping = {
      "entry-level": 1,
      "mid-level": 2,
      senior: 3,
      principal: 4,
    };

    const userCourseLevel = levelMapping[userLevel.toLowerCase()] || 1;

    const nextLevel = userCourseLevel + 1;
    const recommendedCourse = allCourses.find(
      (course) => course.level === nextLevel
    );

    if (!recommendedCourse) {
      return res.status(404).json({ message: "No recommended course found" });
    }

    const skillEmbeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userSkills,
    });

    const sectionEmbeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: allSections.map((section) => section.title),
    });

    const relevantSections = allSections.filter((section, index) => {
      return (
        section.course.toString() === recommendedCourse._id.toString() &&
        skillEmbeddings.data.some(
          (skillVec) =>
            cosineSimilarity(
              skillVec.embedding,
              sectionEmbeddings.data[index].embedding
            ) < 0.8
        )
      );
    });

    return res.json({
      data: {
        course: recommendedCourse?._id,
        sections: relevantSections.map((i) => i._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error processing resume",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResumeAndRecommend,
};
