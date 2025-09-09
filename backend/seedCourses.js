```js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envPath = path.join(process.cwd(), "config", "config.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillshare";

const sampleCourses = [
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React and Node.js. Build real projects and launch your career.",
    lectures: [
      {
        title: "Introduction",
        description: "Course overview and setup",
        video: {
          public_id: "vid1",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      },
    ],
    poster: {
      public_id: "placeholder_webdev",
      url: "https://via.placeholder.com/800x450.png?text=Web+Development",
    },
    views: 1200,
    numOfVideos: 1,
    category: "Web Development",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Python for Everybody",
    description: "Beginner-friendly Python course covering fundamentals, data structures, and real-world projects.",
    lectures: [
      {
        title: "Getting Started with Python",
        description: "Install Python and run first script",
        video: {
          public_id: "vid2",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      },
    ],
    poster: {
      public_id: "placeholder_python",
      url: "https://via.placeholder.com/800x450.png?text=Python",
    },
    views: 900,
    numOfVideos: 1,
    category: "Programming Languages",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "UI / UX Design Essentials",
    description: "Design stunning interfaces and compelling user experiences. Learn ideation, wireframing and prototyping.",
    lectures: [
      {
        title: "What is UX?",
        description: "Understanding UX vs UI",
        video: {
          public_id: "vid3",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      },
    ],
    poster: {
      public_id: "placeholder_uiux",
      url: "https://via.placeholder.com/800x450.png?text=UI%2FUX+Design",
    },
    views: 650,
    numOfVideos: 1,
    category: "Design",
    createdBy: "Admin",
    createdAt: new Date(),
  },
];

const runSeeder = async () => {
  try {
    console.log("Connecting to MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const coll = mongoose.connection.collection("courses");

    await coll.deleteMany({});
    await coll.insertMany(sampleCourses);

    console.log("✅ Seed complete. Inserted sample courses into 'courses' collection.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
};

runSeeder();
```
