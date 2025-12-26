<script>
  import { fade, fly } from "svelte/transition";
  import {
    patients,
    archivedPatients,
    schedule,
    showToast,
  } from "../../lib/store";

  export let isOpen = false;
  export let onClose = () => {};

  const handleExportAll = () => {
    try {
      const data = JSON.stringify(
        {
          patients: $patients,
          archivedPatients: $archivedPatients,
          schedule: $schedule,
          version: 1,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      );
      navigator.clipboard.writeText(data);
      showToast("已复制完整数据(含历史记录)到剪贴板，请粘贴保存", "success");
      onClose();
    } catch (e) {
      showToast("导出失败", "error");
    }
  };

  const handleExportPatients = () => {
    try {
      const data = JSON.stringify($patients, null, 2);
      navigator.clipboard.writeText(data);
      showToast("已复制患者名单到剪贴板，请粘贴保存", "success");
      onClose();
    } catch (e) {
      showToast("导出失败", "error");
    }
  };
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="bg-base-100 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      in:fly={{ y: 20, duration: 300 }}
    >
      <div class="p-6 text-center">
        <h3 class="text-lg font-bold">导出数据</h3>
        <p class="py-4 text-base-content/70 text-sm">
          请选择导出内容。完整备份包含患者名单和所有排班记录。
        </p>

        <div class="flex flex-col gap-3 mt-2">
          <button
            class="btn btn-primary w-full shadow-lg shadow-primary/20"
            on:click={handleExportAll}
          >
            <div class="flex flex-col items-center gap-0.5">
              <span>导出完整备份</span>
              <span class="text-[10px] opacity-70 font-normal"
                >患者名单 + 归档数据 + 历史记录</span
              >
            </div>
          </button>

          <button
            class="btn btn-outline w-full"
            on:click={handleExportPatients}
          >
            仅导出患者名单
          </button>
        </div>
      </div>

      <div class="bg-base-50 p-3 flex justify-center border-t border-base-200">
        <button class="btn btn-ghost btn-sm" on:click={onClose}>取消</button>
      </div>
    </div>
  </div>
{/if}
