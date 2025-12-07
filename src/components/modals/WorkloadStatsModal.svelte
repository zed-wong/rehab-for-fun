<script>
  import { schedule, patients, currentDate } from "../../lib/store";
  import { fade, fly } from "svelte/transition";
  import { _ } from "svelte-i18n";

  export let isOpen = false;
  export let onClose = () => {};

  // Form inputs
  let startDate = new Date().toISOString().split("T")[0];
  let endDate = new Date().toISOString().split("T")[0];

  // Stats
  let totalIncome = 0;
  let totalVisits = 0;
  let breakdown = []; // { patientName, count, income }

  const calculate = () => {
    totalIncome = 0;
    totalVisits = 0;
    breakdown = [];

    // Map patient ID to pricing
    const patientMap = new Map($patients.map((p) => [p.id, p]));
    const accum = {}; // { patientId: { count: 0, income: 0 } }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Inclusive range check
    // Loop through schedule dates
    Object.entries($schedule).forEach(([dateStr, daySchedule]) => {
      const d = new Date(dateStr);
      // Need to normalize time parts for accurate comparison?
      // Date string 'YYYY-MM-DD' parses to UTC usually, but local time is tricky.
      // Let's rely on string comparison if format is ISO YYYY-MM-DD

      if (dateStr >= startDate && dateStr <= endDate) {
        Object.values(daySchedule).forEach((slot) => {
          if (slot.isHead) {
            const pid = slot.patientId;
            const p = patientMap.get(pid);
            // If patient deleted, we might not find them. Use defaults.
            // Or maybe we should keep historical data snapshotted?
            // For now, use current patient data.
            const price = p ? Number(p.price) || 0 : 0;

            if (!accum[pid])
              accum[pid] = {
                count: 0,
                income: 0,
                name: p ? p.name : "Unknown",
              };
            accum[pid].count += 1;
            accum[pid].income += price;

            totalIncome += price;
            totalVisits += 1;
          }
        });
      }
    });

    // Convert accum to map
    breakdown = Object.values(accum).sort((a, b) => b.income - a.income);
  };

  // Re-calculate when open or dates change
  $: if (isOpen && $currentDate) {
    endDate = $currentDate;
    const [y, m, d] = $currentDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setMonth(date.getMonth() - 1);
    startDate = date.toLocaleDateString("en-CA");
    calculate();
  }

  $: if (startDate || endDate) {
    if (isOpen) calculate();
  }
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
      class="bg-base-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      in:fly={{ y: 20, duration: 300 }}
    >
      <div
        class="px-5 py-4 border-b border-base-200 flex items-center justify-between bg-base-100 z-10"
      >
        <h2 class="text-lg font-bold">{$_("modal.workload_stats.title")}</h2>
        <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}
          >✕</button
        >
      </div>

      <div class="p-4 bg-base-50 border-b border-base-200">
        <!-- Date Range Filter -->
        <div
          class="flex gap-4 items-end bg-base-100 p-4 rounded-xl shadow-sm border border-base-200"
        >
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text"
                >{$_("modal.workload_stats.start_date")}</span
              >
            </label>
            <input
              type="date"
              bind:value={startDate}
              class="input input-bordered w-full"
            />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text"
                >{$_("modal.workload_stats.end_date")}</span
              >
            </label>
            <input
              type="date"
              bind:value={endDate}
              class="input input-bordered w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="px-6 py-4 bg-primary text-primary-content text-center">
          <h2 class="text-2xl font-bold mb-1">
            {$_("modal.workload_stats.title")}
          </h2>
          <p class="text-primary-content/80 text-sm">
            {$_("modal.workload_stats.subtitle")}
          </p>
        </div>
        <div class="stats shadow w-full mb-6 bg-primary text-primary-content">
          <div class="stat">
            <div class="stat-title text-primary-content/80">
              {$_("modal.workload_stats.total_income")}
            </div>
            <div class="stat-value">¥{totalIncome}</div>
            <div class="stat-desc text-primary-content/70">
              {$_("modal.workload_stats.total_visits", {
                values: { count: totalVisits },
              })}
            </div>
          </div>
        </div>

        <h3 class="font-bold text-sm text-base-content/70 mb-3 px-1">
          {$_("modal.workload_stats.income_breakdown")}
        </h3>
        {#if breakdown.length === 0}
          <div
            class="text-center py-8 text-base-content/40 border border-dashed rounded-xl"
          >
            {$_("modal.workload_stats.no_records_period")}
          </div>
        {:else}
          <div class="space-y-2">
            {#each breakdown as item}
              <div
                class="flex items-center justify-between p-3 rounded-xl bg-base-100 border border-base-200 shadow-sm"
              >
                <div class="flex flex-col">
                  <span class="font-medium text-base-content">{item.name}</span>
                  <span class="text-xs text-base-content/50"
                    >{$_("modal.workload_stats.count_unit", {
                      values: { count: item.count },
                    })}</span
                  >
                </div>
                <div class="font-bold text-lg">
                  ¥{item.income}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
