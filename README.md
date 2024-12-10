# Supabase KL Project

This project is a full-stack application built using **Vue 3** and **Supabase** for a Supabase Meetup event. It allows users to post feedback, upload an avatar, and interact with the community. The project demonstrates how to use Supabase for authentication, file storage, and real-time data fetching.

## Features

- **Sign Up / Login**: Users can sign in using a magic link provided by Supabase.
- **Post Feedback**: Users can submit feedback for the event.
- **Avatar Upload**: Users can upload their avatar images.
- **Real-Time Updates**: Posts are displayed in real-time when new feedback is added.
- **Admin Dashboard**: Admin users can view and manage the content submitted.

## Tech Stack

- **Frontend**: 
  - Vue 3
  - Pinia (State Management)
  - TailwindCSS (Styling)
  - Vue Router (Routing)
  
- **Backend**: 
  - Supabase (Authentication, Database, File Storage)

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- A Supabase account and project

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/supabasekl.git
cd supabasekl
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file at the root of your project and add the following variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the application

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

## Folder Structure

```
src/
├── assets/                # Static files like images, styles
├── components/            # Reusable components like PostCard, Auth
├── services/              # Supabase client and utility functions
├── stores/                # Pinia stores for state management
├── views/                 # Views for different pages (Home, Admin, etc.)
├── router/                # Vue Router configuration
├── App.vue                # Main App component
├── main.js                # Entry point of the application
└── tailwind.config.js     # TailwindCSS configuration
```

## Supabase Setup

1. **Authentication**: Supabase provides magic link authentication. Users will receive an email link to sign in.
   
2. **Database**:
   - `users` table: Stores user data.
   - `posts` table: Stores feedback posts.
   - **Real-Time**: We use Supabase's real-time functionality to subscribe to changes and instantly update the UI.

3. **Storage**: The avatars are stored in Supabase storage under a bucket named `avatars`.

## Contributing

Feel free to fork the repository and submit issues or pull requests.

## License

This project is licensed under the MIT License.
```

This README includes the necessary setup steps, feature overview, and relevant instructions to run the project. Let me know if you need any further adjustments!