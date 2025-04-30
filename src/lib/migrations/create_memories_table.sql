CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  tags TEXT[],
  image_urls TEXT[],
  created_at BIGINT NOT NULL,
  is_highlighted BOOLEAN DEFAULT FALSE
); 