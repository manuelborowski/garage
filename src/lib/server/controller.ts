import { get_switches, set_relay } from './mqtt';
import { STATEMACHINE_PERIOD, STATE_MOVING_TIMEOUT } from '$env/static/private';


let state: string = "init";
let timeout_occured: boolean = false;
let state_moving_timeout: number = parseInt(STATE_MOVING_TIMEOUT);
let statemachine_period: number = parseInt(STATEMACHINE_PERIOD);

export const init = () => {
// console.log("starting controller.ts");
  setInterval(() => {
    const {switch_opened, switch_closed } = get_switches(); 
  // console.log("switch_opened, switch_closed, timeout, state-BEFORE", switch_opened, switch_closed, timeout, state);
    switch (state) {
      case "init":
        if (!switch_opened && !switch_closed) {
          setTimeout(() => {timeout_occured = true}, state_moving_timeout * 1000)
          state = "moving";
        }
        else if (switch_opened) state = "opened"
        else if (switch_closed) state = "closed"
        else state = "error"
        break;
      case "opened":
        if (switch_opened && switch_closed) state = "error"
        else if (!switch_opened && !switch_closed) {
          setTimeout(() => {timeout_occured = true}, state_moving_timeout * 1000)
          state = "moving";
        }
        break;
      case "closed":
        if (switch_opened && switch_closed) state = "error"
        else if (!switch_opened && !switch_closed) {
          setTimeout(() => {timeout_occured = true}, state_moving_timeout * 1000)
          state = "moving";
        }
        break;
      case "moving":
        if (switch_opened && switch_closed) state = "error"
        else if (timeout_occured) state = "timeout"
        else if (switch_opened) state = "opened"
        else if (switch_closed) state = "closed"
        break;
      case "timeout":
        if (switch_opened && switch_closed) state = "error"
        else if (switch_opened) state = "opened"
        else if (switch_closed) state = "closed"
        break;
      case "error":
        if (!switch_opened && !switch_closed) {
          setTimeout(() => {timeout_occured = true}, state_moving_timeout * 1000)
          state = "moving";
        }
        else if (switch_opened && !switch_closed) state = "opened"
        else if (switch_closed && !switch_opened) state = "closed"
        break;
    }
    timeout_occured = false;
  // console.log("state-AFTER", state);
  }, statemachine_period);
}

export const pulse_door_opener = () => {
  set_relay(true);
  setTimeout(()=> {set_relay(false)}, 1000);
}

export const get_state = () => {
  return state
}
