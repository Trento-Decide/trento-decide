import express, { type Request, type Response } from "express";
import { pool } from "../database.js";
import { conditionalAuthenticateToken } from "../middleware/authMiddleware.js";
import type {
  GlobalSearchItem,
  GlobalFilters,
  ProposalSearchItem,
  PollSearchItem,
  StatusRef,
  CategoryRef,
  UserRef,
} from "../../../shared/models.js";

type RequestWithUser = Request & {
  user?: {
    id: number;
  };
};

const router = express.Router();

function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const d = new Date(value);
  return !isNaN(d.getTime()) ? value : undefined;
}

function parseFilters(q: Record<string, unknown>): GlobalFilters {
  const filters: GlobalFilters = {};

  if (typeof q.q === "string" && q.q.trim() !== "") {
    filters.q = q.q;
  }

  const titlesOnly = parseBoolean(q.titlesOnly);
  if (titlesOnly !== undefined) {
    filters.titlesOnly = titlesOnly;
  }

  if (typeof q.authorUsername === "string") {
    filters.authorUsername = q.authorUsername;
  }

  if (typeof q.categoryCode === "string") {
    filters.categoryCode = q.categoryCode;
  }

  const dateFrom = parseDate(q.dateFrom);
  if (dateFrom) {
    filters.dateFrom = dateFrom;
  }

  const dateTo = parseDate(q.dateTo);
  if (dateTo) {
    filters.dateTo = dateTo;
  }

  if (typeof q.type === "string" && ["all", "proposta", "sondaggio"].includes(q.type)) {
    filters.type = q.type as "all" | "proposta" | "sondaggio";
  } else {
    filters.type = "all";
  }

  const limit = parseNumber(q.limit);
  if (limit !== undefined) {
    filters.limit = limit;
  }

  if (typeof q.sortBy === "string" && ["date", "votes", "title"].includes(q.sortBy)) {
    filters.sortBy = q.sortBy as "date" | "votes" | "title";
  } else {
    filters.sortBy = "date";
  }

  if (typeof q.sortOrder === "string" && ["asc", "desc"].includes(q.sortOrder)) {
    filters.sortOrder = q.sortOrder as "asc" | "desc";
  } else {
    filters.sortOrder = "desc";
  }

  if (typeof q.statusCode === "string") {
    filters.statusCode = q.statusCode;
  }

  const minVotes = parseNumber(q.minVotes);
  if (minVotes !== undefined) {
    filters.minVotes = minVotes;
  }

  const maxVotes = parseNumber(q.maxVotes);
  if (maxVotes !== undefined) {
    filters.maxVotes = maxVotes;
  }

  const isActive = parseBoolean(q.isActive);
  if (isActive !== undefined) {
      filters.isActive = isActive;
  }

  return filters;
}

