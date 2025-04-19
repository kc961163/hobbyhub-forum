# HobbyHub Forum

A React-based community platform for hobby enthusiasts to share posts, discuss ideas, and connect with like-minded individuals.

## 📋 Overview

HobbyHub is an interactive forum where users can create posts about their favorite hobbies, upvote content they enjoy, and engage in discussions through comments. The application provides a seamless experience for content creation, discovery, and interaction.

## ✨ Features

- **User Authentication**: Anonymous user identification with UUID-based tracking
- **Post Management**:
  - Create posts with title, content, and image URL
  - Edit and delete your own posts
  - Upvote posts you find valuable
- **Content Discovery**:
  - Browse a feed of all community posts
  - Sort posts by creation time or popularity (upvotes)
  - Search for posts by title
  - Filter posts by categories/flags
- **Commenting System**:
  - Leave comments on posts
  - View discussions under each post
- **Responsive Design**:
  - Optimized for both desktop and mobile viewing

## 🛠️ Technologies

- **Frontend**:
  - React 19
  - React Router 7
  - Tailwind CSS
- **Backend**:
  - Supabase (BaaS)
  - PostgreSQL Database
- **Development**:
  - Vite
  - ESLint
  - PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account for backend services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hobbyhub-forum.git
   cd hobbyhub-forum
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173/`

## 📊 Database Schema

### Posts Table
- `id`: UUID (primary key)
- `title`: String (required)
- `content`: Text
- `image_url`: String
- `author_id`: UUID (foreign key to user_preferences)
- `upvotes`: Integer (default: 0)
- `flags`: Array of strings
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Comments Table
- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `content`: Text (required)
- `author_id`: UUID (foreign key to user_preferences)
- `created_at`: Timestamp

### User Preferences Table
- `user_id`: UUID (primary key)
- `secret_key`: String
- `created_at`: Timestamp

## 🌟 Stretch Features

- Post flags for categorization (Question/Opinion)
- Custom theming options
- Rich text editor for post content
- Direct image uploads from local machine
- Loading animations
- Post reposting/threading functionality

## 🔧 Project Structure

```
hobbyhub/
├── public/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # Reusable UI components
│   │   ├── layout/    # Layout components
│   │   └── ui/        # UI elements
│   ├── context/       # React context providers
│   ├── pages/         # Page components
│   ├── services/      # API and backend services
│   ├── styles/        # Global styles and themes
│   └── utils/         # Utility functions
├── .env               # Environment variables
└── ...                # Config files
```

## 📝 License

[MIT](LICENSE)