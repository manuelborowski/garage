import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get_state, pulse_door_opener } from '$lib/server/controller';

export const GET = (({ url }) => {
  return json({state: get_state(), status: true})
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  const data = await request.json();
  if (data.action === "pulse-door-opener") {
    pulse_door_opener()
  }
  return json({status: true})
}) satisfies RequestHandler;
