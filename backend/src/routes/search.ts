import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { conditionalAuthenticateToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", conditionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    console.log("--- SEARCH DEBUG ---");
    console.log("Query Params ricevuti:", req.query);

    const { 
      q, 
      titlesOnly, 
      author, 
      category, 
      status, 
      minVotes, 
      maxVotes, 
      dateFrom, 
      dateTo,
      type 
    } = req.query as any

    const values: any[] = []
    const conditions: string[] = []

    const addParam = (val: any) => {
      values.push(val);
      return `$${values.length}`;
    };

    if (q) {
      const idx = addParam(`%${q}%`);
      if (titlesOnly === 'true') {
        conditions.push(`p.title ILIKE ${idx}`);
      } else {
        conditions.push(`(p.title ILIKE ${idx} OR p.description ILIKE ${idx})`);
      }
    }

    if (author) {
      const idx = addParam(`%${author}%`);
      conditions.push(`u.username ILIKE ${idx}`);
    }

    if (category) {
      const idx = addParam(category);
      if (!isNaN(Number(category))) {
         conditions.push(`p.category_id = ${idx}`);
      } else {
         conditions.push(`c.label = ${idx}`);
      }
    }

    if (status) {
      const idx = addParam(status);
      conditions.push(`p.status = ${idx}`);
    }

    if (minVotes) {
      const idx = addParam(minVotes);
      conditions.push(`p.vote_count >= ${idx}`);
    }
    if (maxVotes) {
      const idx = addParam(maxVotes);
      conditions.push(`p.vote_count <= ${idx}`);
    }

    if (dateFrom) {
      const idx = addParam(dateFrom);
      conditions.push(`p.created_at >= ${idx}`);
    }
    if (dateTo) {
      const idx = addParam(dateTo);
      conditions.push(`p.created_at <= (${idx}::date + 1)`); 
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    
    console.log("Generated WHERE clause:", whereClause);
    console.log("Values array:", values);

    let query = "";

    if (!type || type === 'all' || type === 'proposta') {
      query += `
        SELECT 
          'proposta' as type,
          p.id, 
          p.title, 
          p.description, 
          u.username as author, 
          p.created_at, 
          p.vote_count as score,
          c.label as category
        FROM proposals p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
      `;
    }

    if (!query) {
      return res.json({ data: [] });
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const result = await pool.query(query, values);
    
    console.log(`Risultati trovati: ${result.rowCount}`);

    const mappedData = result.rows.map((r) => ({
      type: r.type, 
      id: r.id,
      title: r.title,
      description: r.description,
      author: r.author,
      category: r.category,
      score: Number(r.score),
      date: new Date(r.created_at).toLocaleDateString("it-IT"),
      timestamp: new Date(r.created_at).toISOString(),
    }));

    res.json({ data: mappedData });

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({
      error: "Errore durante la ricerca",
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;