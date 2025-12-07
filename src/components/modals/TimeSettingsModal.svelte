<script>
  import { scheduleSettings, showToast } from "../../lib/store";
  import { createEventDispatcher } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { _ } from "svelte-i18n";

  export let isOpen = false;
  export let onClose = () => {};

  let startHour = 7;
  let endHour = 20;
  let timeStep = 30;

  // Subscribe to store to set initial values
  $: if (isOpen) {
    startHour = $scheduleSettings.startHour;
    endHour = $scheduleSettings.endHour;
    timeStep = $scheduleSettings.timeStep;
  }

  const handleSave = () => {
    if (startHour >= endHour) {
      showToast($_("modal.time_settings.error_start_end"), "error");
      return;
    }
    if (timeStep < 5) {
      showToast($_("modal.time_settings.error_step"), "error");
      return;
    }

    scheduleSettings.set({
      startHour,
      endHour,
      timeStep,
    });

    showToast($_("modal.time_settings.success_updated"), "success");
    onClose();
  };
</script>

{#if isOpen}
  <div class="modal modal-open z-[60]">
    <div
      class="modal-box bg-base-100 p-0 overflow-hidden max-w-sm"
      in:scale={{ duration: 200, start: 0.95 }}
    >
      <!-- Header -->
      <div
        class="px-6 py-4 bg-base-200/50 border-b border-base-200 flex justify-between items-center"
      >
        <h3 class="font-bold text-lg">{$_("modal.time_settings.title")}</h3>
        <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}>
          ✕
        </button>
      </div>

      <div class="p-6 space-y-4">
        <!-- Start Time -->
        <div class="form-control w-full">
          <label class="label" for="start-hour">
            <span class="label-text"
              >{$_("modal.time_settings.start_time")}</span
            >
          </label>
          <input
            id="start-hour"
            type="number"
            bind:value={startHour}
            min="0"
            max="23"
            class="input input-bordered w-full"
          />
        </div>

        <!-- End Time -->
        <div class="form-control w-full">
          <label class="label" for="end-hour">
            <span class="label-text">{$_("modal.time_settings.end_time")}</span>
          </label>
          <input
            id="end-hour"
            type="number"
            bind:value={endHour}
            min="1"
            max="24"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Time Step -->
        <div class="form-control w-full">
          <label class="label" for="time-step">
            <span class="label-text">{$_("modal.time_settings.time_step")}</span
            >
          </label>
          <select
            id="time-step"
            bind:value={timeStep}
            class="select select-bordered w-full"
          >
            <option value={10}
              >{$_("common.full_mins", { values: { m: 10 } })}</option
            >
            <option value={15}
              >{$_("common.full_mins", { values: { m: 15 } })}</option
            >
            <option value={20}
              >{$_("common.full_mins", { values: { m: 20 } })}</option
            >
            <option value={30}
              >{$_("common.full_mins", { values: { m: 30 } })}</option
            >
            <option value={45}
              >{$_("common.full_mins", { values: { m: 45 } })}</option
            >
            <option value={60}
              >{$_("common.full_mins", { values: { m: 60 } })}</option
            >
          </select>
        </div>

        <div class="text-xs text-base-content/60 mt-2">
          {$_("modal.time_settings.warning")}
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-action bg-base-200/50 px-6 py-4 m-0">
        <button class="btn btn-ghost" on:click={onClose}
          >{$_("modal.common.cancel")}</button
        >
        <button class="btn btn-primary" on:click={handleSave}
          >{$_("modal.time_settings.save_changes")}</button
        >
      </div>
    </div>
    <div class="modal-backdrop bg-black/50" on:click={onClose} in:fade></div>
  </div>
{/if}
