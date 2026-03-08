INSERT INTO builds (id, name, season_year, canvas_width_in, canvas_height_in, background_color, notes)
SELECT 'build_default', 'My Garden 2026', 2026, 240, 160, '#FAF3E0', 'Default shared workspace build.'
WHERE NOT EXISTS (SELECT 1 FROM builds);

INSERT OR IGNORE INTO beds (
  id,
  build_id,
  name,
  kind,
  x_in,
  y_in,
  width_in,
  height_in,
  color,
  border_color,
  rotation_deg,
  notes
) VALUES
('bed_raised_1', 'build_default', 'Raised Bed A', 'raised', 24, 24, 96, 48, '#8B5E3C', '#5C3D1E', 0, 'Sample 4x8 raised bed');

INSERT OR IGNORE INTO plant_catalog (id, name, category, default_width_in, default_height_in, default_color, notes)
VALUES
('plant_tomato', 'Tomato', 'fruiting', 24, 24, '#C2683A', 'Warm season crop'),
('plant_pepper', 'Pepper', 'fruiting', 18, 18, '#C9A96E', 'Compact fruiting crop'),
('plant_onion', 'Onion', 'allium', 8, 8, '#7DB87A', 'Dense planting'),
('plant_chives', 'Chives', 'allium', 6, 6, '#6B8F5E', 'Perennial herb'),
('plant_basil', 'Basil', 'herb', 12, 12, '#4A6741', 'Companion herb');

INSERT OR IGNORE INTO plant_placements (
  id,
  build_id,
  bed_id,
  plant_catalog_id,
  name,
  x_in,
  y_in,
  width_in,
  height_in,
  color,
  label,
  notes
) VALUES
('placement_tomato_1', 'build_default', 'bed_raised_1', 'plant_tomato', 'Tomato', 4, 4, 24, 24, '#C2683A', 'Tomato', ''),
('placement_pepper_1', 'build_default', 'bed_raised_1', 'plant_pepper', 'Pepper', 32, 6, 18, 18, '#C9A96E', 'Pepper', ''),
('placement_basil_1', 'build_default', 'bed_raised_1', 'plant_basil', 'Basil', 58, 8, 12, 12, '#4A6741', 'Basil', '');
