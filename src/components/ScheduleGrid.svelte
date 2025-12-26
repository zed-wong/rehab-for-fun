<script>
  import {
    schedule,
    currentDate,
    patients,
    archivedPatients,
    selectedPatientId,
    paintSlot,
    scheduleSettings,
  } from "../lib/store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Generate slots based on settings
  let timeSlots = [];
  $: {
    const { startHour, endHour, timeStep } = $scheduleSettings;
    timeSlots = [];
    let currentMins = startHour * 60;
    const endMins = endHour * 60;

    while (currentMins <= endMins) {
      const h = Math.floor(currentMins / 60);
      const m = currentMins % 60;
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      timeSlots.push(timeStr);
      currentMins += timeStep;
    }
  }

  $: daySchedule = $schedule[$currentDate] || {};
  $: currentPatient = $patients.find((p) => p.id === $selectedPatientId);

  // Look for patient in both active and archived lists
  const getPatient = (id) => {
    const active = $patients.find((p) => p.id === id);
    if (active) return active;
    return $archivedPatients.find((p) => p.id === id);
  };

  const handleSlotClick = (time, slot) => {
    if (slot) {
      dispatch("openDetail", {
        time,
        slot,
        patient: getPatient(slot.patientId),
      });
    } else {
      // If a patient is selected, assign it. Otherwise, open selection modal.
      if ($selectedPatientId) {
        paintSlot(time);
      } else {
        dispatch("openPatientSelect", { time });
      }
    }
  };
</script>

<div class="p-4 pb-24 space-y-1 select-none">
  {#each timeSlots as time}
    {@const slot = daySchedule[time]}
    {@const patient = slot ? getPatient(slot.patientId) : null}
    {@const isHour = time.endsWith(":00")}

    <div class="flex items-start h-14 group">
      <!-- Time Label -->
      <div class="w-12 pt-4 pr-3 text-right shrink-0">
        <span
          class="font-mono text-xs {isHour
            ? 'font-bold text-base-content/80'
            : 'text-base-content/40'}"
        >
          {time}
        </span>
      </div>

      <!-- Slot Area -->
      <div class="flex-1 h-full relative">
        {#if slot}
          <!-- Filled Slot -->
          <button
            class="w-full rounded-md shadow-sm border border-transparent transition-all text-left overflow-hidden bg-base-200 active:scale-[0.98]
                    {slot.duration === 60 && slot.isHead
              ? 'absolute top-0 left-0 z-20 h-[calc(200%+0.25rem)]'
              : 'h-full relative'}
                    {slot.duration === 60 && !slot.isHead ? 'hidden' : ''}"
            on:click={() => handleSlotClick(time, slot)}
          >
            <!-- Color Strip -->
            <div
              class="absolute inset-y-0 left-0 w-1.5 {patient?.color ||
                'bg-gray-400'}"
            ></div>

            <div
              class="pl-3 pr-2 py-2 h-full flex items-center justify-between"
            >
              {#if slot.isHead || slot.duration !== 60}
                <div
                  class="flex flex-col justify-center animate-in fade-in duration-300"
                >
                  <span
                    class="font-bold text-sm text-base-content leading-tight"
                  >
                    {patient?.name || "未知"}
                  </span>
                  {#if patient?.type}
                    <span
                      class="text-[10px] text-base-content/60 truncate max-w-[150px]"
                    >
                      {patient.type}
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </button>
        {:else}
          <!-- Empty Slot with Ghost Preview -->
          <button
            class="w-full h-full rounded-md border border-base-200 border-dashed transition-all flex items-center justify-center relative overflow-hidden group/btn"
            on:click={() => handleSlotClick(time, null)}
            aria-label="分配给 {time}"
          >
            <!-- Default state: faint line -->
            <div
              class="w-full h-px bg-base-300 group-hover/btn:opacity-0 transition-opacity"
            ></div>

            <!-- Ghost Preview (Only if patient selected) -->
            {#if currentPatient}
              <div
                class="absolute inset-0 opacity-0 group-hover/btn:opacity-20 {currentPatient.color} transition-opacity flex items-center pl-3"
              >
                <span
                  class="text-xs font-bold text-base-content opacity-50 ml-2"
                  >{currentPatient.name}</span
                >
              </div>
            {:else}
              <div
                class="absolute inset-0 bg-base-200 opacity-0 group-hover/btn:opacity-50 transition-opacity"
              ></div>
            {/if}
          </button>

          <!-- Background Guide Line -->
          <div
            class="absolute inset-x-0 bottom-0 border-b border-base-100 pointer-events-none"
          ></div>
        {/if}
      </div>
    </div>
  {/each}
</div>
