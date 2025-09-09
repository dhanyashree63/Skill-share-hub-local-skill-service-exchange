export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    httpOnly: true,
    secure: isProduction,                   // ✅ true only in production
    sameSite: isProduction ? "none" : "lax" // ✅ lax in dev
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
    token: !isProduction ? token : undefined, // optionally return token in dev
  });
};