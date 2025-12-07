<script>
  import { patients, schedule } from "../../lib/store";
  import { fade, fly } from "svelte/transition";

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
    out:fade={{ duration: 150 }}
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-base-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]"
      in:fly={{ y: 20, duration: 300 }}
      out:fly={{ y: 20, duration: 200 }}
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
              aria-label="返回列表"
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
            <h2 class="text-lg font-bold">患者统计: {selectedPatient.name}</h2>
          {:else}
            <h2 class="text-lg font-bold">患者统计</h2>
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
              placeholder="搜索姓名..."
              bind:value={searchQuery}
              class="input input-sm input-bordered w-full rounded-lg"
            />
          </div>

          <div class="overflow-y-auto p-2 space-y-1">
            {#if filteredPatients.length === 0}
              <div class="text-center text-base-content/50 py-10">
                未找到患者
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
                    {p.type || "无诊断"}
                  </div>
                </div>
                <div class="text-xs text-base-content/40">查看详情 ›</div>
              </button>
            {/each}
          </div>
        {:else}
          <!-- Detail View -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="stats shadow bg-base-200/50">
                <div class="stat place-items-center">
                  <div class="stat-title">总计就诊</div>
                  <div class="stat-value text-primary">{stats.count}</div>
                  <div class="stat-desc">次</div>
                </div>
              </div>
              <div class="stats shadow bg-base-200/50">
                <div class="stat place-items-center">
                  <div class="stat-title">最近就诊</div>
                  <div class="stat-value text-xs mt-2">
                    {stats.history.length > 0 ? stats.history[0].date : "暂无"}
                  </div>
                </div>
              </div>
            </div>

            <h3 class="font-bold mb-4 px-1">就诊记录 ({stats.count})</h3>

            {#if stats.history.length === 0}
              <div
                class="text-center text-base-content/50 py-10 rounded-xl bg-base-100 border border-dashed border-base-300"
              >
                暂无就诊记录
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
                        时长: {item.duration} 分钟
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
