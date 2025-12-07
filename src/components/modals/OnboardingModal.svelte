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

        <div class="space-y-5">
          <!-- Step 1: Manage Patients -->
          <div class="flex gap-4">
            <div
              class="flex-none w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold"
            >
              1
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-base mb-1">患者管理</h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                点击顶部的 <span class="badge badge-primary badge-xs">+</span>
                添加患者，支持记录<span class="font-bold text-base-content"
                  >就诊单价</span
                >、诊断及联系方式。点击卡片右侧按钮可编辑详情。
              </p>
            </div>
          </div>

          <!-- Step 2: Schedule -->
          <div class="flex gap-4">
            <div
              class="flex-none w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold"
            >
              2
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-base mb-1">灵活排班</h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                支持两种快速排班模式：
                <br />
                • <b>先选时</b>：直接点击空白时间格，从弹出列表中选择患者。
                <br />
                • <b>先选人</b>：选中上方患者，再点击时间格。
              </p>
            </div>
          </div>

          <!-- Step 3: Stats -->
          <div class="flex gap-4">
            <div
              class="flex-none w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold"
            >
              3
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-base mb-1">统计分析</h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                在左侧菜单 <span class="badge badge-ghost badge-xs">☰</span>
                中查看：
                <br />
                • <b>工作量统计</b>：自动计算每日/特定日期的总工时及<span
                  class="text-success font-bold">预估收入</span
                >。
                <br />
                • <b>患者统计</b>：分析疾病类型分布。
              </p>
            </div>
          </div>

          <!-- Step 4: Data & Settings -->
          <div class="flex gap-4">
            <div
              class="flex-none w-8 h-8 rounded-full bg-neutral/10 flex items-center justify-center text-neutral font-bold"
            >
              4
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-base mb-1">备份与设置</h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                • <b>完整备份</b>：导出包含“排班历史”的所有数据，保障数据安全。
                <br />
                • <b>个性化</b>：在设置中调整上下班时间及时间间隔。
                <br />
                • <b>快捷操作</b>：支持“复制昨日安排”快速填充今日日程。
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
