const mongoose = require("mongoose");
const slugify = require("../src/utils/slugify");
const LiveSession = require("../src/modules/live-sessions/liveSession.model");
require("dotenv").config();

async function migrateSlugs() {
  await mongoose.connect(process.env.MONGO_URI);

  const sessions = await LiveSession.find({ slug: { $exists: false } });

  for (const session of sessions) {
    session.slug = slugify(session.title);
    await session.save();
    console.log(`Added slug to session: ${session.title} -> ${session.slug}`);
  }

  console.log("Migration completed!");
  process.exit(0);
}

migrateSlugs().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
