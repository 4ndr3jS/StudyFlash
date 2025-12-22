StudyFlash 📚
A modern web application designed to help students learn more effectively through active recall, AI-powered study tools, and progress tracking.
🌟 Features
Core Features

AI Chat Assistant (Flashy) - Get instant help with your study questions
Document Upload - Support for PDF, TXT, DOC, and DOCX files
AI Flashcard Generation - Automatically create flashcards from your study materials
Quiz Generation - Generate custom quizzes based on uploaded content
Study Time Tracking - Monitor your learning sessions automatically
Progress Dashboard - Visualize your study habits and improvement
Dark Mode - Easy on the eyes during late-night study sessions
Customizable UI - Choose from multiple fonts and accent colors

Study Tools

📝 Flashcard Viewer - Interactive flip cards with progress tracking
✅ Quiz System - 16-question quizzes with AI-powered answer verification
📊 Analytics - Track study time, accuracy, and flashcard count
🎯 Goal Setting - Set weekly study hour goals
🔥 Streak Tracking - Build consistent study habits
💬 AI Chat - Conversational study assistant powered by Groq AI

🚀 Tech Stack

Frontend: Vanilla JavaScript, HTML5, CSS3
Backend: Cloudflare Workers (API proxy)
Database: Supabase (PostgreSQL)
AI: Groq API (Llama 3.3 70B & Llama 3.1 8B)
PDF Processing: PDF.js
Document Processing: Mammoth.js
Charts: Chart.js
Authentication: Supabase Auth

📋 Prerequisites
Before you begin, ensure you have:

A Supabase account
A Groq API key
A Cloudflare account for Workers
Node.js installed (for local development)

🛠️ Installation
1. Clone the Repository
bashgit clone https://github.com/yourusername/studyflash.git
cd studyflash
2. Configure Supabase
Create a config.js file in the root directory:
javascriptconst CONFIG = {
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
    HF_TOKEN: 'YOUR_KEY_FOR_AI_AGENT'
};

window.CONFIG = CONFIG;
3. Set Up Supabase Database
Run these SQL commands in your Supabase SQL editor:
sql-- Users are managed by Supabase Auth automatically

-- Study time tracking
CREATE TABLE study_time (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Uploaded files
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Flashcard sets
CREATE TABLE flashcard_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_ids TEXT[] NOT NULL,
    file_names TEXT[] NOT NULL,
    flashcards JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz sets
CREATE TABLE quiz_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_ids TEXT[] NOT NULL,
    file_names TEXT[] NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Study goals
CREATE TABLE study_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hours_per_week INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE study_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow users to only access their own data)
CREATE POLICY "Users can view own study_time" ON study_time FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study_time" ON study_time FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study_time" ON study_time FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own files" ON uploaded_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own files" ON uploaded_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON uploaded_files FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own flashcards" ON flashcard_sets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcards" ON flashcard_sets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON flashcard_sets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quizzes" ON quiz_sets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quizzes" ON quiz_sets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quizzes" ON quiz_sets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON study_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON study_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON study_goals FOR UPDATE USING (auth.uid() = user_id);
4. Set Up Supabase Storage

Go to Supabase Dashboard → Storage
Create a new bucket named documents
Set it to private
Add policy:

sqlCREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
5. Deploy Cloudflare Worker

Install Wrangler CLI:

bashnpm install -g wrangler

Login to Cloudflare:

bashwrangler login

Create a new worker using the code in worker.js
Add secret to worker:

bashwrangler secret put GROQ_API_KEY
# Enter your Groq API key when prompted

Deploy:

bashwrangler deploy

Update index.js with your worker URL:

javascriptconst res = await fetch("https://YOUR-WORKER.workers.dev/chat", {
    // ...
});

📁 Project Structure
studyflash/
├── index.html          # Landing page
├── dashboard.html      # User dashboard
├── study.html          # Main study interface
├── settings.html       # User settings
├── styles.css          # Main stylesheet
├── app.js              # Supabase integration
├── index.js            # Main application logic
├── init.js             # Supabase initialization
├── authGuard.js        # Route protection
├── globalSettings.js   # Theme & settings management
├── chart.js            # Dashboard charts
├── config.js           # Configuration (NOT committed)
└── imgs/               # Image assets

🔒 Security Notes

Never commit config.js to GitHub
Use Supabase anon/public key (safe for frontend)
Store sensitive API keys in Cloudflare Worker secrets

🎨 Customization
Users can customize:

Fonts: Inter, Roboto, Open Sans, Montserrat, Poppins, Lato, Nunito
Accent Colors: Blue, Red, Yellow, Green
Dark Mode: Toggle between light and dark themes
Study Goals: Set custom weekly hour targets

📊 Database Schema

study_time: Daily study session tracking
uploaded_files: Document metadata and storage paths
flashcard_sets: Generated flashcard collections
quiz_sets: Generated quiz questions
quiz_attempts: Quiz results and scoring
study_goals: User-defined study targets


Flashcard generation may occasionally fail with special characters
Quiz verification relies on AI and may have false positives/negatives
Large PDF files (>10MB) may take longer to process

🚀 Future Enhancements

 Spaced repetition algorithm for flashcards
 Collaborative study groups
 Mobile app (React Native)
 Export flashcards to Anki
 Voice-to-text for quiz answers
 Advanced analytics and insights

AI powered by Groq, the llm tat i am using: llama-3.1-8b-instant
Icons from various open-source projects
