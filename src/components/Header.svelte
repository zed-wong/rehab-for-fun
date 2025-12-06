<script>
  import { currentDate } from "../lib/store";

  // Icons
  const CalendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
  const ChevLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
  const ChevRight = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

  /* ... handlers ... */
  const handleDateChange = (e) => {
    currentDate.set(e.target.value);
  };

  const changeDay = (offset) => {
    const d = new Date($currentDate);
    d.setDate(d.getDate() + offset);
    currentDate.set(d.toLocaleDateString("en-CA"));
  };
</script>

<header
  class="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-2 min-h-[3.5rem] flex gap-2"
>
  <!-- Sidebar Toggle -->
  <div class="flex-none">
    <label
      for="my-drawer"
      class="btn btn-sm btn-circle btn-ghost drawer-button"
      aria-label="打开菜单"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </label>
  </div>

  <!-- Prev Day -->
  <button
    class="btn btn-sm btn-circle btn-ghost"
    on:click={() => changeDay(-1)}
    aria-label="前一天"
    title="前一天"
  >
    {@html ChevLeft}
  </button>

  <!-- Date Input -->
  <div class="relative flex-1 max-w-[150px]">
    <label
      class="input input-bordered input-sm flex items-center gap-2 w-full cursor-pointer bg-base-100 pr-0"
    >
      <span class="text-base-content/60">{@html CalendarIcon}</span>
      <span
        class="font-bold text-base-content text-sm overflow-hidden text-ellipsis whitespace-nowrap"
        >{$currentDate}</span
      >
    </label>
    <input
      type="date"
      value={$currentDate}
      on:change={handleDateChange}
      on:click={(e) => {
        try {
          e.target.showPicker();
        } catch (error) {
          // Fallback or ignore if not supported
        }
      }}
      class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
    />
  </div>

  <!-- Next Day -->
  <button
    class="btn btn-sm btn-circle btn-ghost"
    on:click={() => changeDay(1)}
    aria-label="后一天"
    title="后一天"
  >
    {@html ChevRight}
  </button>

  <div class="flex-1"></div>
</header>
