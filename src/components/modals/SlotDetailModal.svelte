<script>
  import { clearSlot, currentDate } from "../../lib/store";
  import { _ } from "svelte-i18n";
  import { fade, fly } from "svelte/transition";

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
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    on:click|self={onClose}
    role="dialog"
    aria-modal="true"
  >
    <!-- Content -->
    <div
      class="bg-base-100 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      in:fly={{ y: 20, duration: 300 }}
      on:click|stopPropagation
    >
      <!-- Header Color Strip -->
      <div class="h-2 w-full {slotData.patient?.color || 'bg-base-300'}"></div>

      <div class="p-6 space-y-4">
        <!-- Title -->
        <div class="card-body">
          <h2 class="card-title text-lg font-bold">
            {slotData.patient?.name || $_("modal.slot_detail.no_details")}
          </h2>
          <p class="text-base-content/60 font-medium">
            {slotData.patient?.type || $_("modal.slot_detail.no_details")}
          </p>
        </div>

        <!-- Info Badge -->
        <div class="flex items-center gap-2">
          <div class="badge badge-lg badge-ghost gap-2 pl-1.5">
            {@html ClockIcon}
            <span class="font-mono">{slotData.time}</span>
            <span>•</span>
            <span
              >{$_("common.full_mins", {
                values: { m: slotData.slot.duration },
              })}</span
            >
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions justify-end mt-4">
          <button class="btn btn-error btn-sm" on:click={handleDelete}>
            {$_("modal.slot_detail.delete_appointment")}
          </button>
          <button class="btn btn-ghost btn-sm" on:click={onClose}>
            {$_("modal.common.close")}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
