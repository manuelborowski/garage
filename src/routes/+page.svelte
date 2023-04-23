<script lang="ts">
  // 0.1: started from kelder-grondwater 0.6
  // 0.2: implemented statemachine
  // 0.3: initial state is moving
  // 0.4: switch opened and closed switch
  // 0.5: updated start

  const version: string = "0.5"
  import { onMount } from "svelte";
  
  let state: string = "start";
  let disable_opener_button = false;

  const get_state = async () => {
    const response = await fetch('/api/sonoff');
    const json_data = await response.json();
  // console.log(json_data);
    if (json_data.status)  state = json_data.state;
  }

  const pulse_door_opener = async () => {
    const respone = await fetch('api/sonoff',  {method: 'POST', body: JSON.stringify({action: "pulse-door-opener"})});
    const status = await respone.json();
    disable_opener_button = true;
    setTimeout(() => disable_opener_button = false, 1500);
  }

  onMount(async () => {
    get_state();
    setInterval(get_state, 1000);
  })

</script>

<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4 justify-center">
  <div class="md:flex">
    <div class="md:shrink-0 flex flex-col items-center justify-center space-y-4">
      <div>
        <img class="h-full w-full object-cover md:h-full md:w-48 { state === "moving" ? 'animate-bounce' : ''}" 
        src="{ state === "opened" ? 'garage-opened.png' : 
               state === "closed" ? 'garage-closed.png' : 
               state === "start" ? 'garage-patience.png' : 
               state === "moving" ?'garage-moving.png' : 'garage-error.png' }" alt="Garagedeur" />
      </div>
      <div>
        <button on:click={pulse_door_opener} disabled={disable_opener_button} class="{disable_opener_button ? "bg-red-500" : "bg-blue-500 hover:bg-blue-700" }  text-white font-bold py-2 px-4 rounded">OPEN/DICHT</button>
      </div>
    </div>
  </div>
  <p class="text-center text-xs">@ 2023 MB V{version}</p>
</div>

