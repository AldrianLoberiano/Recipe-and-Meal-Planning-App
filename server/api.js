import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '12mb' }));

const mysqlUrl = process.env.MYSQL_URL;
if (!mysqlUrl) {
  throw new Error('Missing MYSQL_URL in environment variables.');
}

const configuredDbName = process.env.MYSQL_DATABASE?.trim() || 'recipe_and_meal_planner';
const dbName = /^[a-zA-Z0-9_]+$/.test(configuredDbName)
  ? configuredDbName
  : 'recipe_and_meal_planner';

const pool = mysql.createPool({
  uri: mysqlUrl,
  connectionLimit: Number(process.env.MYSQL_POOL_LIMIT ?? 10),
  waitForConnections: true,
  queueLimit: 0,
});

async function ensureRecipeSyncTable() {
  await pool.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS \`${dbName}\`.\`recipes\` (
      id BIGINT UNSIGNED NOT NULL,
      title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(30) NOT NULL,
      image_url LONGTEXT NOT NULL,
      prep_time INT NOT NULL DEFAULT 0,
      cook_time INT NOT NULL DEFAULT 0,
      servings INT NOT NULL DEFAULT 1,
      calories INT NOT NULL DEFAULT 0,
      protein DECIMAL(8,2) NOT NULL DEFAULT 0,
      carbs DECIMAL(8,2) NOT NULL DEFAULT 0,
      fat DECIMAL(8,2) NOT NULL DEFAULT 0,
      fiber DECIMAL(8,2) NOT NULL DEFAULT 0,
      rating DECIMAL(3,1) NOT NULL DEFAULT 0,
      rating_count INT NOT NULL DEFAULT 0,
      is_favorite TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATE NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB`
  );
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown DB error';
    res.status(500).json({ ok: false, message });
  }
});

app.post('/api/recipes/sync', async (req, res) => {
  const recipe = req.body?.recipe;

  if (!recipe) {
    res.status(400).json({ ok: false, message: 'Missing recipe payload.' });
    return;
  }

  if (!recipe.id || !recipe.title || !recipe.description || !recipe.category) {
    res.status(400).json({ ok: false, message: 'Recipe payload is incomplete.' });
    return;
  }

  try {
    const id = Number(recipe.id);
    if (!Number.isFinite(id) || id <= 0) {
      res.status(400).json({ ok: false, message: 'Recipe id must be a positive number.' });
      return;
    }

    const imageUrl = typeof recipe.image === 'string' && recipe.image.length > 0
      ? recipe.image
      : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

    const calories = Number(recipe.nutrition?.calories ?? 0);
    const protein = Number(recipe.nutrition?.protein ?? 0);
    const carbs = Number(recipe.nutrition?.carbs ?? 0);
    const fat = Number(recipe.nutrition?.fat ?? 0);
    const fiber = Number(recipe.nutrition?.fiber ?? 0);

    const createdAt = typeof recipe.createdAt === 'string' && recipe.createdAt
      ? recipe.createdAt
      : new Date().toISOString().slice(0, 10);

    await ensureRecipeSyncTable();

    await pool.query(
      `INSERT INTO \`${dbName}\`.\`recipes\` (
        id, title, description, category, image_url,
        prep_time, cook_time, servings,
        calories, protein, carbs, fat, fiber,
        rating, rating_count, is_favorite, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        category = VALUES(category),
        image_url = VALUES(image_url),
        prep_time = VALUES(prep_time),
        cook_time = VALUES(cook_time),
        servings = VALUES(servings),
        calories = VALUES(calories),
        protein = VALUES(protein),
        carbs = VALUES(carbs),
        fat = VALUES(fat),
        fiber = VALUES(fiber),
        rating = VALUES(rating),
        rating_count = VALUES(rating_count),
        is_favorite = VALUES(is_favorite),
        created_at = VALUES(created_at)`,
      [
        id,
        recipe.title,
        recipe.description,
        recipe.category,
        imageUrl,
        Number(recipe.prepTime ?? 0),
        Number(recipe.cookTime ?? 0),
        Math.max(1, Number(recipe.servings ?? 1)),
        calories,
        protein,
        carbs,
        fat,
        fiber,
        Number(recipe.rating ?? 0),
        Number(recipe.ratingCount ?? 0),
        recipe.isFavorite ? 1 : 0,
        createdAt,
      ]
    );

    res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('[recipes/sync] error:', message);
    res.status(500).json({ ok: false, message });
  }
});

app.listen(port, () => {
  console.log(`Recipe sync API running on http://localhost:${port}`);
});
