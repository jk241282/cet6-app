CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL UNIQUE,
  phonetic_us TEXT,
  phonetic_uk TEXT,
  part_of_speech TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  frequency_rank INTEGER,
  exam_frequency TEXT DEFAULT '0',  -- 近10年真题出现次数，如 '15' 表示出现15次
  root_word TEXT,
  memory_tip TEXT,
  is_extra BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS word_meanings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER NOT NULL REFERENCES vocabulary(id),
  meaning_cn TEXT NOT NULL,
  meaning_en TEXT,
  usage_note TEXT,
  is_primary BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS word_examples (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER NOT NULL REFERENCES vocabulary(id),
  sentence_en TEXT NOT NULL,
  sentence_cn TEXT NOT NULL,
  exam_year TEXT,
  exam_type TEXT,
  source_section TEXT
);

CREATE TABLE IF NOT EXISTS word_phrases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER NOT NULL REFERENCES vocabulary(id),
  phrase TEXT NOT NULL,
  meaning_cn TEXT NOT NULL,
  example_en TEXT,
  example_cn TEXT
);

CREATE TABLE IF NOT EXISTS word_relations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER NOT NULL REFERENCES vocabulary(id),
  related_word TEXT NOT NULL,
  relation_type TEXT NOT NULL CHECK(relation_type IN ('synonym', 'antonym')),
  nuance_cn TEXT
);

CREATE TABLE IF NOT EXISTS reading_passages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content_en TEXT NOT NULL,
  source TEXT,
  difficulty INTEGER DEFAULT 3,
  word_count INTEGER,
  topic_tag TEXT
);

CREATE TABLE IF NOT EXISTS reading_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  passage_id INTEGER NOT NULL REFERENCES reading_passages(id),
  question_type TEXT NOT NULL,
  question_en TEXT NOT NULL,
  options_json TEXT,
  answer TEXT NOT NULL,
  explanation_cn TEXT
);

CREATE TABLE IF NOT EXISTS translation_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_text_cn TEXT NOT NULL,
  reference_en TEXT NOT NULL,
  key_points TEXT,
  difficulty INTEGER DEFAULT 3,
  exam_year TEXT
);

CREATE TABLE IF NOT EXISTS writing_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_cn TEXT NOT NULL,
  topic_en TEXT,
  category TEXT NOT NULL,
  model_essay TEXT NOT NULL,
  key_vocab TEXT,
  outline TEXT,
  difficulty INTEGER DEFAULT 3,
  exam_year TEXT
);

CREATE TABLE IF NOT EXISTS writing_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  template_structure TEXT NOT NULL,
  useful_expressions_json TEXT,
  model_paragraph_en TEXT,
  model_paragraph_cn TEXT
);

CREATE TABLE IF NOT EXISTS writing_sentences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sentence_en TEXT NOT NULL,
  sentence_cn TEXT NOT NULL,
  category TEXT NOT NULL,
  topic_tag TEXT,
  difficulty INTEGER DEFAULT 3,
  exam_year TEXT
);

CREATE TABLE IF NOT EXISTS listening_episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  audio_url TEXT,
  transcript_en TEXT NOT NULL,
  transcript_cn TEXT,
  type TEXT NOT NULL,
  exam_year TEXT
);

CREATE TABLE IF NOT EXISTS listening_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_id INTEGER NOT NULL REFERENCES listening_episodes(id),
  question_en TEXT NOT NULL,
  options_json TEXT,
  answer TEXT NOT NULL,
  explanation_cn TEXT
);

CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  sections_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exam_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  score REAL NOT NULL,
  section_scores_json TEXT,
  time_used INTEGER,
  finished_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  word_id INTEGER NOT NULL REFERENCES vocabulary(id),
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','learning','reviewed','mastered','skipped')),
  last_reviewed DATETIME,
  next_review DATETIME,
  review_count INTEGER DEFAULT 0,
  mistake_count INTEGER DEFAULT 0,
  UNIQUE(user_id, word_id)
);

CREATE TABLE IF NOT EXISTS user_errors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question_type TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  user_answer TEXT,
  correct_answer TEXT NOT NULL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON vocabulary(word);
CREATE INDEX IF NOT EXISTS idx_vocabulary_frequency ON vocabulary(frequency_rank);
CREATE INDEX IF NOT EXISTS idx_word_meanings_word_id ON word_meanings(word_id);
CREATE INDEX IF NOT EXISTS idx_word_examples_word_id ON word_examples(word_id);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_user ON user_vocabulary(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reading_passages_topic ON reading_passages(topic_tag);
