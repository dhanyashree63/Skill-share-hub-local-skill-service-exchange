# Deploying to Vercel

This project is prepared to be deployed on Vercel.

---

## 🚀 Steps to Deploy

1. Push this repo to GitHub (already done ✅).
2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account.
3. Click **New Project** → Import this repo.
4. In **Settings → Environment Variables**, add these keys and values:

   - `MONGO_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`

   *(replace each with your real credentials)*

5. Click **Deploy**.
6. After deployment, Vercel will give you a live URL like:

