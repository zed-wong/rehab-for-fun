<script>
  import { clearSlot, currentDate } from "../../lib/store";

  export let isOpen = false;
  export let slotData = null; // { time, slot, patient }
  export let onClose = () => {};

  const handleDelete = () => {
    if (slotData) {
      clearSlot($currentDate, slotData.time);
      onClose();
    }
  };

  const ClockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mb-0.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
</script>

{#if isOpen && slotData}
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
    on:click|self={onClose}
  >
    <!-- Content (Action Sheet style on mobile) -->
    <div
      class="w-full sm:max-w-sm bg-base-100 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
      on:click|stopPropagation
    >
      <!-- Header Color Strip -->
      <div class="h-2 w-full {slotData.patient?.color || 'bg-base-300'}"></div>

      <div class="p-6 space-y-4">
        <!-- Title -->
        <div>
          <h3 class="text-xl font-bold">{slotData.patient?.name}</h3>
          <p class="text-base-content/60 font-medium">
            {slotData.patient?.type || "No details"}
          </p>
        </div>

        <!-- Info Badge -->
        <div class="flex items-center gap-2">
          <div class="badge badge-lg badge-ghost gap-2 pl-1.5">
            {@html ClockIcon}
            <span class="font-mono">{slotData.time}</span>
            <span>•</span>
            <span>{slotData.slot.duration} min</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3 pt-2">
          <button
            class="btn btn-error btn-outline w-full"
            on:click={handleDelete}
          >
            Remove from Schedule
          </button>
          <button class="btn btn-ghost w-full" on:click={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
