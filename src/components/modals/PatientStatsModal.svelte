<script>
  import { patients, schedule } from "../../lib/store";
  import { fade, fly } from "svelte/transition";
  import { _ } from "svelte-i18n";

  export let isOpen = false;
  export let onClose = () => {};

  let searchQuery = "";
  let selectedPatient = null;

  // Derived stats
  $: stats = calculateStats(selectedPatient, $schedule);

  $: filteredPatients = $patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.type && p.type.toLowerCase().includes(q))
    );
  });

  function calculateStats(patient, scheduleData) {
    if (!patient) return null;

    let visits = [];

    // Iterate over all dates in schedule
    Object.entries(scheduleData).forEach(([date, daySchedule]) => {
      // Iterate over all time slots in a day
      Object.entries(daySchedule).forEach(([time, slot]) => {
        if (slot.patientId === patient.id && slot.isHead) {
          visits.push({
            date: date,
            time: time,
            duration: slot.duration || 30, // Fallback if not stored
          });
        }
      });
    });

    // Sort newer first
    visits.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      count: visits.length,
      history: visits,
    };
  }

  const handleSelect = (p) => {
    selectedPatient = p;
  };

  const handleBack = () => {
    selectedPatient = null;
  };
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-base-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
      in:fly={{ y: 20, duration: 300 }}
    >
      <!-- Header -->
      <div
        class="px-5 py-4 border-b border-base-200 flex items-center justify-between bg-base-100 z-10"
      >
        <div class="flex items-center gap-2">
          {#if selectedPatient}
            <button
              class="btn btn-sm btn-circle btn-ghost"
              on:click={handleBack}
              aria-label={$_("modal.patient_stats.back_to_list")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
              >
            </button>
            <div class="px-6 py-4 bg-primary text-primary-content text-center">
              <h2 class="text-2xl font-bold mb-1">
                {$_("modal.patient_stats.title", {
                  values: { name: selectedPatient.name },
                })}
              </h2>
              <p class="text-primary-content/80 text-sm">
                {$_("modal.patient_stats.subtitle")}
              </p>
            </div>
          {:else}
            <h2 class="text-lg font-bold">
              {$_("modal.patient_stats.title_general")}
            </h2>
          {/if}
        </div>
        <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}
          >✕</button
        >
      </div>

      <div class="flex-1 overflow-hidden flex flex-col">
        {#if !selectedPatient}
          <!-- Patient List View -->
          <div class="p-3 border-b border-base-200 bg-base-50/50">
            <input
              type="text"
              placeholder={$_("modal.patient_stats.search_placeholder")}
              bind:value={searchQuery}
              class="input input-sm input-bordered w-full rounded-lg"
            />
          </div>

          <div class="overflow-y-auto p-2 space-y-1">
            {#if filteredPatients.length === 0}
              <div class="text-center text-base-content/50 py-10">
                {$_("modal.patient_stats.not_found")}
              </div>
            {/if}
            {#each filteredPatients as p (p.id)}
              <button
                class="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                on:click={() => handleSelect(p)}
              >
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 {p.color} bg-opacity-20 text-xs font-bold"
                >
                  {p.name.charAt(0)}
                </div>
                <div class="flex-1">
                  <div class="font-medium">{p.name}</div>
                  <div class="text-xs text-base-content/60">
                    {p.type || $_("modal.patient_list.no_diagnosis")}
                  </div>
                </div>
                <div class="text-xs text-base-content/40">
                  {$_("modal.patient_stats.view_details")}
                </div>
              </button>
            {/each}
          </div>
        {:else}
          <!-- Detail View -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Summary Cards -->

            <h3 class="font-bold mb-4 px-1">
              {$_("modal.patient_stats.visits_title", {
                values: { count: stats.count },
              })}
            </h3>

            {#if stats.history.length === 0}
              <div
                class="text-center text-base-content/50 py-10 rounded-xl bg-base-100 border border-dashed border-base-300"
              >
                {$_("modal.patient_stats.no_records")}
              </div>
            {:else}
              <div
                class="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-base-300 before:to-transparent"
              >
                {#each stats.history as item}
                  <div
                    class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div
                      class="flex items-center justify-center w-10 h-10 rounded-full border border-base-300 bg-base-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-primary"
                        ><rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        /><line x1="16" x2="16" y1="2" y2="6" /><line
                          x1="8"
                          x2="8"
                          y1="2"
                          y2="6"
                        /><line x1="3" x2="21" y1="10" y2="10" /></svg
                      >
                    </div>
                    <div
                      class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-base-200 bg-base-100 shadow-sm"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-center justify-between mb-1"
                      >
                        <time class="font-bold text-sm text-base-content"
                          >{item.date}</time
                        >
                        <time class="text-xs text-base-content/60 font-mono"
                          >{item.time}</time
                        >
                      </div>
                      <div class="text-xs text-base-content/70">
                        {$_("modal.patient_stats.duration", {
                          values: { duration: item.duration },
                        })}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
