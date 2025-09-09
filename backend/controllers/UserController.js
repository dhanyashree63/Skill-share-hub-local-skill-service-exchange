import { catchAsyncError } from "../Middlewares/catchAsyncError.js";
import { User } from "../Models/User.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { sendEmail } from "../Utils/SendEmail.js";
import { sendToken } from "../Utils/SendToken.js";
import crypto from "crypto";
import { Course } from "../Models/Course.js";
import cloudinary from "cloudinary";
import getDataUri from "../Utils/dataUri.js";
import { Stats } from "../Models/Stats.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already Exist", 409));
  }

  // --- safe avatar handling ---
  // Default placeholder avatar
  let avatarObj = {
    public_id: "placeholder_avatar",
    url: "https://via.placeholder.com/150.png?text=Avatar",
  };

  // If client sent a file, try to process/upload it
  if (file) {
    const fileUri = getDataUri(file);

    // Upload only if Cloudinary credentials are set
let myCloud = null;
if (
  process.env.CLOUDINARY_APIKEY &&
  process.env.CLOUDINARY_APISECRET &&
  process.env.CLOUDINARY_NAME
) {
  console.log("🔎 Cloudinary config:", {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_APIKEY ? "loaded" : "missing",
    secret: process.env.CLOUDINARY_APISECRET ? "loaded" : "missing",
  });

  try {
    console.log("📤 Uploading avatar to Cloudinary...");
    myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
    console.log("✅ Upload success:", myCloud.secure_url);
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message || err);
    myCloud = null; // fallback to placeholder
  }
}

    if (myCloud) {
      avatarObj = { public_id: myCloud.public_id, url: myCloud.secure_url };
    }
  }
  // --- end avatar handling ---

  user = await User.create({
    name,
    email,
    password,
    avatar: avatarObj,
  });

  sendToken(res, user, "Registered Successfully", 201);
});


export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter all field", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return next(new ErrorHandler("Incorrect Email or Password", 401));

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      message: "You have been logged out Successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("Not Logged In", 401));
  }

  const name = user.name;

  if (
    process.env.CLOUDINARY_APIKEY &&
    process.env.CLOUDINARY_APISECRET &&
    process.env.CLOUDINARY_NAME
  ) {
    try {
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
    } catch (err) {
      console.warn("Cloudinary cleanup failed (non-fatal):", err.message || err);
    }
  }

  await user.remove();

  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      message: `User ${name} deleted successfully.`,
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please Enter All the Fields", 401));
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Password does not match", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (email) user.email = email;
  if (name) user.name = name;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("No file provided", 400));
  }

  const fileUri = getDataUri(file);

  if (
    process.env.CLOUDINARY_APIKEY &&
    process.env.CLOUDINARY_APISECRET &&
    process.env.CLOUDINARY_NAME
  ) {
    try {
      if (req.user.avatar && req.user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

      req.user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } catch (err) {
      console.warn("Cloudinary upload failed (non-fatal):", err.message || err);
      req.user.avatar =
        req.user.avatar || {
          public_id: "placeholder_avatar",
          url: "https://via.placeholder.com/150.png?text=Avatar",
        };
    }
  } else {
    req.user.avatar =
      req.user.avatar || {
        public_id: "placeholder_avatar",
        url: "https://via.placeholder.com/150.png?text=Avatar",
      };
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
  });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User Does Not exist", 401));
  }

  const resetToken = await user.getResetToken();
  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the Link to reset your password. ${url}. if you have not requested then please ignore.`;

  await sendEmail(user.email, "SkillShare Reset Password", message);

  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const token = req.params.token;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Link has been expired", 401));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset Successfully",
  });
});

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.body.id);

  if (!course) {
    return next(new ErrorHandler("Invalid Course Id", 401));
  }

  const itemExit = user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) {
      return true;
    }
  });

  if (itemExit) {
    return next(new ErrorHandler("Item Already Exist", 409));
  }

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Added to Playlist Successfully",
  });
});

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.query.id);

  if (!course) {
    return next(new ErrorHandler("Invalid Course Id", 401));
  }

  const newPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) {
      return item;
    }
  });

  user.playlist = newPlaylist;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Course Removed successfully",
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    users,
  });
});

export const changeUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Does Not exist", 401));
  }

  const prevRole = user.role;
  let newRole = "";

  if (user.role === "user") {
    user.role = "admin";
    newRole = "admin";
  } else {
    user.role = "user";
    newRole = "user";
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: `Role Updated Successfully from ${prevRole} to ${newRole}`,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Does Not exist", 401));
  }

  const name = user.name;

  if (
    process.env.CLOUDINARY_APIKEY &&
    process.env.CLOUDINARY_APISECRET &&
    process.env.CLOUDINARY_NAME
  ) {
    try {
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
    } catch (err) {
      console.warn("Cloudinary cleanup failed (non-fatal):", err.message || err);
    }
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: ` User ${name} deleted successfully`,
  });
});

User.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  if (stats.length > 0) {
    const subscription = await User.find({
      "subscription.status": "active",
    });

    stats[0].users = await User.countDocuments();
    stats[0].subscription = subscription.length;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();
  }
});
