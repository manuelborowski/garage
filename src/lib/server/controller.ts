import { set_relay } from './mqtt';


export const init = () => {
  console.log("starting controller.ts");
}

export const pulse_door_opener = () => {
  set_relay(true);
  setTimeout(()=> {set_relay(false)}, 1000);
}