router.get(
  "/",
  conditionalAuthenticateToken,
  async (req: Request, res: Response<{ data: GlobalSearchItem[] } | { error: string }>) => {
    try {
      const filters = parseFilters(req.query as Record<string, unknown>);
      const currentUserId = (req as unknown as RequestWithUser).user?.id;
      
      const values: unknown[] = [];
      const addParam = (val: unknown) => {
        values.push(val);
        return `$${values.length}`;
      };

      const propParts: string[] = [];
      
      const skipProposalsDueToFilters = filters.isActive !== undefined; 

      if (!skipProposalsDueToFilters && (filters.type === "all" || filters.type === "proposta")) {
        const where: string[] = ["1=1"];

        if (filters.q) {
          const idx = addParam(`%${filters.q}%`);
          if (filters.titlesOnly) {
            where.push(`p.title ILIKE ${idx}`);
          } else {
            where.push(`(p.title ILIKE ${idx} OR p.description ILIKE ${idx})`);
          }
        }

        if (filters.authorUsername) {
          const idx = addParam(`%${filters.authorUsername}%`);
          where.push(`u.username ILIKE ${idx}`);
        }

        if (filters.categoryCode) {
          const idx = addParam(filters.categoryCode);
          where.push(`c.code = ${idx}`);
        }

        if (filters.statusCode) {
           const idx = addParam(filters.statusCode);
           where.push(`s.code = ${idx}`);
        }

        if (filters.dateFrom) {
          const idx = addParam(filters.dateFrom);
          where.push(`p.created_at >= ${idx}::timestamptz`);
        }
        if (filters.dateTo) {
          const idx = addParam(filters.dateTo);
          where.push(`p.created_at < (${idx}::timestamptz + INTERVAL '1 day')`);
        }
        
        if (filters.minVotes !== undefined) {
           const idx = addParam(filters.minVotes);
           where.push(`p.vote_value >= ${idx}`);
        }
        if (filters.maxVotes !== undefined) {
           const idx = addParam(filters.maxVotes);
           where.push(`p.vote_value <= ${idx}`);
        }

        const favColumn = currentUserId 
            ? `EXISTS(SELECT 1 FROM favourites f WHERE f.proposal_id = p.id AND f.user_id = ${addParam(currentUserId)})`
            : `false`;

        propParts.push(`
          SELECT 
            'proposta' as item_type,
            p.id, 
            p.title, 
            p.description, 
            p.created_at, 
            p.vote_value, 
            -- Author Info
            u.id as author_id,
            u.username AS author_username,
            -- Category Info
            c.id AS category_id,
            c.labels AS category_labels,
            c.code AS category_code,
            c.colour AS category_colour,
            -- Status Info
            s.id AS status_id,
            s.labels AS status_labels,
            s.code AS status_code,
            s.colour AS status_colour,
            -- Poll Specifics (Null for proposals)
            NULL::boolean as poll_is_active,
            NULL::timestamptz as poll_expires_at,
            -- Favourites
            ${favColumn} as is_favourited
          FROM proposals p
          JOIN users u ON p.author_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          JOIN statuses s ON p.status_id = s.id
          WHERE ${where.join(" AND ")}
        `);
      }

      const pollParts: string[] = [];

      const skipPollsDueToFilters = filters.statusCode !== undefined || filters.minVotes !== undefined || filters.maxVotes !== undefined;

      if (!skipPollsDueToFilters && (filters.type === "all" || filters.type === "sondaggio")) {
        const where: string[] = ["1=1"];

        if (filters.q) {
          const idx = addParam(`%${filters.q}%`);
          if (filters.titlesOnly) {
            where.push(`pl.title ILIKE ${idx}`);
          } else {
            where.push(`(pl.title ILIKE ${idx} OR pl.description ILIKE ${idx})`);
          }
        }

        if (filters.authorUsername) {
          const idx = addParam(`%${filters.authorUsername}%`);
          where.push(`u.username ILIKE ${idx}`);
        }

        if (filters.categoryCode) {
          const idx = addParam(filters.categoryCode);
          where.push(`c.code = ${idx}`);
        }

        if (filters.dateFrom) {
          const idx = addParam(filters.dateFrom);
          where.push(`pl.created_at >= ${idx}::timestamptz`);
        }
        if (filters.dateTo) {
          const idx = addParam(filters.dateTo);
          where.push(`pl.created_at < (${idx}::timestamptz + INTERVAL '1 day')`);
        }

        pollParts.push(`
          SELECT 
            'sondaggio' as item_type,
            pl.id, 
            pl.title, 
            pl.description, 
            pl.created_at,
            NULL::integer as vote_value, 
            -- Author Info
            u.id as author_id,
            u.username AS author_username,
            -- Category Info
            c.id AS category_id,
            c.labels AS category_labels,
            c.code AS category_code,
            c.colour AS category_colour, 
            -- Status Info (Null for polls)
            NULL AS status_id,
            NULL::jsonb as status_labels,
            NULL as status_code,
            NULL as status_colour,
            -- Poll Specifics
            pl.is_active as poll_is_active,
            pl.expires_at as poll_expires_at,
            -- Favourites
            false as is_favourited
          FROM polls pl
          JOIN users u ON pl.created_by = u.id
          LEFT JOIN categories c ON pl.category_id = c.id
          WHERE ${where.join(" AND ")}
        `);
      }

      const allQueries = [...propParts, ...pollParts];

      if (allQueries.length === 0) {
        return res.json({ data: [] });
      }

      const dir = filters.sortOrder === "asc" ? "ASC" : "DESC";
      let orderByClause = `ORDER BY created_at ${dir}`;
      
      if (filters.sortBy === "title") {
        orderByClause = `ORDER BY title ${dir}`;
      } else if (filters.sortBy === "votes") {
        orderByClause = `ORDER BY vote_value ${dir} NULLS LAST`;
      }

      const safeLimit = Math.min(Math.abs(filters.limit || 50), 100);

      const finalQuery = `
        ${allQueries.join(" UNION ALL ")}
        ${orderByClause}
        LIMIT ${safeLimit}
      `;

      const result = await pool.query(finalQuery, values);

      interface SearchRow {
        item_type: "proposta" | "sondaggio";
        id: number;
        title: string;
        description: string;
        created_at: Date;
        vote_value: number | null;
        
        author_id: number;
        author_username: string;

        category_id: number | null;
        category_labels: Record<string, string> | null;
        category_code: string | null;
        category_colour: string | null;

        status_id: number | null;
        status_labels: Record<string, string> | null;
        status_code: string | null;
        status_colour: string | null;

        poll_is_active: boolean | null;
        poll_expires_at: Date | null;
        is_favourited: boolean;
      }

      const items: GlobalSearchItem[] = result.rows.map((row: SearchRow) => {
        
        const authorRef = {
            id: row.author_id,
            username: row.author_username,
        } as UserRef;

        const categoryRef: CategoryRef | undefined = row.category_id ? {
            id: row.category_id,
            code: row.category_code!,
            labels: row.category_labels!,
            colour: row.category_colour!
        } as CategoryRef: undefined;

        const baseFields = {
          id: row.id,
          title: row.title,
          description: row.description,
          date: new Date(row.created_at).toLocaleDateString("it-IT"),
          createdAt: new Date(row.created_at).toISOString(),
          isFavourited: row.is_favourited
        };

        if (row.item_type === "proposta") {
           const statusRef: StatusRef | undefined = row.status_code ? {
               id: row.status_id!,
               code: row.status_code,
               labels: row.status_labels!,
               colour: row.status_colour!
           } as StatusRef : undefined;

           const p: ProposalSearchItem = {
             type: "proposta",
             ...baseFields,
             voteValue: row.vote_value !== null ? Number(row.vote_value) : 0,
             author: authorRef,
             ...(categoryRef ? { category: categoryRef } : {}),
             ...(statusRef ? { status: statusRef } : {})
           };
           return p;
        } else {
           const isExpired = row.poll_expires_at ? new Date(row.poll_expires_at) < new Date() : false;
           const isActive = (row.poll_is_active === true) && !isExpired;

           const p: PollSearchItem = {
             type: "sondaggio",
             ...baseFields,
             isActive: isActive,
             timestamp: new Date(row.created_at).toISOString(),
             author: authorRef,
             ...(categoryRef ? { category: categoryRef } : {}),
             ...(row.poll_expires_at ? { expiresAt: row.poll_expires_at.toISOString() } : {})
           };
           return p;
        }
      });

      res.json({ data: items });

    } catch (err) {
      console.error("Global Search Error:", err);
      res.status(500).json({ error: "Errore interno durante la ricerca" });
    }
  }
);

export default router;