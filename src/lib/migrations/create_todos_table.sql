CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL,
  due_date DATE,
  priority INTEGER DEFAULT 0,
  tags TEXT[]
); 