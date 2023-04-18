import * as mqtt from "async-mqtt"
import { MQTT_SERVER_URL, SONOFF_ID } from '$env/static/private';

let relay_state: boolean = false;
let switch_opened: boolean = false;
let switch_closed: boolean = false;
let client: mqtt.AsyncMqttClient;

export const init = () => {
// console.log(MQTT_SERVER_URL, SONOFF_ID)
  try {
    client = mqtt.connect(MQTT_SERVER_URL);
  } catch (error) {
  // console.log("error", error);
  }
  client.on('connect', () => {
  // console.log('connected')
    client.subscribe(`stat/${SONOFF_ID}/RESULT`)
    client.subscribe(`stat/${SONOFF_ID}/STATUS10`)
  });

  client.on('message', (topic, message) => {
    // message is Buffer
  // console.log(topic, message)
    if (topic.toString().includes("RESULT")) {
      const json_data = JSON.parse(message.toString());
      if (json_data.Switch3 !== undefined) switch_closed = json_data.Switch3 === "1";
      if (json_data.Switch4 !== undefined) switch_opened = json_data.Switch4 === "1";

    // console.log("switch opened, switch closed", switch_opened, switch_closed);
    } else if (topic.toString().includes("stat")) {
      const json_data = JSON.parse(message.toString());
    // console.log("stat received, json_data", json_data);
      if (json_data.StatusSNS.Switch3 !== undefined) switch_closed = json_data.StatusSNS.Switch3 === "ON";
      if (json_data.StatusSNS.Switch4 !== undefined) switch_opened = json_data.StatusSNS.Switch4 === "ON";
    } 
  });
  client.publish(`cmnd/${SONOFF_ID}/STATUS`, "10");
}


export const get_switches = () => {return {switch_opened, switch_closed}}

export const get_relay = () => { return relay_state }

export const set_relay = (state: boolean) => {
// console.log("set relay", state);
  client.publish(`cmnd/${SONOFF_ID}/POWER`, state ? "ON" : "OFF");
}

