import { error, json } from '@sveltejs/kit';
import { getSMTPConfig, sendEmail } from '$lib/email.js';
import { get } from '@vercel/edge-config';

function extractTokenFromHeader(request) {
    const [type, token] = request.headers.get('authorization')?.split(' ') ?? [];
    return type === 'Bearer' && token !== 'undefined' ? token : null;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const token = extractTokenFromHeader(request)
    console.log(22, token)
    if(!token) {
        error(401, 'Unauthorized, missing access token')
    }
    const body = await request.json();
    const user = await get(token)
    console.log(33, user)
    if(!user) {
        error(403, 'Unauthorized, invalid access token')
    }
    user.smtp = {
        ...getSMTPConfig(user.user),
        ...user,
    }
    body.from = `${JSON.stringify(body.from)} <${user.user}>`
    const result = await sendEmail(body, user)
    return json(result)
}