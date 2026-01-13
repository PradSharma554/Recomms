import mongoose from "mongoose";

const CollectionArticleSchema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
});

// Ensure unique pairs to prevent duplicate articles in same collection
CollectionArticleSchema.index(
  { collectionId: 1, articleId: 1 },
  { unique: true }
);

const CollectionArticle =
  mongoose.models.CollectionArticle ||
  mongoose.model("CollectionArticle", CollectionArticleSchema);

export default CollectionArticle;
