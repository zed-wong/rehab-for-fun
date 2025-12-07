<script>
  export let isOpen = false;
  export let onClose = () => {};
  import { _ } from "svelte-i18n";
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
    role="button"
    tabindex="0"
  >
    <div
      class="card w-full max-w-lg bg-base-100 shadow-xl max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
      role="dialog"
    >
      <div class="card-body p-0">
        <div
          class="px-6 py-4 bg-primary text-primary-content text-center relative"
        >
          <h2 class="text-2xl font-bold mb-1">
            {$_("modal.onboarding.title")}
          </h2>
          <p class="text-primary-content/80 text-sm">
            {$_("modal.onboarding.intro")}
          </p>
          <button
            class="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-primary-content"
            on:click={onClose}
          >
            ✕
          </button>
        </div>

        <div class="space-y-5 p-6">
          <!-- 1. Patient Management -->
          <div class="flex gap-4">
            <div
              class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center shrink-0 text-xl"
            >
              👥
            </div>
            <div>
              <h3 class="font-bold text-lg">
                {$_("modal.onboarding.step_1_title")}
              </h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                {@html $_("modal.onboarding.step_1_desc")}
              </p>
            </div>
          </div>

          <!-- 2. Scheduling -->
          <div class="flex gap-4">
            <div
              class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center shrink-0 text-xl"
            >
              📅
            </div>
            <div>
              <h3 class="font-bold text-lg">
                {$_("modal.onboarding.step_2_title")}
              </h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                {@html $_("modal.onboarding.step_2_desc")}
              </p>
            </div>
          </div>

          <!-- 3. Stats -->
          <div class="flex gap-4">
            <div
              class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center shrink-0 text-xl"
            >
              📊
            </div>
            <div>
              <h3 class="font-bold text-lg">
                {$_("modal.onboarding.step_3_title")}
              </h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                {@html $_("modal.onboarding.step_3_desc")}
              </p>
            </div>
          </div>

          <!-- 4. Backup & Settings -->
          <div class="flex gap-4">
            <div
              class="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center shrink-0 text-xl"
            >
              ⚙️
            </div>
            <div>
              <h3 class="font-bold text-lg">
                {$_("modal.onboarding.step_4_title")}
              </h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                {@html $_("modal.onboarding.step_4_desc")}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 pt-0 mt-4">
          <button class="btn btn-primary w-full shadow-lg" on:click={onClose}
            >{$_("modal.onboarding.start_btn")}</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
