import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pulse_door_opener } from '$lib/server/controller';
import { get_switches } from '$lib/server/mqtt';

export const GET = (({ url }) => {
  // console.log("Get switches")
  const switches_mqtt = get_switches();
  const switches = {
    switch_opened: switches_mqtt.switch_a,
    switch_closed: switches_mqtt.switch_b
  }
  return json({switches, status: true})
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  const data = await request.json();
  if (data.action === "pulse-door-opener") {
    pulse_door_opener()
  }

  return json({status: true})
}) satisfies RequestHandler;
