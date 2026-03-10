USE notification_db;

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NULL,
  message TEXT NOT NULL,
  type VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_project (project_id),
  INDEX idx_type (type)
) DEFAULT CHARSET=utf8mb4;