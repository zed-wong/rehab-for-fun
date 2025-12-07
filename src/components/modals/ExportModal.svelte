<script>
  import { fade, fly } from "svelte/transition";
  import { patients, schedule, showToast } from "../../lib/store";
  import { _ } from "svelte-i18n";

  export let isOpen = false;
  export let onClose = () => {};

  const handleExport = (exportType) => {
    try {
      let data;
      if (exportType === "full") {
        data = JSON.stringify(
          {
            patients: $patients,
            schedule: $schedule,
            version: 1,
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        );
      } else if (exportType === "patients") {
        data = JSON.stringify($patients, null, 2);
      } else {
        throw new Error("Invalid export type");
      }

      navigator.clipboard.writeText(data);
      if (exportType === "full") {
        showToast($_("modal.export.copy_full_success"), "success");
      } else {
        showToast($_("modal.export.copy_patients_success"), "success");
      }
      onClose();
    } catch (err) {
      showToast($_("modal.export.export_failed"), "error");
    }
  };

  $: types = [
    {
      label: $_("modal.export.full_backup"),
      value: "full",
      desc: $_("modal.export.full_backup_sub"),
    },
    { label: $_("modal.export.only_patients"), value: "patients" },
  ];
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    on:click|self={onClose}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-base-100 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      in:fly={{ y: 20, duration: 300 }}
    >
      <div class="card-body">
        <h2 class="card-title text-lg font-bold">{$_("modal.export.title")}</h2>
        <p class="text-sm text-base-content/70">
          {$_("modal.export.desc")}
        </p>

        <div class="flex flex-col gap-3 mt-2">
          <button
            class="btn btn-primary w-full shadow-lg shadow-primary/20"
            on:click={() => handleExport(types[0].value)}
          >
            <div class="flex flex-col items-center gap-0.5">
              <span>{types[0].label}</span>
              <span class="text-[10px] opacity-70 font-normal"
                >{types[0].desc}</span
              >
            </div>
          </button>

          <button
            class="btn btn-outline w-full"
            on:click={() => handleExport(types[1].value)}
          >
            {types[1].label}
          </button>
        </div>
      </div>

      <div class="bg-base-50 p-3 flex justify-center border-t border-base-200">
        <button class="btn btn-ghost btn-sm" on:click={onClose}
          >{$_("modal.common.cancel")}</button
        >
      </div>
    </div>
  </div>
{/if}
