// backend/updatePostersToPicsum.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "./Models/Course.js";

dotenv.config({ path: "./config/config.env" });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const courses = await Course.find({});
    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      const newUrl = `https://picsum.photos/seed/${c._id.toString()}/900/500`;
      c.poster = c.poster || {};
      c.poster.url = newUrl;
      await c.save();
      console.log("Updated poster for:", c.title);
    }
    console.log("✅ Done updating posters to picsum.photos");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};
run();
