USE task_db;

CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_project (project_id),
  INDEX idx_status (status)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_status_view (
  project_id VARCHAR(36) PRIMARY KEY,
  project_name VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL
);