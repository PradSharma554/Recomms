# Recomms

A news reader built with Next.js. Browse top headlines by category, sign in with Google, and save articles to your own library.

## Features

- **Category feed**: top US headlines from [NewsAPI](https://newsapi.org) in six categories: nutrition, technology, sports, politics, geopolitics and archeology. Results are cached for an hour.
- **Google sign-in**: handled by NextAuth (Auth.js v5). A user record is created in MongoDB on first login.
- **Read Later**: logged-in users can save or unsave any article. Saved articles go into a "Read Later" collection that is created automatically.
- **Library**: a page listing your collections. You can create new named collections and open any collection to see its articles.
- **UI**: Tailwind CSS v4 and shadcn/ui (Radix) components, with dark mode support.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Auth | NextAuth v5 with the Google provider |
| Database | MongoDB with Mongoose |
| News data | NewsAPI `top-headlines` endpoint |
| Styling | Tailwind CSS v4, shadcn/ui, lucide-react icons |

## Project structure

```
app/
  page.js                    Home feed with category tabs
  login/page.js              Google sign-in page
  library/page.js            Your collections
  collections/[id]/page.js   Articles in one collection
  api/
    auth/[...nextauth]/      NextAuth handlers
    articles/                POST: save / unsave an article
    collections/             GET: list collections, POST: create one
components/                  NewsCard, NewsList, CategoryTabs, CreateCollectionButton, ui/
lib/
  auth.js                    NextAuth config and callbacks
  db.js                      Cached Mongoose connection
  newsApi.js                 NewsAPI client and category mapping
models/                      User, Article, Collection, CollectionArticle
```

## Data model

- **User**: name, email (unique), image
- **Article**: title, description, url (unique), source, imageUrl, publishedAt, category
- **Collection**: a named list that belongs to a user
- **CollectionArticle**: links an article to a collection; each pair is unique

## Getting started

### Prerequisites

- Node.js 20 or newer
- A MongoDB database (local or MongoDB Atlas)
- A free NewsAPI key from https://newsapi.org/register
- A Google OAuth client from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), with this authorized redirect URI:
  `http://localhost:3000/api/auth/callback/google`

### Setup

```bash
git clone https://github.com/PradSharma554/Recomms.git
cd Recomms
npm install
```

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/recomms
NEWS_API_KEY=your_newsapi_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=any_long_random_string   # e.g. openssl rand -base64 32
```

Run the development server:

```bash
npm run dev
```

Then open http://localhost:3000.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Known limitations

- The save button always adds to "Read Later"; you can't yet choose a different collection.
- The saved state of an article isn't loaded from the database, so the button resets after a page reload.
- NewsAPI's free plan only works from `localhost`. A deployed version needs a paid plan or a different news source.
