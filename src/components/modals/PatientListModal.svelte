<script>
  import {
    patients,
    schedule,
    selectedPatientId,
    selectedDuration,
    showToast,
    clearAllPatients,
  } from "../../lib/store";
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { get } from "svelte/store";

  export let selectOnly = false;
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
      (p.type && p.type.toLowerCase().includes(q)) ||
      (p.contact && p.contact.toLowerCase().includes(q))
    );
  });

  const selectPatient = (p) => {
    if (!selectOnly) {
      selectedPatientId.set(p.id);
      selectedDuration.set(p.duration || 30);
    }
    dispatch("selectPatient", p);
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

  // Export / Import Logic
  export let importMode = false;
  let importText = "";
  $: importPlaceholder = $_("modal.patient_list.import_placeholder");

  const handleExport = () => {
    dispatch("openExport"); // Let parent App.svelte handle it via ExportModal
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      let patientsToImport = [];
      let scheduleToImport = null;

      if (Array.isArray(parsed)) {
        patientsToImport = parsed;
      } else if (parsed.patients && Array.isArray(parsed.patients)) {
        patientsToImport = parsed.patients;
        scheduleToImport = parsed.schedule;
      } else {
        throw new Error(get(_)("import.format_error"));
      }

      // Basic validation
      if (
        patientsToImport.length > 0 &&
        patientsToImport.some((p) => !p.name)
      ) {
        throw new Error($_("store.invalid_patient_data"));
      }

      // Import Patients
      if (patientsToImport.length > 0) {
        patients.update((current) => {
          const currentMap = new Map(current.map((p) => [p.id, p]));
          patientsToImport.forEach((p) => {
            if (p.id) {
              currentMap.set(p.id, p);
            } else {
              p.id = crypto.randomUUID();
              currentMap.set(p.id, p);
            }
          });
          return Array.from(currentMap.values());
        });
      }

      // Import Schedule
      if (scheduleToImport) {
        schedule.update((s) => ({ ...s, ...scheduleToImport }));
      }

      const count = patientsToImport.length;
      showToast(
        get(_)("store.import_success", {
          count,
          schMsg: scheduleToImport ? get(_)("import.with_history") : "",
        }),
        "success",
      );

      importMode = false;
      importText = "";
    } catch (e) {
      console.error(e);
      showToast($_("store.import_failed"), "error");
    }
  };

  const handleClearAll = () => {
    if (confirm($_("modal.patient_list.clear_all_confirm"))) {
      clearAllPatients();
      showToast($_("store.all_cleared"), "success");
    }
  };
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    in:fade={{ duration: 200 }}
    on:click|self={onClose}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-base-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      in:fly={{ y: 20, duration: 300 }}
    >
      <!-- Header -->
      <div
        class="px-5 py-4 border-b border-base-200 flex items-center justify-between bg-base-100 z-10"
      >
        <h2 class="text-lg font-bold">
          {importMode
            ? $_("modal.patient_list.import_title")
            : $_("modal.patient_list.title")}
        </h2>
        <div class="flex gap-2">
          {#if !importMode}
            <div class="dropdown dropdown-end">
              <div
                tabindex="0"
                role="button"
                class="btn btn-sm btn-ghost btn-circle"
                aria-label="Menu"
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
                  ><circle cx="12" cy="12" r="1" /><circle
                    cx="12"
                    cy="5"
                    r="1"
                  /><circle cx="12" cy="19" r="1" /></svg
                >
              </div>
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <ul
                tabindex="0"
                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-200"
              >
                <li>
                  <button on:click={handleExport}
                    >{$_("modal.patient_list.export_btn")}</button
                  >
                </li>
                <li>
                  <button on:click={() => (importMode = true)}
                    >{$_("modal.patient_list.import_btn")}</button
                  >
                </li>
                <li>
                  <button on:click={handleClearAll} class="text-error"
                    >{$_("modal.patient_list.clear_all")}</button
                  >
                </li>
              </ul>
            </div>
          {/if}
          <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}
            >✕</button
          >
        </div>
      </div>

      <!-- Search -->
      {#if !importMode}
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
              placeholder={$_("modal.patient_list.search_placeholder")}
              bind:value={searchQuery}
              class="input input-sm input-bordered w-full pl-9 rounded-lg"
            />
          </div>
        </div>
      {/if}

      <!-- List or Import Textarea -->
      <div
        class="overflow-y-auto overflow-x-hidden p-2 space-y-1 flex-1 min-h-[300px]"
      >
        {#if importMode}
          <div class="p-2 h-full flex flex-col gap-2">
            <textarea
              bind:value={importText}
              class="textarea textarea-bordered w-full h-full min-h-[250px] resize-none font-mono text-xs"
              placeholder={importPlaceholder}
            ></textarea>
            <div class="text-xs text-base-content/50">
              {$_("modal.patient_list.import_hint")}
            </div>
          </div>
        {:else if filteredPatients.length === 0}
          <div
            class="flex flex-col items-center justify-center h-full text-base-content/50 py-10"
          >
            <p>{$_("modal.patient_list.not_found")}</p>
            <button
              class="btn btn-sm btn-link mt-2"
              on:click={() => {
                dispatch("addNew");
                onClose();
              }}
            >
              {$_("modal.patient_list.add_new")}
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
                    <span class="badge badge-xs badge-primary"
                      >{$_("modal.patient_list.selected")}</span
                    >
                  {/if}
                </div>
                <div class="text-xs text-base-content/60 truncate">
                  {p.type || $_("modal.patient_list.no_diagnosis")}
                  {#if p.contact}
                    • {p.contact}{/if}
                  • {p.duration || 30}{$_("common.full_mins", {
                    values: { m: "" },
                  })}
                </div>
              </div>

              <!-- Edit Action -->
              <div
                role="button"
                tabindex="0"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-base-300 text-base-content/70"
                on:click={(e) => handleEdit(p, e)}
                on:keydown={(e) => e.key === "Enter" && handleEdit(p, e)}
                title={$_("patient_palette.edit_patient", {
                  values: { name: p.name },
                })}
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
        {#if importMode}
          <button class="btn btn-sm" on:click={() => (importMode = false)}
            >{$_("modal.common.cancel")}</button
          >
          <button
            class="btn btn-sm btn-primary"
            on:click={handleImport}
            disabled={!importText}
            >{$_("modal.patient_list.confirm_import")}</button
          >
        {:else}
          <span
            >{$_("modal.patient_list.total_patients", {
              values: { count: listPatients.length },
            })}</span
          >
          <button
            class="btn btn-xs btn-ghost text-primary"
            on:click={() => {
              dispatch("addNew");
              onClose();
            }}
          >
            + {$_("modal.patient_list.add_new")}
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
