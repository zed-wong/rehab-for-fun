<script>
  export let isOpen = false;
  export let onClose = () => {};
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
    role="button"
    tabindex="0"
  >
    <div
      class="card w-full max-w-sm bg-base-100 shadow-xl"
      on:click|stopPropagation
      role="dialog"
    >
      <div class="card-body">
        <div class="flex justify-between items-center mb-2">
          <h2 class="card-title text-lg font-bold">安装到主屏幕</h2>
          <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}>
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <!-- Step 1: Open in Safari -->
          <div class="flex items-start gap-4">
            <div class="flex-none pt-1">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
              >
                1
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium">在 Safari 浏览器打开</p>
              <p class="text-sm text-base-content/70 mt-1">
                请确保您正在使用 iPhone 自带的 Safari 浏览器访问本页面
              </p>
              <div class="mt-2 text-center p-2 bg-base-200 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mx-auto text-primary"
                  ><circle cx="12" cy="12" r="10" /><polygon
                    points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
                  /></svg
                >
              </div>
            </div>
          </div>

          <!-- Step 2: Share -->
          <div class="flex items-start gap-4">
            <div class="flex-none pt-1">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
              >
                2
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium">点击 "分享" 按钮</p>
              <p class="text-sm text-base-content/70 mt-1">
                在 Safari 浏览器底部工具栏找到分享图标
              </p>
              <div class="mt-2 text-center p-2 bg-base-200 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mx-auto text-primary"
                  ><path
                    d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
                  /><polyline points="16 6 12 2 8 6" /><line
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="15"
                  /></svg
                >
              </div>
            </div>
          </div>

          <!-- Step 3: Add to Home Screen -->
          <div class="flex items-start gap-4">
            <div class="flex-none pt-1">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
              >
                3
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium">选择 "添加到主屏幕"</p>
              <p class="text-sm text-base-content/70 mt-1">
                向下滑动菜单找到加号图标选项
              </p>
              <div class="mt-2 text-center p-2 bg-base-200 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mx-auto text-primary"
                  ><rect
                    width="18"
                    height="18"
                    x="3"
                    y="3"
                    rx="2"
                    ry="2"
                  /><line x1="12" y1="8" x2="12" y2="16" /><line
                    x1="8"
                    y1="12"
                    x2="16"
                    y2="12"
                  /></svg
                >
              </div>
            </div>
          </div>

          <!-- Step 4: Add -->
          <div class="flex items-start gap-4">
            <div class="flex-none pt-1">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
              >
                4
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium">点击 "添加"</p>
              <p class="text-sm text-base-content/70 mt-1">
                确认名称后点击右上角的添加按钮
              </p>
            </div>
          </div>
        </div>

        <div class="alert alert-info text-sm mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path></svg
          >
          <span>这样可以像原生 App 一样全屏使用，体验更好！</span>
        </div>

        <div class="card-actions justify-end mt-2">
          <button class="btn btn-primary w-full" on:click={onClose}
            >知道了</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
