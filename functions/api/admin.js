// Cloudflare Pages Function: /api/admin
// Password-protected admin API for managing wall submissions
// Requires ADMIN_PASSWORD env var set in Cloudflare Pages settings

export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const adminPassword = context.env.ADMIN_PASSWORD;

        if (!db || !adminPassword) {
            return new Response(JSON.stringify({ error: 'Not configured.' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await context.request.json();
        const { action, password, id } = body;

        if (password !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Wrong password.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (action === 'login') {
            return new Response(JSON.stringify({ ok: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (action === 'list') {
            const { results } = await db.prepare(
                "SELECT id, content, role, created_at FROM wall_submissions WHERE status = 'pending' ORDER BY created_at DESC"
            ).all();

            return new Response(JSON.stringify({ ok: true, submissions: results }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (action === 'approve' && id) {
            await db.prepare(
                "UPDATE wall_submissions SET status = 'approved', approved_at = datetime('now') WHERE id = ?"
            ).bind(id).run();

            return new Response(JSON.stringify({ ok: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (action === 'reject' && id) {
            await db.prepare(
                "UPDATE wall_submissions SET status = 'rejected' WHERE id = ?"
            ).bind(id).run();

            return new Response(JSON.stringify({ ok: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'Invalid action.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Server error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
