import * as mqtt from "async-mqtt"
import { MQTT_SERVER_URL, SONOFF_ID } from '$env/static/private';

let relay_state: boolean = false;
let switch_a: boolean = false;
let switch_b: boolean = false;
let client: mqtt.AsyncMqttClient;

export const init = () => {
  console.log(MQTT_SERVER_URL, SONOFF_ID)
  try {
    client = mqtt.connect(MQTT_SERVER_URL);
  } catch (error) {
    console.log("error", error);
  }
  client.on('connect', () => {
    console.log('connected')
    client.subscribe(`stat/${SONOFF_ID}/RESULT`)
  })

  client.on('message', (topic, message) => {
    // message is Buffer
    // console.log(topic, message)
    if (topic.toString().includes("RESULT")) {
      const json_data = JSON.parse(message.toString());
      console.log("json_data?.SWITCHA, json_data?.SWITCHB", json_data?.SWITCHA, json_data?.SWITCHB)
      if (json_data.SWITCHA !== undefined) switch_a = json_data.SWITCHA === "1";
      if (json_data.SWITCHB !== undefined) switch_b = json_data.SWITCHB === "1";

      console.log("switch A, switch B, C", switch_a, switch_b);
    }
  })
}


export const get_switches = () => {return {switch_a, switch_b}}

export const get_relay = () => { return relay_state }

export const set_relay = (state: boolean) => {
  console.log("set relay", state);
  client.publish(`cmnd/${SONOFF_ID}/POWER`, state ? "ON" : "OFF");
}

