<script>
  import Header from "./components/Header.svelte";
  import PatientPalette from "./components/PatientPalette.svelte";
  import ScheduleGrid from "./components/ScheduleGrid.svelte";
  import PatientFormModal from "./components/modals/PatientFormModal.svelte";
  import PatientListModal from "./components/modals/PatientListModal.svelte";
  import SlotDetailModal from "./components/modals/SlotDetailModal.svelte";
  import {
    toasts,
    copyYesterday,
    checkYesterdayData,
    showToast,
    clearDay,
  } from "./lib/store";
  import { fly } from "svelte/transition";

  let showPatientModal = false;
  let showDetailModal = false;
  let showListModal = false;
  let selectedSlotData = null;
  let editingPatientData = null;

  const handleOpenDetail = (e) => {
    selectedSlotData = e.detail;
    showDetailModal = true;
  };

  const handleOpenAdd = () => {
    editingPatientData = null;
    showPatientModal = true;
  };

  const handleEditPatient = (e) => {
    editingPatientData = e.detail;
    showPatientModal = true;
  };

  const closeSidebar = () => {
    document.getElementById("my-drawer").checked = false;
  };

  const handleCopy = () => {
    // Close sidebar immediately for better UX or after action?
    // User requested "when click the button inside the sidebar, close the sidebar"
    // So we close it regardless of the confirmation result or before it?
    // Usually confirmation blocks, so we might want to close it first or after.
    // Let's close it after action or if they cancel?
    // If we use native confirm, it blocks.
    // Let's close it after the confirm dialog returns, to ensure they see the main view.

    closeSidebar();

    // We need a slight delay or just proceed.
    // If we close sidebar, the drawer animation happens.
    // Native confirm pauses JS.
    // Let's use setTimeout to allow UI to update if needed, but synchronous is fine too.

    setTimeout(() => {
      if (!checkYesterdayData()) {
        showToast("昨日无数据可复制", "warning");
        return;
      }

      if (confirm("确定要复制昨日的安排到今天吗？这将覆盖今天的布局。")) {
        copyYesterday();
      }
    }, 100);
  };

  const handleClear = () => {
    closeSidebar();
    setTimeout(() => {
      if (confirm("确定要清空今天的全部安排吗？此操作无法撤销。")) {
        clearDay();
      }
    }, 100);
  };

  // Icons for Sidebar
  const CopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
  const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;
</script>

<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div
    class="drawer-content flex flex-col min-h-screen bg-base-200 font-sans"
    data-theme="winter"
  >
    <Header />

    <PatientPalette
      on:openAddModal={handleOpenAdd}
      on:editPatient={handleEditPatient}
      on:openShowAll={() => (showListModal = true)}
    />

    <main
      class="max-w-md mx-auto bg-base-100 min-h-screen shadow-xl sm:border-x border-base-200 w-full"
    >
      <ScheduleGrid on:openDetail={handleOpenDetail} />
    </main>

    <!-- Modals -->
    <PatientFormModal
      isOpen={showPatientModal}
      patientToEdit={editingPatientData}
      onClose={() => (showPatientModal = false)}
    />

    <PatientListModal
      isOpen={showListModal}
      onClose={() => (showListModal = false)}
      on:editPatient={handleEditPatient}
      on:addNew={handleOpenAdd}
    />

    <SlotDetailModal
      isOpen={showDetailModal}
      slotData={selectedSlotData}
      onClose={() => (showDetailModal = false)}
    />

    <!-- Toast Container -->
    {#if $toasts.length > 0}
      <div
        class="toast toast-top toast-center z-[100] w-full max-w-sm px-4 pointer-events-none"
      >
        {#each $toasts as t (t.id)}
          <div
            in:fly={{ y: -20, duration: 200 }}
            out:fly={{ y: -20, duration: 200 }}
            class="alert shadow-lg border-none {t.type === 'error'
              ? 'alert-error text-white'
              : t.type === 'success'
                ? 'alert-success text-white'
                : 'alert-info'}"
          >
            <span>{t.message}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="drawer-side z-[100]">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li class="menu-title">菜单 (Menu)</li>
      <li>
        <button on:click={handleCopy} class="gap-4">
          {@html CopyIcon}
          复制昨日安排
        </button>
      </li>
      <li>
        <button on:click={handleClear} class="text-error gap-4">
          {@html TrashIcon}
          清空今日安排
        </button>
      </li>
    </ul>
  </div>
</div>
