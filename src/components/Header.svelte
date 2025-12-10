<script>
  import {
    currentDate,
    checkYesterdayData,
    copyYesterday,
    showToast,
  } from "../lib/store";

  // Icons
  const CalendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
  const ChevLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
  const ChevRight = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
  const CopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

  /* ... handlers ... */
  const handleDateChange = (e) => {
    currentDate.set(e.target.value);
  };

  const changeDay = (offset) => {
    const d = new Date($currentDate);
    d.setDate(d.getDate() + offset);
    currentDate.set(d.toLocaleDateString("en-CA"));
  };

  const handleCopy = () => {
    if (!checkYesterdayData()) {
      showToast("昨日无数据可复制", "warning");
      return;
    }

    if (confirm("确定要复制昨日的安排到今天吗？这将覆盖今天的布局。")) {
      copyYesterday();
    }
  };
</script>

<header
  class="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-2 min-h-[3.5rem]"
>
  <!-- Left: Sidebar Toggle -->
  <div class="navbar-start">
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

  <!-- Center: Date Navigation (Absolutely Centered) -->
  <div
    class="absolute left-1/2 transform -translate-x-1/2 flex gap-2 items-center"
  >
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
    <div class="relative w-[140px] sm:w-[150px]">
      <div
        class="input input-bordered input-sm flex items-center gap-2 w-full cursor-pointer bg-base-100 pr-0"
      >
        <span class="text-base-content/60">{@html CalendarIcon}</span>
        <span
          class="font-bold text-base-content text-sm overflow-hidden text-ellipsis whitespace-nowrap"
          >{$currentDate}</span
        >
      </div>
      <input
        type="date"
        value={$currentDate}
        on:change={handleDateChange}
        on:click={(e) => {
          try {
            /** @type {HTMLInputElement} */ (e.target).showPicker();
          } catch (error) {
            // Fallback
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
  </div>

  <!-- Right: Copy Action -->
  <div class="navbar-end">
    <button
      class="btn btn-sm btn-ghost gap-2"
      on:click={handleCopy}
      title="复制昨日安排"
    >
      <div class="opacity-70">
        {@html CopyIcon}
      </div>
      <span class="hidden sm:inline text-xs opacity-70">复制昨日</span>
    </button>
  </div>
</header>
