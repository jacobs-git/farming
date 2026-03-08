PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS builds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  season_year INTEGER NOT NULL,
  canvas_width_in REAL NOT NULL CHECK (canvas_width_in > 0),
  canvas_height_in REAL NOT NULL CHECK (canvas_height_in > 0),
  background_color TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beds (
  id TEXT PRIMARY KEY,
  build_id TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  x_in REAL NOT NULL CHECK (x_in >= 0),
  y_in REAL NOT NULL CHECK (y_in >= 0),
  width_in REAL NOT NULL CHECK (width_in > 0),
  height_in REAL NOT NULL CHECK (height_in > 0),
  color TEXT NOT NULL,
  border_color TEXT NOT NULL,
  rotation_deg REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plant_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  default_width_in REAL NOT NULL CHECK (default_width_in > 0),
  default_height_in REAL NOT NULL CHECK (default_height_in > 0),
  default_color TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plant_placements (
  id TEXT PRIMARY KEY,
  build_id TEXT NOT NULL,
  bed_id TEXT NOT NULL,
  plant_catalog_id TEXT,
  name TEXT NOT NULL,
  x_in REAL NOT NULL CHECK (x_in >= 0),
  y_in REAL NOT NULL CHECK (y_in >= 0),
  width_in REAL NOT NULL CHECK (width_in > 0),
  height_in REAL NOT NULL CHECK (height_in > 0),
  color TEXT NOT NULL,
  label TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE,
  FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_catalog_id) REFERENCES plant_catalog(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_beds_build_id ON beds(build_id);
CREATE INDEX IF NOT EXISTS idx_placements_build_id ON plant_placements(build_id);
CREATE INDEX IF NOT EXISTS idx_placements_bed_id ON plant_placements(bed_id);
CREATE INDEX IF NOT EXISTS idx_placements_catalog_id ON plant_placements(plant_catalog_id);
CREATE INDEX IF NOT EXISTS idx_catalog_name ON plant_catalog(name);
