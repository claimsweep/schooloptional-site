// Cloudflare Pages Worker (Advanced Mode)
// Handles API routes + URL redirects + static assets
// Note: functions/ directory is ignored when _worker.js exists

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// ── Blocklist for auto-moderation ──
const BLOCKLIST = [
    'fuck', 'shit', 'ass', 'bitch', 'cunt', 'dick', 'nigger', 'nigga', 'faggot', 'fag',
    'retard', 'whore', 'slut', 'kike', 'spic', 'chink', 'wetback', 'tranny',
    'kill yourself', 'kys', 'shoot up', 'bomb threat', 'gonna shoot', 'bring a gun',
    'http://', 'https://', '.com/', '.net/', 'bit.ly', 'tinyurl',
    'buy now', 'click here', 'free money', 'crypto', 'bitcoin', 'onlyfans',
    'viagra', 'cialis', 'casino', 'gambling'
];

function isFlagged(text) {
    const lower = text.toLowerCase();
    return BLOCKLIST.some(word => lower.includes(word));
}

// ── /api/stories ──
async function handleStoriesGet(env) {
    try {
        const db = env.DB;
        if (!db) {
            return new Response(JSON.stringify([]), { headers: JSON_HEADERS });
        }
        const { results } = await db.prepare(
            "SELECT id, content, role, created_at, reactions FROM wall_submissions WHERE status = 'approved' ORDER BY reactions DESC, approved_at DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(results), {
            headers: { ...JSON_HEADERS, 'Cache-Control': 'public, max-age=300' }
        });
    } catch (e) {
        return new Response(JSON.stringify([]), { headers: JSON_HEADERS });
    }
}

async function handleStoriesPost(request, env) {
    try {
        const db = env.DB;
        if (!db) {
            return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
        }
        const body = await request.json();
        const content = (body.content || '').trim();
        const role = ['parent', 'student', 'teacher'].includes(body.role) ? body.role : null;

        if (content.length < 50 || content.length > 1000) {
            return new Response(JSON.stringify({ error: 'Content must be 50-1000 characters.' }), {
                status: 400, headers: JSON_HEADERS
            });
        }

        const flagged = isFlagged(content);
        if (flagged) {
            await db.prepare(
                "INSERT INTO wall_submissions (content, role, status) VALUES (?, ?, 'pending')"
            ).bind(content, role).run();
        } else {
            await db.prepare(
                "INSERT INTO wall_submissions (content, role, status, approved_at) VALUES (?, ?, 'approved', datetime('now'))"
            ).bind(content, role).run();
        }

        return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Submission failed.' }), {
            status: 500, headers: JSON_HEADERS
        });
    }
}

// ── /api/react ──
async function handleReact(request, env) {
    try {
        const db = env.DB;
        if (!db) {
            return new Response(JSON.stringify({ error: 'Not available.' }), {
                status: 503, headers: JSON_HEADERS
            });
        }
        const body = await request.json();
        const id = parseInt(body.id, 10);
        const undo = body.undo === true;
        if (!id || id < 1) {
            return new Response(JSON.stringify({ error: 'Invalid ID.' }), {
                status: 400, headers: JSON_HEADERS
            });
        }
        const sql = undo
            ? "UPDATE wall_submissions SET reactions = MAX(0, reactions - 1) WHERE id = ? AND status = 'approved'"
            : "UPDATE wall_submissions SET reactions = reactions + 1 WHERE id = ? AND status = 'approved'";
        const result = await db.prepare(sql).bind(id).run();
        if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Story not found.' }), {
                status: 404, headers: JSON_HEADERS
            });
        }
        const { results } = await db.prepare(
            "SELECT reactions FROM wall_submissions WHERE id = ?"
        ).bind(id).all();
        const reactions = results.length > 0 ? results[0].reactions : 0;
        return new Response(JSON.stringify({ ok: true, reactions: reactions }), {
            headers: JSON_HEADERS
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Reaction failed.' }), {
            status: 500, headers: JSON_HEADERS
        });
    }
}

// ── /api/admin ──
async function handleAdmin(request, env) {
    try {
        const db = env.DB;
        const adminPassword = env.ADMIN_PASSWORD;
        if (!db || !adminPassword) {
            return new Response(JSON.stringify({ error: 'Not configured.' }), {
                status: 503, headers: JSON_HEADERS
            });
        }
        const body = await request.json();
        const { action, password, id } = body;

        if (password !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Wrong password.' }), {
                status: 401, headers: JSON_HEADERS
            });
        }

        if (action === 'login') {
            return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
        }

        if (action === 'list') {
            const { results } = await db.prepare(
                "SELECT id, content, role, created_at FROM wall_submissions WHERE status = 'pending' ORDER BY created_at DESC"
            ).all();
            return new Response(JSON.stringify({ ok: true, submissions: results }), {
                headers: JSON_HEADERS
            });
        }

        if (action === 'approve' && id) {
            await db.prepare(
                "UPDATE wall_submissions SET status = 'approved', approved_at = datetime('now') WHERE id = ?"
            ).bind(id).run();
            return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
        }

        if (action === 'reject' && id) {
            await db.prepare(
                "UPDATE wall_submissions SET status = 'rejected' WHERE id = ?"
            ).bind(id).run();
            return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
        }

        return new Response(JSON.stringify({ error: 'Invalid action.' }), {
            status: 400, headers: JSON_HEADERS
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Server error.' }), {
            status: 500, headers: JSON_HEADERS
        });
    }
}

// ── Main router ──
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // API routes
        if (url.pathname === '/api/stories') {
            if (request.method === 'GET') return handleStoriesGet(env);
            if (request.method === 'POST') return handleStoriesPost(request, env);
            return new Response('Method not allowed', { status: 405 });
        }
        if (url.pathname === '/api/react') {
            if (request.method === 'POST') return handleReact(request, env);
            return new Response('Method not allowed', { status: 405 });
        }
        if (url.pathname === '/api/admin') {
            if (request.method === 'POST') return handleAdmin(request, env);
            return new Response('Method not allowed', { status: 405 });
        }

        // Fix double-path bug: /articles/articles/* -> /articles/*
        if (url.pathname.startsWith('/articles/articles/')) {
            let fixed = url.pathname.replace('/articles/articles/', '/articles/');
            if (fixed.endsWith('.html')) fixed = fixed.slice(0, -5);
            return Response.redirect(new URL(fixed + url.search, url), 301);
        }

        // Strip .html extensions: /foo.html -> /foo
        if (url.pathname.endsWith('.html')) {
            const clean = url.pathname.slice(0, -5);
            return Response.redirect(new URL(clean + url.search, url), 301);
        }

        return env.ASSETS.fetch(request);
    }
};
