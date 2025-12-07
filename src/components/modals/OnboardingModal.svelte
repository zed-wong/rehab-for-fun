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
      class="card w-full max-w-lg bg-base-100 shadow-xl max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
      role="dialog"
    >
      <div class="card-body">
        <div class="flex justify-between items-center mb-2">
          <h2 class="card-title text-xl font-bold">欢迎使用 Rehab Daily</h2>
          <button class="btn btn-sm btn-circle btn-ghost" on:click={onClose}>
            ✕
          </button>
        </div>

        <p class="text-base-content/70 mb-4">
          这是一个简单的康复排班工具，帮助您轻松管理每日患者安排。
        </p>

        <div class="space-y-6">
          <!-- Step 1: Manage Patients -->
          <div class="flex gap-4">
            <div
              class="flex-none w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg"
            >
              1
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-1">添加与管理患者</h3>
              <p class="text-base-content/80 text-sm">
                顶部是您的<span class="font-bold text-primary">患者库</span>。
                <br />
                • 点击 <span class="badge badge-primary badge-sm">+</span>
                添加新患者。
                <br />
                • 点击已有患者可以修改信息或删除。
              </p>
            </div>
          </div>

          <!-- Step 2: Schedule -->
          <div class="flex gap-4">
            <div
              class="flex-none w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg"
            >
              2
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-1">安排日程</h3>
              <p class="text-base-content/80 text-sm">
                下方是<span class="font-bold text-secondary">今日时间表</span>。
                <br />
                • 先选中患者，再点击任意时间格，即可把患者安排到指定时间。
                <br />
                • 点击已安排的时间格可以查看详情、修改或清除。
              </p>
            </div>
          </div>

          <!-- Step 3: Tools -->
          <div class="flex gap-4">
            <div
              class="flex-none w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg"
            >
              3
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-1">快捷工具</h3>
              <p class="text-base-content/80 text-sm">
                左上角的 <span class="badge badge-neutral badge-sm">☰</span>
                菜单提供更多功能：
                <br />
                •
                <span class="font-bold">复制昨日</span
                >：一键复制昨天的排班到今天。
                <br />
                •
                <span class="font-bold">数据备份</span
                >：导出或导入您的患者数据，防止丢失。
                <br />
                • <span class="font-bold">安装应用</span>：将网页作为 App
                安装到手机桌面。
              </p>
            </div>
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <button class="btn btn-primary w-full" on:click={onClose}
            >开始使用</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
