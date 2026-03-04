// Cloudflare Pages Function: /api/react
// Increments reaction count for an approved wall submission

export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        if (!db) {
            return new Response(JSON.stringify({ error: 'Not available.' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await context.request.json();
        const id = parseInt(body.id, 10);

        if (!id || id < 1) {
            return new Response(JSON.stringify({ error: 'Invalid ID.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await db.prepare(
            "UPDATE wall_submissions SET reactions = reactions + 1 WHERE id = ? AND status = 'approved'"
        ).bind(id).run();

        if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Story not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results } = await db.prepare(
            "SELECT reactions FROM wall_submissions WHERE id = ?"
        ).bind(id).all();

        const reactions = results.length > 0 ? results[0].reactions : 0;

        return new Response(JSON.stringify({ ok: true, reactions: reactions }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Reaction failed.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
