import mongoose from "mongoose";
import { config } from "dotenv";
import { Course } from "./models/Course.js";

config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");

    // Clear old courses
    await Course.deleteMany();

    // Insert demo courses
    await Course.insertMany([
      {
        title: "Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch.",
        category: "Web Development",
        createdBy: "Admin",
        poster: {
          public_id: "sample1",
          url: "https://via.placeholder.com/300x200.png?text=Web+Dev",
        },
      },
      {
        title: "Data Science Mastery",
        description: "Master Python, Pandas, Machine Learning, and Data Visualization.",
        category: "Data Science",
        createdBy: "Admin",
        poster: {
          public_id: "sample2",
          url: "https://via.placeholder.com/300x200.png?text=Data+Science",
        },
      },
      {
        title: "UI/UX Design",
        description: "Learn Figma, Adobe XD, and principles of modern UI/UX design.",
        category: "Design",
        createdBy: "Admin",
        poster: {
          public_id: "sample3",
          url: "https://via.placeholder.com/300x200.png?text=UI%2FUX",
        },
      },
      {
        title: "Cybersecurity Basics",
        description: "Understand ethical hacking, security tools, and protecting networks.",
        category: "Cybersecurity",
        createdBy: "Admin",
        poster: {
          public_id: "sample4",
          url: "https://via.placeholder.com/300x200.png?text=Cybersecurity",
        },
      },
      {
        title: "Cloud Computing with AWS",
        description: "Hands-on introduction to AWS services, EC2, S3, and Lambda.",
        category: "Cloud",
        createdBy: "Admin",
        poster: {
          public_id: "sample5",
          url: "https://via.placeholder.com/300x200.png?text=AWS+Cloud",
        },
      },
      {
        title: "Mobile App Development",
        description: "Build Android and iOS apps using React Native.",
        category: "Mobile Development",
        createdBy: "Admin",
        poster: {
          public_id: "sample6",
          url: "https://via.placeholder.com/300x200.png?text=Mobile+Apps",
        },
      },
    ]);

    console.log("✅ 6 Demo Courses Seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCourses();
