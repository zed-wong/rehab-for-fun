import { test, expect } from '@playwright/test';

test.describe('Patient Management and Scheduling', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the app
    await page.goto('/');
  });

  test('should create a new patient', async ({ page }) => {
    const uniqueName = `Patient-${Date.now()}`;

    // Open "Add Patient" modal
    await page.click('button[title="添加患者"]');

    // Fill form
    await page.fill('input[placeholder="例如：张伟"]', uniqueName);
    // Optional: Fill other fields if needed, but name is required.
    // await page.fill('input[placeholder="例如：脑卒中"]', 'Test Diagnosis');

    // Submit
    await page.click('button:has-text("保存")');

    // Verify patient is in the palette list
    // We look for a button that contains the patient name
    await expect(page.locator(`button`, { hasText: uniqueName }).first()).toBeVisible();
  });

  test('should select a patient and arrange them in a time slot', async ({ page }) => {
    const uniqueName = `ArrangeTest-${Date.now()}`;

    // 1. Create Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', uniqueName);
    await page.click('button:has-text("保存")');

    // 2. Select the patient in the palette
    // Find the button with the patient name.
    // Identify it by text. 
    const patientBtn = page.locator(`button`, { hasText: uniqueName }).first();
    await patientBtn.click();

    // Verify it is selected. The active class logic:
    // "btn-primary shadow-md" vs "btn-outline ..."
    await expect(patientBtn).toHaveClass(/btn-primary/);

    // 3. Arrange in a time slot (e.g., 10:00)
    // Target an empty slot.
    const targetTime = "10:00";
    const slotButton = page.locator(`button[aria-label="分配给 ${targetTime}"]`);

    // Ensure the slot is empty initially
    await expect(slotButton).toBeVisible();

    // Click to assign
    await slotButton.click();

    // 4. Verify assignment
    // The slot structure changes when filled. The button no longer has that aria-label.
    // But we can look for the text in the row corresponding to 10:00.

    // Find the row for 10:00 using the time label
    const timeRow = page.locator('div.group', { has: page.locator(`text="${targetTime}"`) });

    // Check if the patient name is visible in that row
    await expect(timeRow.locator(`text=${uniqueName}`)).toBeVisible();

    // 5. Arrange in another slot (e.g., 14:00)
    // The patient should still be selected.
    const targetTime2 = "14:00";
    const slotButton2 = page.locator(`button[aria-label="分配给 ${targetTime2}"]`);

    // Ensure the slot is empty initially
    await expect(slotButton2).toBeVisible();

    // Click to assign
    await slotButton2.click();

    // Verify assignment for second slot
    const timeRow2 = page.locator('div.group', { has: page.locator(`text="${targetTime2}"`) });
    await expect(timeRow2.locator(`text=${uniqueName}`)).toBeVisible();
  });

  test('should create a 1 hour patient and occupy correct slots', async ({ page }) => {
    const uniqueName = `1HourPatient-${Date.now()}`;

    // 1. Create Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', uniqueName);

    // Select 1 hour duration (now dynamic, defaulting to 60 mins)
    await page.click('text=60 分钟');

    await page.click('button:has-text("保存")');

    // 2. Select the patient
    const patientBtn = page.locator(`button`, { hasText: uniqueName }).first();
    await patientBtn.click();

    // Verify 1h badge is visible/selected on the patient button (optional but good)
    // The patient chip shows the duration.
    await expect(patientBtn).toContainText('1小时');

    // 3. Arrange in a slot (e.g., 09:00)
    const targetTime = "09:00";
    const slotButton = page.locator(`button[aria-label="分配给 ${targetTime}"]`);
    await slotButton.click();

    // 4. Verify assignment and duration visual
    // 09:00 Row
    const row0900 = page.locator('div.group', { has: page.locator(`text="09:00"`) });
    await expect(row0900.locator(`text=${uniqueName}`)).toBeVisible();

    // The next slot (09:30) should also be visually occupied.
    // In the implementation, the second slot (tail) is also rendered as a button but might be styled differently or part of the same block?
    // Let's check the code: 
    // If it's 1h, paintSlot likely fills [time] and [time + 30].

    // Check 09:30 row
    const row0930 = page.locator('div.group', { has: page.locator(`text="09:30"`) });

    // We expect the patient name to be visible (maybe in 09:00 block that spans?) 
    // OR we expect the 09:30 slot to NOT be "empty" (i.e. not have the dashed border or aria-label for assignment).
    // The implementation of ScheduleGrid shows:
    // {@const slot = daySchedule[time]}
    // If slot exists, it shows the filled button.

    // So 09:30 should NOT have the empty slot button.
    const emptySlot0930 = row0930.locator(`button[aria-label="分配给 09:30"]`);
    await expect(emptySlot0930).not.toBeVisible();

    // Instead it should probably have the filled slot (which might share the name or be the tail).
    // The code says:
    // {slot.duration === 60 && !slot.isHead ? 'rounded-t-none mt-[-1px] pt-4' : ''}
    // And inside:
    // {#if slot.isHead || slot.duration !== 60} ... show Name ... {/if}
    // So the tail slot (09:30) will contain a filled button but NOT the name text directly?

    // So row0930 should have a button that is filled (we can check class or existence).
    // Let's check that we can find a button in row0930 that acts as a slot but is not the empty one.
    // We can just verify the empty slot is gone, which confirms it's occupied.
    await expect(row0930.locator(`button[aria-label="分配给 09:30"]`)).not.toBeVisible();
  });

  test('should edit patient details', async ({ page }) => {
    const originalName = `EditStart-${Date.now()}`;
    const newName = `EditEnd-${Date.now()}`;

    // 1. Create Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', originalName);
    await page.click('button:has-text("保存")');

    // 2. Find the patient in palette and click edit
    // The edit button might be hidden until hover, so we hover the patient chip first
    const patientChip = page.locator(`button:has-text("${originalName}")`);
    await patientChip.hover();

    // Click the edit icon (aria-label="编辑 {name}")
    await page.click(`div[aria-label="编辑 ${originalName}"]`);

    // 3. Edit Name
    // Use the placeholder selector which is stable
    await page.fill('input[placeholder="例如：张伟"]', newName);

    // 4. Save
    await page.click('button:has-text("保存")');

    // 5. Verify the name changed in the palette
    await expect(page.locator(`button:has-text("${newName}")`)).toBeVisible();
    await expect(page.locator(`button:has-text("${originalName}")`)).not.toBeVisible();
  });

  test('should copy yesterday arrangement', async ({ page }) => {
    const uniqueName = `CopyTest-${Date.now()}`;

    // 1. Create a patient to use
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', uniqueName);
    await page.click('button:has-text("保存")');

    // Select the patient
    const patientBtn = page.locator(`button`, { hasText: uniqueName }).first();
    await patientBtn.click();

    // 2. Go to Yesterday
    await page.click('button[aria-label="前一天"]');

    // 3. Schedule at 08:00
    // Wait for grid to be ready? (Should be instant)
    const slot0800 = page.locator(`button[aria-label="分配给 08:00"]`);
    await slot0800.click();

    // Verify it is there yesterday
    const row0800Yesterday = page.locator('div.group', { has: page.locator(`text="08:00"`) });
    await expect(row0800Yesterday.locator(`text=${uniqueName}`)).toBeVisible();

    // 4. Go back to Today
    await page.click('button[aria-label="后一天"]');

    // Verify 08:00 is empty today
    const slot0800Today = page.locator(`button[aria-label="分配给 08:00"]`);
    await expect(slot0800Today).toBeVisible();

    // 5. Click Copy Yesterday (Header button)
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());

    await page.click('button[title="复制昨日安排"]');

    // 6. Verify 08:00 is now filled today
    const row0800Today = page.locator('div.group', { has: page.locator(`text="08:00"`) });
    await expect(row0800Today.locator(`text=${uniqueName}`)).toBeVisible();
  });

  test('should search for a patient', async ({ page }) => {
    const targetName = `SearchTarget-${Date.now()}`;
    const otherName = `OtherPatient-${Date.now()}`;

    // 1. Create Target Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', targetName);
    await page.click('button:has-text("保存")');

    // 2. Create Other Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', otherName);
    await page.click('button:has-text("保存")');

    // 3. Open Search / List Modal
    await page.click('button[title="搜索 / 查看所有"]');

    // 4. Type in Search Box
    // Placeholder: "搜索姓名或诊断..."
    await page.fill('input[placeholder="搜索姓名或诊断..."]', targetName);

    // 5. Verify Target is Visible and Other is Not
    // The list items are buttons containing the name.
    // We scope to the dialog to avoid finding the buttons in the background palette.
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog.locator(`button`, { hasText: targetName })).toBeVisible();
    await expect(dialog.locator(`button`, { hasText: otherName })).not.toBeVisible();
  });

  test('should split patient list into Arranged and Unarranged sections', async ({ page }) => {
    const arrangedName = `Alice-${Date.now()}`;
    const unarrangedName = `Bob-${Date.now()}`;

    // 1. Create Arranged Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', arrangedName);
    await page.click('button:has-text("保存")');

    // 2. Create Unarranged Patient
    await page.click('button[title="添加患者"]');
    await page.fill('input[placeholder="例如：张伟"]', unarrangedName);
    await page.click('button:has-text("保存")');

    // 3. Arrange the first patient at 08:00
    // Select patient
    const arrangedBtn = page.locator(`button`, { hasText: arrangedName }).first();
    await arrangedBtn.click();

    // Click slot
    const slot0800 = page.locator(`button[aria-label="分配给 08:00"]`);
    await slot0800.click();

    // 4. Open the Patient List Modal
    await page.click('button[title="搜索 / 查看所有"]');
    const dialog = page.locator('div[role="dialog"]');

    // 5. Verify Headers
    // Note: The headers include counts, so we match partial text
    await expect(dialog.locator('text=已安排')).toBeVisible();
    await expect(dialog.locator('text=未安排')).toBeVisible();

    // Verify the arranged name is visible
    await expect(dialog.locator(`button`, { hasText: arrangedName })).toBeVisible();
    // Verify the unarranged name is visible
    await expect(dialog.locator(`button`, { hasText: unarrangedName })).toBeVisible();
  });

  test('should add a temporary patient via time block click', async ({ page }) => {
    const tempName = `TempGuest-${Date.now()}`;
    const targetTime = "11:00";

    // 1. Click on an empty time slot
    const slotButton = page.locator(`button[aria-label="分配给 ${targetTime}"]`);
    await slotButton.click();

    // 2. Wait for modal to appear
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // 3. Handle Prompt for Temp Patient Name
    page.once('dialog', async dialog => {
      await dialog.accept(tempName);
    });

    // 4. Click "Add Temporary Patient"
    await page.click('button:has-text("+ 添加临时患者")');

    // 5. Verify the slot is filled with the temp patient
    const timeRow = page.locator('div.group', { has: page.locator(`text="${targetTime}"`) });
    await expect(timeRow.locator(`text=${tempName}`)).toBeVisible();

    // 6. Verify the temp patient is NOT in the main palette list
    // The palette is the horizontally scrollable area at the top.
    // We can assume if we look for a button with the text in the whole page, 
    // it ideally appears only in the schedule grid, not in the palette area.
    // But to be specific, let's verify it's not in the scrolling header.
    // The palette container has "overflow-x-auto".
    const palette = page.locator('.overflow-x-auto');
    await expect(palette.locator(`button`, { hasText: tempName })).not.toBeVisible();
  });
});
