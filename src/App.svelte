<script>
  import Header from "./components/Header.svelte";
  import PatientPalette from "./components/PatientPalette.svelte";
  import ScheduleGrid from "./components/ScheduleGrid.svelte";
  import PatientFormModal from "./components/modals/PatientFormModal.svelte";
  import PatientListModal from "./components/modals/PatientListModal.svelte";
  import SlotDetailModal from "./components/modals/SlotDetailModal.svelte";
  import PwaInstallModal from "./components/modals/PwaInstallModal.svelte";
  import OnboardingModal from "./components/modals/OnboardingModal.svelte";
  import TimeSettingsModal from "./components/modals/TimeSettingsModal.svelte";
  import PatientStatsModal from "./components/modals/PatientStatsModal.svelte";
  import WorkloadStatsModal from "./components/modals/WorkloadStatsModal.svelte";
  import ExportModal from "./components/modals/ExportModal.svelte";
  import {
    toasts,
    copyYesterday,
    checkYesterdayData,
    showToast,
    clearDay,
    patients,
    schedule,
    clearAllPatients,
    paintSlot,
  } from "./lib/store";
  import { fly } from "svelte/transition";

  let showPatientModal = false;
  let showDetailModal = false;
  let showListModal = false;
  let showPwaModal = false;
  let showOnboardingModal = false;
  let showTimeSettingsModal = false;
  let showStatsModal = false;
  let showWorkloadModal = false;
  let showExportModal = false;
  let selectedSlotData = null;
  let editingPatientData = null;
  let listModalImportMode = false;
  let pendingSlotTime = null;

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

  const handleGridSlotClick = (e) => {
    pendingSlotTime = e.detail.time;
    showListModal = true;
  };

  const handlePatientSelected = (e) => {
    if (pendingSlotTime) {
      paintSlot(pendingSlotTime, { patient: e.detail });
      pendingSlotTime = null;
    }
  };

  const closeSidebar = () => {
    document.getElementById("my-drawer").checked = false;
  };

  const handleCopy = () => {
    closeSidebar();
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

  const handleExportPatients = () => {
    closeSidebar();
    showExportModal = true;
  };

  const handleImportPatients = () => {
    closeSidebar();
    listModalImportMode = true;
    showListModal = true;
  };

  const handleClearAllPatients = () => {
    closeSidebar();
    setTimeout(() => {
      if (
        confirm(
          "⚠️ 确定要清空所有患者数据吗？\n\n这将删除所有已录入的患者信息，此操作无法撤销。",
        )
      ) {
        clearAllPatients();
      }
    }, 100);
  };

  const handleOpenPwaHelp = () => {
    closeSidebar();
    showPwaModal = true;
  };

  const handleOpenOnboarding = () => {
    closeSidebar();
    showOnboardingModal = true;
  };

  const handleOpenTimeSettings = () => {
    closeSidebar();
    showTimeSettingsModal = true;
  };

  const handleOpenStats = () => {
    closeSidebar();
    showStatsModal = true;
  };

  const handleOpenWorkload = () => {
    closeSidebar();
    showWorkloadModal = true;
  };

  // Icons for Sidebar
  const CopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
  const TrashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;
  const ExportIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
  const ImportIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const UserMinusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`;
  const PhoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`;
  const BookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
  const SettingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const ChartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`;
  const TrendingUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>`;
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
      on:openShowAll={() => {
        listModalImportMode = false;
        showListModal = true;
      }}
    />

    <main
      class="max-w-md mx-auto bg-base-100 min-h-screen shadow-xl sm:border-x border-base-200 w-full"
    >
      <ScheduleGrid
        on:openDetail={handleOpenDetail}
        on:openPatientSelect={handleGridSlotClick}
      />
    </main>

    <!-- Modals -->
    <PatientFormModal
      isOpen={showPatientModal}
      patientToEdit={editingPatientData}
      onClose={() => (showPatientModal = false)}
    />

    <PatientListModal
      isOpen={showListModal}
      importMode={listModalImportMode}
      selectOnly={!!pendingSlotTime}
      onClose={() => (showListModal = false)}
      on:editPatient={handleEditPatient}
      on:addNew={handleOpenAdd}
      on:selectPatient={handlePatientSelected}
      on:openExport={() => {
        showListModal = false;
        showExportModal = true;
      }}
    />

    <SlotDetailModal
      isOpen={showDetailModal}
      slotData={selectedSlotData}
      onClose={() => (showDetailModal = false)}
    />

    <PwaInstallModal
      isOpen={showPwaModal}
      onClose={() => (showPwaModal = false)}
    />

    <OnboardingModal
      isOpen={showOnboardingModal}
      onClose={() => (showOnboardingModal = false)}
    />

    <TimeSettingsModal
      isOpen={showTimeSettingsModal}
      onClose={() => (showTimeSettingsModal = false)}
    />

    <PatientStatsModal
      isOpen={showStatsModal}
      onClose={() => (showStatsModal = false)}
    />

    <WorkloadStatsModal
      isOpen={showWorkloadModal}
      onClose={() => (showWorkloadModal = false)}
    />

    <ExportModal
      isOpen={showExportModal}
      onClose={() => (showExportModal = false)}
    />

    <!-- Toast Container -->
    {#if $toasts.length > 0}
      <div
        class="toast toast-bottom toast-center z-[100] w-full max-w-sm px-4 pointer-events-none"
      >
        {#each $toasts as t (t.id)}
          <div
            in:fly={{ y: 20, duration: 200 }}
            out:fly={{ y: 20, duration: 200 }}
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
      <li class="menu-title">菜单</li>
      <li>
        <button on:click={handleCopy} class="gap-4">
          {@html CopyIcon}
          复制昨日安排
        </button>
      </li>
      <li>
        <button on:click={handleClear} class="gap-4 text-error">
          {@html TrashIcon}
          清空今日安排
        </button>
      </li>

      <div class="divider"></div>
      <li class="menu-title">统计分析</li>
      <li>
        <button on:click={handleOpenStats} class="gap-4">
          {@html ChartIcon}
          患者统计
        </button>
      </li>
      <li>
        <button on:click={handleOpenWorkload} class="gap-4">
          {@html TrendingUpIcon}
          工作量统计
        </button>
      </li>

      <div class="divider"></div>
      <li class="menu-title">数据管理</li>
      <li>
        <button on:click={handleExportPatients} class="gap-4">
          {@html ExportIcon}
          导出备份数据
        </button>
      </li>
      <li>
        <button on:click={handleImportPatients} class="gap-4">
          {@html ImportIcon}
          导入恢复数据
        </button>
      </li>
      <li>
        <button on:click={handleClearAllPatients} class="gap-4 text-error">
          {@html UserMinusIcon}
          清空所有患者
        </button>
      </li>

      <div class="divider"></div>
      <li class="menu-title">设置</li>
      <li>
        <button on:click={handleOpenTimeSettings} class="gap-4">
          {@html SettingsIcon}
          时间设置
        </button>
      </li>

      <div class="divider"></div>
      <li class="menu-title">应用</li>
      <li>
        <button on:click={handleOpenOnboarding} class="gap-4">
          {@html BookIcon}
          使用指南
        </button>
      </li>
      <li>
        <button on:click={handleOpenPwaHelp} class="gap-4">
          {@html PhoneIcon}
          安装到主屏幕
        </button>
      </li>
    </ul>
  </div>
</div>
