<script>
  import { clearSlot, currentDate } from "../../lib/store";
  import { fade, fly } from "svelte/transition";

  export let isOpen = false;
  /**
   * @typedef {Object} Patient
   * @property {string} name
   * @property {string} type
   * @property {string} color
   */

  /**
   * @typedef {Object} Slot
   * @property {number} duration
   */

  /**
   * @typedef {Object} SlotData
   * @property {string} time
   * @property {Slot} slot
   * @property {Patient} [patient]
   */

  /** @type {SlotData | null} */
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
    on:keydown={(e) => e.key === "Escape" && onClose()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Content -->
    <div
      class="bg-base-100 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      in:fly={{ y: 20, duration: 300 }}
      role="document"
      tabindex="-1"
    >
      <!-- Header Color Strip -->
      <div class="h-2 w-full {slotData.patient?.color || 'bg-base-300'}"></div>

      <div class="p-6 space-y-4">
        <!-- Title -->
        <div>
          <h3 class="text-xl font-bold">{slotData.patient?.name}</h3>
          <p class="text-base-content/60 font-medium">
            {slotData.patient?.type || "无详情"}
          </p>
        </div>

        <!-- Info Badge -->
        <div class="flex items-center gap-2">
          <div class="badge badge-lg badge-ghost gap-2 pl-1.5">
            {@html ClockIcon}
            <span class="font-mono">{slotData.time}</span>
            <span>•</span>
            <span>{slotData.slot.duration} 分钟</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3 pt-2">
          <button
            class="btn btn-error btn-outline w-full"
            on:click={handleDelete}
          >
            删除预约
          </button>
          <button class="btn btn-ghost w-full" on:click={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
