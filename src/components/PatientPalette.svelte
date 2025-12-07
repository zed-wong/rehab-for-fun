<script>
  import { patients, selectedPatientId, selectedDuration } from "../lib/store";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  const PlusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
  const EditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;

  const selectPatient = (id) => {
    if ($selectedPatientId === id) {
      selectedPatientId.set(null);
    } else {
      selectedPatientId.set(id);
      // Set initial duration based on patient default
      const p = $patients.find((x) => x.id === id);
      if (p) selectedDuration.set(p.duration || 30);
    }
  };

  const toggleDuration = (e) => {
    e.stopPropagation();
    selectedDuration.update((d) => (d === 60 ? 30 : 60));
  };

  const editPatient = (p, e) => {
    e.stopPropagation();
    // Dispatch an event to open edit modal (reusing add modal logic or new one)
    // For now we will just use the same form but need to populate it.
    // Simplifying: we'll dispatch 'editPatient' with the patient obj
    dispatch("editPatient", p);
  };
</script>

<div
  class="sticky top-[3.5rem] z-40 bg-base-100/95 backdrop-blur border-b border-base-200"
>
  <div
    class="flex items-center gap-2 overflow-x-auto p-3 no-scrollbar snap-x ml-2"
  >
    <!-- Add Button -->
    <button
      class="btn btn-sm btn-circle btn-ghost border border-base-200 text-base-content/70 hover:bg-base-200 shrink-0 snap-start"
      on:click={() => dispatch("openAddModal")}
      aria-label="添加患者"
      title="添加患者"
    >
      {@html PlusIcon}
    </button>

    <!-- List View Button (For many patients) -->
    <button
      class="btn btn-sm btn-circle btn-ghost border border-base-200 text-base-content/70 hover:bg-base-200 shrink-0 snap-start"
      on:click={() => dispatch("openShowAll")}
      aria-label="查看所有"
      title="搜索 / 查看所有"
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
        ><line x1="8" y1="6" x2="21" y2="6" /><line
          x1="8"
          y1="12"
          x2="21"
          y2="12"
        /><line x1="8" y1="18" x2="21" y2="18" /><line
          x1="3"
          y1="6"
          x2="3.01"
          y2="6"
        /><line x1="3" y1="12" x2="3.01" y2="12" /><line
          x1="3"
          y1="18"
          x2="3.01"
          y2="18"
        /></svg
      >
    </button>

    <!-- Patient Chips -->
    {#each $patients as p (p.id)}
      <button
        class="btn btn-sm rounded-full shrink-0 gap-2 normal-case font-normal transition-all snap-start group relative pr-8
          {$selectedPatientId === p.id
          ? `btn-primary shadow-md`
          : `btn-outline border-base-200 text-base-content hover:bg-base-200 hover:border-base-300`}"
        on:click={() => selectPatient(p.id)}
      >
        <!-- Color Dot -->
        {#if $selectedPatientId !== p.id}
          <div class="w-2 h-2 rounded-full {p.color}"></div>
        {/if}

        <span>{p.name}</span>

        <!-- Duration Badge -->
        {#if $selectedPatientId === p.id}
          <div
            role="button"
            tabindex="0"
            class="badge badge-sm border-0 text-[10px] h-5 px-1 min-w-[2rem] justify-center cursor-pointer bg-white/20 hover:bg-white/30 transition-colors"
            on:click={toggleDuration}
            on:keydown={(e) => e.key === "Enter" && toggleDuration(e)}
            title="切换时长"
          >
            {$selectedDuration === 60 ? "1小时" : "30分"}
          </div>
        {:else}
          <span
            class="badge badge-sm badge-ghost bg-opacity-20 border-0 text-[10px] h-5 px-1 min-w-[2rem] justify-center"
          >
            {p.duration === 60 ? "1小时" : "30分"}
          </span>
        {/if}

        <!-- Edit Button (Visible on Hover or Active) -->
        <div
          role="button"
          tabindex="0"
          class="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
          on:click={(e) => editPatient(p, e)}
          on:keydown={(e) => e.key === "Enter" && editPatient(p, e)}
          aria-label="编辑 {p.name}"
        >
          {@html EditIcon}
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
