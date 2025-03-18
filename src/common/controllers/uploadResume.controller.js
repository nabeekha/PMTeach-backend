const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const OpenAI = require("openai");
const Course = require("../../modules/courses/course.model");
const Section = require("../../modules/sections/section.model");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to calculate cosine similarity
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

    // Step 1: Extract skills from resume using OpenAI
    const messages = [
      {
        role: "system",
        content: `You are an AI that extracts key skills from resumes. Return a JSON with an array of skills.`,
      },
      { role: "user", content: extractedText },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    console.log("OpenAI Response:", response.choices[0].message.content);

    const aiSuggestions = JSON.parse(response.choices[0].message.content);
    const userSkills = aiSuggestions.skills; // Extracted skills from resume

    // Step 2: Fetch all courses and sections from the DB
    const allCourses = await Course.find({});
    const allSections = await Section.find({});

    // Step 3: Generate embeddings for skills, courses, and sections
    const skillEmbeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userSkills,
    });

    const courseEmbeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: allCourses.map((course) => course.title),
    });

    const sectionEmbeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: allSections.map((section) => section.title),
    });

    // Step 4: Find the best matching course (highest probability)
    let bestCourse = null;
    let highestMatch = 0;

    allCourses.forEach((course, index) => {
      const matchScore = skillEmbeddings.data.reduce(
        (maxScore, skillVec) =>
          Math.max(
            maxScore,
            cosineSimilarity(
              skillVec.embedding,
              courseEmbeddings.data[index].embedding
            )
          ),
        0
      );

      if (matchScore > highestMatch) {
        highestMatch = matchScore;
        bestCourse = course;
      }
    });

    // Step 5: Find relevant sections within the best-matched course
    const relevantSections = allSections.filter((section, index) => {
      console.log("section::: ", section);
      return (
        section.course.toString() === bestCourse._id.toString() &&
        skillEmbeddings.data.some(
          (skillVec) =>
            cosineSimilarity(
              skillVec.embedding,
              sectionEmbeddings.data[index].embedding
            ) > 0.8
        )
      );
    });
    // Step 6: Return the recommended course and sections
    return res.json({
      course: bestCourse._id,
      sections: relevantSections.map((section) => section._id),
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
