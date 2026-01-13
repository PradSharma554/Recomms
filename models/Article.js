import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true, unique: true }, // Ensure unique articles by URL
  source: { type: String, required: true },
  imageUrl: { type: String },
  publishedAt: { type: Date, required: true },
  category: { type: String, required: true },
});

// Index for faster lookups if needed
ArticleSchema.index({ url: 1 });

const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;
