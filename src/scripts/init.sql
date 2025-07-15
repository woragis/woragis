-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Project <-> Category (many-to-many)
CREATE TABLE IF NOT EXISTS project_category (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Niches table
CREATE TABLE IF NOT EXISTS niches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Project <-> Niche (many-to-many)
CREATE TABLE IF NOT EXISTS niche_project (
  project_id INTEGER NOT NULL,
  niche_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, niche_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (niche_id) REFERENCES niches(id)
);

-- Places table (one-to-many with Project)
CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
