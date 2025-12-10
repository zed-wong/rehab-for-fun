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
      role="dialog"
      tabindex="-1"
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
                点击顶部 <span class="badge badge-primary badge-xs">+</span>
                添加患者。支持记录单价与诊断，点击卡片可查看详情。
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
                • <b>双向排班</b>：支持“先选时”和“先选人”两种模式。
              </p>
            </div>
          </div>

          <!-- Step 3: Stats & Share -->
          <div class="flex gap-4">
            <div
              class="flex-none w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold"
            >
              3
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-base mb-1">统计与分享</h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                • <b>数据看板</b>：实时查看工作量、预估收入及患者分布。
                <br />
                • <b>一键分享</b>：点击“复制日程清单”导出纯文本安排。
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
              <h3 class="font-bold text-base mb-1">数据与设置</h3>
              <p class="text-base-content/70 text-sm leading-relaxed">
                • <b>快捷操作</b>：支持“复制昨日安排”及“清空今日”。
                <br />
                • <b>个性化</b>：支持深色模式及自定义工作时间。
                <br />
                • <b>数据安全</b>：支持完整数据的导入导出备份。
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
