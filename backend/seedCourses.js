// backend/seedCourses.js
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

/**
 * NOTE:
 * - Poster URLs here are placeholder images (https://via.placeholder.com/...).
 * - You can replace poster.url values with actual Cloudinary URLs later if you
 *   want real thumbnails.
 */

const sampleCourses = [
  // Web development (3)
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React and Node.js. Build real projects and launch your career.",
    lectures: [
      {
        title: "Introduction",
        description: "Course overview and setup",
        video: { public_id: "vid_web_1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_webdev", url: "https://via.placeholder.com/900x500.png?text=Web+Development+Bootcamp" },
    views: 1200,
    numOfVideos: 1,
    category: "Web development",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "React From Zero to Hero",
    description: "Master React hooks, context, router, state management and testing.",
    lectures: [
      {
        title: "React Setup",
        description: "Create React App / Vite",
        video: { public_id: "vid_web_2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_react", url: "https://via.placeholder.com/900x500.png?text=React+From+Zero+to+Hero" },
    views: 890,
    numOfVideos: 1,
    category: "Web development",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Modern CSS & Responsive Design",
    description: "CSS Grid, Flexbox, animations and design systems for modern UIs.",
    lectures: [
      {
        title: "CSS Grid",
        description: "Layouts",
        video: { public_id: "vid_web_3", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_css", url: "https://via.placeholder.com/900x500.png?text=Modern+CSS" },
    views: 420,
    numOfVideos: 1,
    category: "Web development",
    createdBy: "Admin",
    createdAt: new Date(),
  },

  // Artificial Intelligence (3)
  {
    title: "Intro to Artificial Intelligence",
    description: "AI fundamentals, problem solving, and real-world use cases.",
    lectures: [
      {
        title: "AI Overview",
        description: "Terminology and applications",
        video: { public_id: "vid_ai_1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_ai", url: "https://via.placeholder.com/900x500.png?text=Artificial+Intelligence" },
    views: 740,
    numOfVideos: 1,
    category: "Artificial Intelligence",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Machine Learning Practical",
    description: "Hands-on ML with Python, scikit-learn and project examples.",
    lectures: [
      {
        title: "Linear Models",
        description: "Regression",
        video: { public_id: "vid_ai_2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_ml", url: "https://via.placeholder.com/900x500.png?text=Machine+Learning" },
    views: 610,
    numOfVideos: 1,
    category: "Artificial Intelligence",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Deep Learning Essentials",
    description: "Neural networks, CNNs, transfer learning and model deployment.",
    lectures: [
      {
        title: "NN Basics",
        description: "Activation, loss, and training",
        video: { public_id: "vid_ai_3", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_dl", url: "https://via.placeholder.com/900x500.png?text=Deep+Learning" },
    views: 980,
    numOfVideos: 1,
    category: "Artificial Intelligence",
    createdBy: "Admin",
    createdAt: new Date(),
  },

  // Data Structure & Algorithm (3)
  {
    title: "Data Structures in JavaScript",
    description: "Arrays, linked lists, trees and practical implementations.",
    lectures: [
      {
        title: "Arrays & Lists",
        description: "Basics and implementations",
        video: { public_id: "vid_dsa_1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_dsa1", url: "https://via.placeholder.com/900x500.png?text=Data+Structures" },
    views: 510,
    numOfVideos: 1,
    category: "Data Structure & Algorithm",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Algorithms: Theory & Practice",
    description: "Sorting, searching, complexity and interview problems.",
    lectures: [
      {
        title: "Sorting Algorithms",
        description: "Merge, Quick, Heap",
        video: { public_id: "vid_dsa_2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_dsa2", url: "https://via.placeholder.com/900x500.png?text=Algorithms" },
    views: 680,
    numOfVideos: 1,
    category: "Data Structure & Algorithm",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Competitive Programming Crash Course",
    description: "Problem solving patterns and practice tips to win contests.",
    lectures: [
      {
        title: "Greedy Techniques",
        description: "Patterns & examples",
        video: { public_id: "vid_dsa_3", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_cp", url: "https://via.placeholder.com/900x500.png?text=Competitive+Programming" },
    views: 370,
    numOfVideos: 1,
    category: "Data Structure & Algorithm",
    createdBy: "Admin",
    createdAt: new Date(),
  },

  // App Development (3)
  {
    title: "Android App Development with Kotlin",
    description: "Build native Android apps using Kotlin and Jetpack Compose.",
    lectures: [
      {
        title: "Compose Basics",
        description: "Layouts and UI",
        video: { public_id: "vid_app_1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_android", url: "https://via.placeholder.com/900x500.png?text=Android+App+Dev" },
    views: 540,
    numOfVideos: 1,
    category: "App Development",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "iOS Development with SwiftUI",
    description: "Create beautiful iOS apps using SwiftUI and Combine.",
    lectures: [
      {
        title: "SwiftUI Views",
        description: "Basics and state",
        video: { public_id: "vid_app_2", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_ios", url: "https://via.placeholder.com/900x500.png?text=iOS+SwiftUI" },
    views: 330,
    numOfVideos: 1,
    category: "App Development",
    createdBy: "Admin",
    createdAt: new Date(),
  },
  {
    title: "Cross-Platform Apps with Flutter",
    description: "Build fast cross-platform apps using Flutter and Dart.",
    lectures: [
      {
        title: "Flutter Intro",
        description: "Widgets and layout",
        video: { public_id: "vid_app_3", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      },
    ],
    poster: { public_id: "placeholder_flutter", url: "https://via.placeholder.com/900x500.png?text=Flutter" },
    views: 460,
    numOfVideos: 1,
    category: "App Development",
    createdBy: "Admin",
    createdAt: new Date(),
  },
];

const runSeeder = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    const coll = db.collection("courses");

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