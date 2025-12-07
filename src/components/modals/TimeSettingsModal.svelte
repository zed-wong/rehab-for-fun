<script>
  import { scheduleSettings, showToast } from "../../lib/store";
  import { createEventDispatcher } from "svelte";
  import { fade, scale } from "svelte/transition";

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
      showToast("开始时间必须早于结束时间", "error");
      return;
    }
    if (timeStep < 5) {
      showToast("时间间隔不能小于5分钟", "error");
      return;
    }

    scheduleSettings.set({
      startHour,
      endHour,
      timeStep,
    });

    showToast("设置已更新", "success");
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
        <h3 class="font-bold text-lg">时间设置</h3>
        <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}>
          ✕
        </button>
      </div>

      <div class="p-6 space-y-4">
        <!-- Start Time -->
        <div class="form-control w-full">
          <label class="label" for="start-hour">
            <span class="label-text">开始时间 (小时)</span>
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
            <span class="label-text">结束时间 (小时)</span>
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
            <span class="label-text">时间间隔 (分钟)</span>
          </label>
          <select
            id="time-step"
            bind:value={timeStep}
            class="select select-bordered w-full"
          >
            <option value={10}>10 分钟</option>
            <option value={15}>15 分钟</option>
            <option value={20}>20 分钟</option>
            <option value={30}>30 分钟</option>
            <option value={45}>45 分钟</option>
            <option value={60}>60 分钟</option>
          </select>
        </div>

        <div class="text-xs text-base-content/60 mt-2">
          注意：更改时间设置不影响已有数据的存储，但可能导致已有预约在显示时位置错乱或无法对齐。建议在清空安排后修改。
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-action bg-base-200/50 px-6 py-4 m-0">
        <button class="btn btn-ghost" on:click={onClose}>取消</button>
        <button class="btn btn-primary" on:click={handleSave}>保存更改</button>
      </div>
    </div>
    <div class="modal-backdrop bg-black/50" on:click={onClose} in:fade></div>
  </div>
{/if}
