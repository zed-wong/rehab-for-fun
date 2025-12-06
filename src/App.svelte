<script>
  import Header from "./components/Header.svelte";
  import PatientPalette from "./components/PatientPalette.svelte";
  import ScheduleGrid from "./components/ScheduleGrid.svelte";
  import PatientFormModal from "./components/modals/PatientFormModal.svelte";
  import PatientListModal from "./components/modals/PatientListModal.svelte";
  import SlotDetailModal from "./components/modals/SlotDetailModal.svelte";
  import { toasts } from "./lib/store";
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
</script>

<div class="min-h-screen bg-base-200 font-sans" data-theme="winter">
  <Header />

  <PatientPalette
    on:openAddModal={handleOpenAdd}
    on:editPatient={handleEditPatient}
    on:openShowAll={() => (showListModal = true)}
  />

  <main
    class="max-w-md mx-auto bg-base-100 min-h-screen shadow-xl sm:border-x border-base-200"
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
