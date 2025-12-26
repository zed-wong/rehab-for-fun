<script>
  import { archivedPatients, recoverPatient, permanentlyDeletePatient } from "../../lib/store";
  import { fade, fly } from "svelte/transition";

  export let isOpen = false;
  export let onClose = () => {};

  let searchQuery = "";

  $: filteredArchived = $archivedPatients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.type && p.type.toLowerCase().includes(q)) ||
      (p.contact && p.contact.toLowerCase().includes(q))
    );
  });

  const handleRecover = (id) => {
    if (confirm("确定要恢复这位患者吗？")) {
      recoverPatient(id);
    }
  };

  const handlePermanentDelete = (id) => {
    if (
      confirm(
        "⚠️ 确定要永久删除这位患者吗？\n\n此操作将完全删除患者信息，包括所有历史记录，且无法恢复！",
      )
    ) {
      permanentlyDeletePatient(id);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const SearchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-base-content/50"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  const RecoverIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`;
  const DeleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
  const ArchiveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`;
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="bg-base-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      in:fly={{ y: 20, duration: 300 }}
    >
      <!-- Header -->
      <div
        class="px-5 py-4 border-b border-base-200 flex items-center justify-between bg-base-100"
      >
        <div class="flex items-center gap-2">
          {@html ArchiveIcon}
          <h2 class="text-lg font-bold">已归档患者</h2>
        </div>
        <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}>
          ✕
        </button>
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
            type="text"
            placeholder="搜索归档患者..."
            bind:value={searchQuery}
            class="input input-sm input-bordered w-full pl-9 rounded-lg"
          />
        </div>
      </div>

      <!-- List -->
      <div
        class="overflow-y-auto overflow-x-hidden p-2 space-y-1 flex-1 min-h-[300px]"
      >
        {#if filteredArchived.length === 0}
          <div
            class="flex flex-col items-center justify-center h-full text-base-content/50 py-10"
          >
            {#if $archivedPatients.length === 0}
              <div class="text-4xl mb-3 opacity-30">{@html ArchiveIcon}</div>
              <p class="font-medium">暂无归档患者</p>
              <p class="text-sm mt-1">
                归档的患者将不会出现在安排列表中
              </p>
            {:else}
              <p>未找到匹配的归档患者</p>
            {/if}
          </div>
        {:else}
          {#each filteredArchived as p (p.id)}
            <div
              class="w-full flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-300"
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
                  <span class="badge badge-xs badge-ghost">已归档</span>
                </div>
                <div class="text-xs text-base-content/60 truncate">
                  {p.type || "无诊断"}
                  {#if p.contact}
                    • {p.contact}
                  {/if}
                </div>
                {#if p.archivedAt}
                  <div class="text-xs text-base-content/40 mt-1">
                    归档于 {formatDate(p.archivedAt)}
                  </div>
                {/if}
              </div>

              <!-- Actions -->
              <div class="flex gap-1">
                <button
                  class="btn btn-xs btn-ghost text-success hover:bg-success/10"
                  on:click={() => handleRecover(p.id)}
                  title="恢复患者"
                >
                  {@html RecoverIcon}
                </button>
                <button
                  class="btn btn-xs btn-ghost text-error hover:bg-error/10"
                  on:click={() => handlePermanentDelete(p.id)}
                  title="永久删除"
                >
                  {@html DeleteIcon}
                </button>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Footer -->
      <div
        class="p-3 border-t border-base-200 bg-base-50 flex justify-between items-center text-xs text-base-content/50"
      >
        <span>共 {$archivedPatients.length} 位归档患者</span>
        <div class="text-xs text-base-content/40">
          归档患者可恢复或永久删除
        </div>
      </div>
    </div>
  </div>
{/if}
