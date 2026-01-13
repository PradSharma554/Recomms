import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Article from "@/models/Article";
import Collection from "@/models/Collection";
import CollectionArticle from "@/models/CollectionArticle";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { article, action } = await req.json();
    await connectToDatabase();

    // 1. Ensure Article Exists
    let dbArticle = await Article.findOne({ url: article.url });

    if (!dbArticle) {
      dbArticle = await Article.create({
        ...article,
        publishedAt: new Date(article.publishedAt),
        category: "general",
      });
    }

    // 2. Get or Create "Read Later" Collection for User
    let defaultCollection = await Collection.findOne({
      userId: session.user.id,
      name: "Read Later",
    });

    if (!defaultCollection) {
      defaultCollection = await Collection.create({
        userId: session.user.id,
        name: "Read Later",
      });
    }

    // 3. Handle Action
    if (action === "save") {
      // Check if already in collection
      const exists = await CollectionArticle.findOne({
        collectionId: defaultCollection._id,
        articleId: dbArticle._id,
      });

      if (!exists) {
        await CollectionArticle.create({
          collectionId: defaultCollection._id,
          articleId: dbArticle._id,
        });
      }
    } else if (action === "unsave") {
      await CollectionArticle.findOneAndDelete({
        collectionId: defaultCollection._id,
        articleId: dbArticle._id,
      });
    }

    return NextResponse.json({ success: true, isSaved: action === "save" });
  } catch (error) {
    console.error("Article save error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
