<script>
  import {
    patients,
    selectedPatientId,
    selectedDuration,
  } from "../../lib/store";
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let isOpen = false;
  export let onClose = () => {};

  const dispatch = createEventDispatcher();

  let searchQuery = "";
  let searchInput;

  // Focus input when updated to open
  $: if (isOpen && searchInput) {
    setTimeout(() => searchInput.focus(), 100);
  }

  $: filteredPatients = $patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.type && p.type.toLowerCase().includes(q))
    );
  });

  const selectPatient = (p) => {
    selectedPatientId.set(p.id);
    selectedDuration.set(p.duration || 30);
    onClose();
  };

  const handleEdit = (p, e) => {
    e.stopPropagation();
    dispatch("editPatient", p);
    // We might want to keep this modal open or close it?
    // Usually editing happens in a separate modal stack or replaces this one.
    // For now, let's close this one so the form is visible (App.svelte handles form).
    onClose();
  };

  const EditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;
  const SearchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-base-content/50"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 150 }}
    on:click|self={onClose}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-base-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      in:fly={{ y: 20, duration: 300 }}
      out:fly={{ y: 20, duration: 200 }}
    >
      <!-- Header -->
      <div
        class="px-5 py-4 border-b border-base-200 flex items-center justify-between bg-base-100 z-10"
      >
        <h2 class="text-lg font-bold">选择患者</h2>
        <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}
          >✕</button
        >
      </div>

      <!-- Search -->
      <div class="p-3 border-b border-base-200 bg-base-50/50">
        <div class="relative">
          <div
            class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            {@html SearchIcon}
          </div>
          <input
            bind:this={searchInput}
            type="text"
            placeholder="搜索姓名或诊断..."
            bind:value={searchQuery}
            class="input input-sm input-bordered w-full pl-9 rounded-lg"
          />
        </div>
      </div>

      <!-- List -->
      <div
        class="overflow-y-auto overflow-x-hidden p-2 space-y-1 flex-1 min-h-[300px]"
      >
        {#if filteredPatients.length === 0}
          <div
            class="flex flex-col items-center justify-center h-full text-base-content/50 py-10"
          >
            <p>未找到患者</p>
            <button
              class="btn btn-sm btn-link mt-2"
              on:click={() => {
                dispatch("addNew");
                onClose();
              }}
            >
              添加新患者
            </button>
          </div>
        {:else}
          {#each filteredPatients as p (p.id)}
            <button
              class="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors group relative
              {$selectedPatientId === p.id
                ? 'bg-primary/5 border border-primary/20'
                : ''}"
              on:click={() => selectPatient(p)}
            >
              <!-- Color Indicator -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 {p.color} bg-opacity-20 text-xs font-bold ring-1 ring-inset ring-black/5"
              >
                {p.name.charAt(0)}
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate flex items-center gap-2">
                  {p.name}
                  {#if $selectedPatientId === p.id}
                    <span class="badge badge-xs badge-primary">已选择</span>
                  {/if}
                </div>
                <div class="text-xs text-base-content/60 truncate">
                  {p.type || "无诊断"} • {p.duration || 30}分钟默认
                </div>
              </div>

              <!-- Edit Action -->
              <div
                role="button"
                tabindex="0"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-base-300 text-base-content/70"
                on:click={(e) => handleEdit(p, e)}
                on:keydown={(e) => e.key === "Enter" && handleEdit(p, e)}
                title="编辑详情"
              >
                {@html EditIcon}
              </div>
            </button>
          {/each}
        {/if}
      </div>

      <!-- Footer (Quick Add) -->
      <div
        class="p-3 border-t border-base-200 bg-base-50 flex justify-between items-center text-xs text-base-content/50"
      >
        <span>共 {filteredPatients.length} 位患者</span>
        <button
          class="btn btn-xs btn-ghost text-primary"
          on:click={() => {
            dispatch("addNew");
            onClose();
          }}
        >
          + 添加新患者
        </button>
      </div>
    </div>
  </div>
{/if}
