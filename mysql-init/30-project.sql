USE project_db;

CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  open_tasks_count INT NOT NULL DEFAULT 0,
  closed_tasks_count INT NOT NULL DEFAULT 0,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) DEFAULT CHARSET=utf8mb4;