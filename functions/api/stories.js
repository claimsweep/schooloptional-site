// Cloudflare Pages Function: /api/stories
// Requires D1 binding named "DB" in wrangler.toml / Pages dashboard
//
// D1 Setup SQL:
// CREATE TABLE wall_submissions (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   content TEXT NOT NULL,
//   role TEXT,
//   status TEXT DEFAULT 'pending',
//   created_at TEXT DEFAULT (datetime('now')),
//   approved_at TEXT
// );

export async function onRequestGet(context) {
    try {
        const db = context.env.DB;
        if (!db) {
            return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results } = await db.prepare(
            "SELECT id, content, role, created_at FROM wall_submissions WHERE status = 'approved' ORDER BY approved_at DESC LIMIT 100"
        ).all();

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify([]), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        if (!db) {
            return new Response(JSON.stringify({ ok: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await context.request.json();
        const content = (body.content || '').trim();
        const role = ['parent', 'student', 'teacher'].includes(body.role) ? body.role : null;

        if (content.length < 50 || content.length > 1000) {
            return new Response(JSON.stringify({ error: 'Content must be 50-1000 characters.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await db.prepare(
            "INSERT INTO wall_submissions (content, role) VALUES (?, ?)"
        ).bind(content, role).run();

        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Submission failed.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
