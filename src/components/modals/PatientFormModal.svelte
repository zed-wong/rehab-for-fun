<script>
  import { addPatient, updatePatient, deletePatient } from "../../lib/store";
  import { _ } from "svelte-i18n";

  export let isOpen = false;
  export let patientToEdit = null; // If passed, we are editing
  export let onClose = () => {};

  let name = "";
  let type = "";
  let duration = 30;
  let color = "bg-blue-500";
  let category = "Inpatient"; // Default
  let contact = "";
  let frequency = "";
  let price = 0;

  // React to opening with data
  $: if (isOpen && patientToEdit) {
    name = patientToEdit.name;
    type = patientToEdit.type;
    duration = patientToEdit.duration;
    color = patientToEdit.color;
    category = patientToEdit.category || "Inpatient";
    contact = patientToEdit.contact || "";
    frequency = patientToEdit.frequency || "";
    price = patientToEdit.price || 0;
  } else if (isOpen && !patientToEdit) {
    reset();
  }

  $: colors = [
    { label: $_("colors.blue"), val: "bg-blue-500" },
    { label: $_("colors.green"), val: "bg-emerald-500" },
    { label: $_("colors.orange"), val: "bg-amber-500" },
    { label: $_("colors.red"), val: "bg-rose-500" },
    { label: $_("colors.purple"), val: "bg-violet-500" },
    { label: $_("colors.gray"), val: "bg-slate-500" },
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (patientToEdit) {
      updatePatient(patientToEdit.id, {
        name,
        type,
        duration,
        color,
        category,
        contact,
        frequency,
        price: Number(price),
      });
    } else {
      addPatient({
        name,
        type,
        duration,
        color,
        category,
        contact,
        frequency,
        price: Number(price),
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (confirm($_("modal.patient_form.delete_confirm"))) {
      deletePatient(patientToEdit.id);
      onClose();
    }
  };

  const reset = () => {
    name = "";
    type = "";
    duration = 30;
    color = "bg-blue-500";
    category = "Inpatient";
    contact = "";
    frequency = "";
    price = 0;
  };
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    on:click|self={onClose}
    role="button"
    tabindex="-1"
  >
    <div
      class="card w-full max-w-sm bg-base-100 shadow-xl max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
      role="dialog"
    >
      <div class="card-body">
        <div class="flex justify-between items-center">
          <h2 class="card-title text-lg font-bold">
            {patientToEdit
              ? $_("modal.patient_form.edit_title")
              : $_("modal.patient_form.add_title")}
          </h2>
          {#if patientToEdit}
            <button
              class="btn btn-xs btn-outline btn-error"
              on:click={handleDelete}>{$_("modal.common.delete")}</button
            >
          {/if}
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.name")}</span
            ></label
          >
          <input
            type="text"
            bind:value={name}
            placeholder={$_("modal.patient_form.name_placeholder")}
            class="input input-bordered w-full"
          />
        </div>

        <!-- Contact (New) -->
        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.contact")}</span
            ></label
          >
          <input
            type="text"
            bind:value={contact}
            placeholder={$_("modal.patient_form.contact_placeholder")}
            class="input input-bordered w-full"
          />
        </div>

        <!-- Price (New) -->
        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.price")}</span
            ></label
          >
          <input
            type="number"
            bind:value={price}
            placeholder="0"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Frequency (New) -->
        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.frequency")}</span
            ></label
          >
          <input
            type="text"
            bind:value={frequency}
            placeholder={$_("modal.patient_form.frequency_placeholder")}
            class="input input-bordered w-full"
          />
        </div>

        <!-- Diagnosis -->
        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.diagnosis")}</span
            ></label
          >
          <input
            type="text"
            bind:value={type}
            placeholder={$_("modal.patient_form.diagnosis_placeholder")}
            class="input input-bordered w-full"
          />
        </div>

        <!-- Category -->
        <div class="form-control">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.category")}</span
            ></label
          >
          <div class="flex gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                type="radio"
                bind:group={category}
                value="Inpatient"
                class="radio radio-sm"
              />
              <span class="label-text"
                >{$_("modal.patient_form.inpatient")}</span
              >
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                type="radio"
                bind:group={category}
                value="Outpatient"
                class="radio radio-sm"
              />
              <span class="label-text"
                >{$_("modal.patient_form.outpatient")}</span
              >
            </label>
          </div>
        </div>

        <!-- Duration -->
        <div class="form-control">
          <label class="label"
            ><span class="label-text"
              >{$_("modal.patient_form.default_duration")}</span
            ></label
          >
          <div class="flex gap-4">
            <label
              class="label cursor-pointer gap-2 border rounded-lg px-3 py-2 flex-1 {duration ===
              30
                ? 'border-primary bg-primary/5'
                : ''}"
            >
              <input
                type="radio"
                bind:group={duration}
                value={30}
                class="radio radio-primary radio-sm"
              />
              <span class="label-text font-medium"
                >{$_("common.full_mins", { values: { m: 30 } })}</span
              >
            </label>
            <label
              class="label cursor-pointer gap-2 border rounded-lg px-3 py-2 flex-1 {duration ===
              60
                ? 'border-primary bg-primary/5'
                : ''}"
            >
              <input
                type="radio"
                bind:group={duration}
                value={60}
                class="radio radio-primary radio-sm"
              />
              <span class="label-text font-medium"
                >{$_("common.full_hours", { values: { h: 1 } })}</span
              >
            </label>
          </div>
        </div>

        <!-- Color -->
        <div class="form-control">
          <label class="label"
            ><span class="label-text">{$_("modal.patient_form.color")}</span
            ></label
          >
          <div class="flex gap-2 flex-wrap">
            {#each colors as c}
              <button
                class="w-8 h-8 rounded-full {c.val} transition-transform {color ===
                c.val
                  ? 'ring-2 ring-offset-2 ring-base-content scale-110'
                  : 'opacity-70 hover:opacity-100'}"
                on:click={() => (color = c.val)}
                aria-label={c.label}
                type="button"
              ></button>
            {/each}
          </div>
        </div>

        <div class="card-actions justify-end mt-4">
          <button class="btn btn-ghost" on:click={onClose}
            >{$_("modal.common.cancel")}</button
          >
          <button class="btn btn-primary" on:click={handleSubmit}
            >{$_("modal.common.save")}</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
