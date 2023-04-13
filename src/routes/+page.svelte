<script lang="ts">
  // 0.1: started from kelder-grondwater 0.6

  const version: string = "0.1"
  import { onMount } from "svelte";
  
  let switch_opened = false;
  let switch_closed = false;
  let disable_opener_button = false;

  const get_switches = async () => {
    const response = await fetch('/api/sonoff');
    const json_data = await response.json();
    console.log(json_data);
    if (json_data.status)  ({switch_opened, switch_closed } = json_data.switches);
    console.log("switch_opened, switch_closed", switch_opened, switch_closed);
  }

  const pulse_door_opener = async () => {
    const respone = await fetch('api/sonoff',  {method: 'POST', body: JSON.stringify({action: "pulse-door-opener"})});
    const status = await respone.json();
    disable_opener_button = true;
    setTimeout(() => disable_opener_button = false, 1500);
  }

  onMount(async () => {
    setInterval(get_switches, 1000);
  })

</script>

<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4 justify-center">
  <div class="md:flex">
    <div class="md:shrink-0 flex flex-col items-center justify-center space-y-4">
      <div>
        <img class="h-full w-full object-cover md:h-full md:w-48 { !switch_opened && !switch_closed ? 'animate-bounce' : ''}" src="{ switch_opened ? 'garage-opened.png' : switch_closed ? 'garage-closed.png' : 'garage-moving.png' }" alt="Garagedeur" />
      </div>
      <div>
        <button on:click={pulse_door_opener} disabled={disable_opener_button} class="{disable_opener_button ? "bg-red-500" : "bg-blue-500 hover:bg-blue-700" }  text-white font-bold py-2 px-4 rounded">AAN/UIT</button>
      </div>
    </div>
  </div>
  <p class="text-center text-xs">@ 2023 MB V{version}</p>
</div>

