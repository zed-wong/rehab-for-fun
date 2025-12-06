<script>
  import { addPatient, updatePatient, deletePatient } from "../../lib/store";

  export let isOpen = false;
  export let patientToEdit = null; // If passed, we are editing
  export let onClose = () => {};

  let name = "";
  let type = "";
  let duration = 30;
  let color = "bg-blue-500";
  let category = "Inpatient"; // Default

  // React to opening with data
  $: if (isOpen && patientToEdit) {
    name = patientToEdit.name;
    type = patientToEdit.type;
    duration = patientToEdit.duration;
    color = patientToEdit.color;
    category = patientToEdit.category || "Inpatient";
  } else if (isOpen && !patientToEdit) {
    reset();
  }

  const colors = [
    { label: "Blue", val: "bg-blue-500" },
    { label: "Green", val: "bg-emerald-500" },
    { label: "Orange", val: "bg-amber-500" },
    { label: "Red", val: "bg-rose-500" },
    { label: "Purple", val: "bg-violet-500" },
    { label: "Slate", val: "bg-slate-500" },
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
      });
    } else {
      addPatient({ name, type, duration, color, category });
    }

    onClose();
  };

  const handleDelete = () => {
    if (confirm("Delete this patient permanently?")) {
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
      class="card w-full max-w-sm bg-base-100 shadow-xl"
      on:click|stopPropagation
      role="dialog"
    >
      <div class="card-body">
        <div class="flex justify-between items-center">
          <h2 class="card-title text-lg font-bold">
            {patientToEdit ? "编辑患者" : "添加患者"}
          </h2>
          {#if patientToEdit}
            <button
              class="btn btn-xs btn-outline btn-error"
              on:click={handleDelete}>删除</button
            >
          {/if}
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label class="label"><span class="label-text">姓名</span></label>
          <input
            type="text"
            bind:value={name}
            placeholder="例如：张伟"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Diagnosis -->
        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">诊断 / 备注</span></label
          >
          <input
            type="text"
            bind:value={type}
            placeholder="例如：脑卒中"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Category -->
        <div class="form-control">
          <label class="label"><span class="label-text">类别</span></label>
          <div class="flex gap-4">
            <label class="label cursor-pointer gap-2">
              <input
                type="radio"
                bind:group={category}
                value="Inpatient"
                class="radio radio-sm"
              />
              <span class="label-text">住院</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input
                type="radio"
                bind:group={category}
                value="Outpatient"
                class="radio radio-sm"
              />
              <span class="label-text">门诊</span>
            </label>
          </div>
        </div>

        <!-- Duration -->
        <div class="form-control">
          <label class="label"><span class="label-text">默认时长</span></label>
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
              <span class="label-text font-medium">30 分钟</span>
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
              <span class="label-text font-medium">1 小时</span>
            </label>
          </div>
        </div>

        <!-- Color -->
        <div class="form-control">
          <label class="label"><span class="label-text">标签颜色</span></label>
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
          <button class="btn btn-ghost" on:click={onClose}>取消</button>
          <button class="btn btn-primary" on:click={handleSubmit}>保存</button>
        </div>
      </div>
    </div>
  </div>
{/if}
