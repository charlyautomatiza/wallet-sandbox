import { test, expect } from '@playwright/test';

test.describe('Transferencias Programadas', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3002');
  });

  test('debería mostrar transferencias programadas en la página principal', async ({ page }) => {
    // Verificar que se muestran las transferencias programadas próximas
    await expect(page.getByTestId('upcoming-transfers-section')).toBeVisible();
    await expect(page.getByTestId('upcoming-transfers-title')).toContainText('Próximas transferencias');
    
    // Verificar que hay al menos una transferencia próxima
    await expect(page.getByTestId('upcoming-transfers-list')).toBeVisible();
  });

  test('debería navegar a la página de transferencias programadas', async ({ page }) => {
    // Click en "Ver todas" las transferencias programadas
    await page.getByTestId('view-all-scheduled-link').click();
    
    // Verificar que navegó a la página correcta
    await expect(page).toHaveURL(/.*\/transfer\/scheduled/);
    await expect(page.getByTestId('page-title')).toContainText('Transferencias programadas');
  });

  test('debería permitir programar una nueva transferencia', async ({ page }) => {
    // Navegar a transferencias
    await page.getByTestId('transfer-button').click();
    await expect(page).toHaveURL(/.*\/transfer/);

    // Seleccionar un contacto
    await page.getByText('Elyer Saitest').click();

    // Ingresar monto
    await page.getByTestId('amount-input').fill('15000');

    // Click en "Programar para más tarde"
    await page.getByTestId('schedule-button').click();

    // Verificar que llegó a la página de programación
    await expect(page).toHaveURL(/.*\/schedule/);
    await expect(page.getByTestId('schedule-title')).toContainText('Programar transferencia');

    // Completar el formulario de programación
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    await page.getByTestId('date-picker').fill(tomorrowString);
    await page.getByTestId('frequency-select').selectOption('once');
    await page.getByTestId('reason-select').selectOption('Alquiler');
    await page.getByTestId('comment-input').fill('Pago de alquiler mensual');

    // Programar la transferencia
    await page.getByTestId('schedule-transfer-button').click();

    // Verificar que llega a la página de éxito
    await expect(page).toHaveURL(/.*\/schedule\/success/);
    await expect(page.getByTestId('success-title')).toContainText('Transferencia programada con éxito');
  });

  test('debería mostrar el flujo completo de transferencia inmediata vs programada', async ({ page }) => {
    // Navegar a transferencias
    await page.getByTestId('transfer-button').click();

    // Seleccionar contacto
    await page.getByText('María González').click();

    // Ingresar monto
    await page.getByTestId('amount-input').fill('10000');

    // Verificar que ambas opciones están disponibles
    await expect(page.getByTestId('continue-button')).toBeVisible();
    await expect(page.getByTestId('continue-button')).toContainText('Transferir ahora');
    
    await expect(page.getByTestId('schedule-button')).toBeVisible();
    await expect(page.getByTestId('schedule-button')).toContainText('Programar para más tarde');

    // Probar el flujo inmediato
    await page.getByTestId('continue-button').click();
    await expect(page).toHaveURL(/.*\/confirm/);
  });
});

test.describe('Gestión de Transferencias Programadas', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar directamente a transferencias programadas
    await page.goto('http://localhost:3002/transfer/scheduled');
  });

  test('debería mostrar la lista de transferencias programadas', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Transferencias programadas');
    
    // Verificar que se muestran las transferencias o el estado vacío
    const transfersList = page.getByTestId('transfers-list');
    const emptyState = page.getByTestId('empty-state');
    
    // Debe mostrar una de las dos opciones
    const hasTransfers = await transfersList.isVisible().catch(() => false);
    const isEmpty = await emptyState.isVisible().catch(() => false);
    
    expect(hasTransfers || isEmpty).toBe(true);
  });

  test('debería mostrar alerta de transferencias próximas si las hay', async ({ page }) => {
    // Si hay transferencias próximas, debe mostrar la alerta
    const alert = page.getByTestId('upcoming-transfers-alert');
    const alertVisible = await alert.isVisible().catch(() => false);
    
    if (alertVisible) {
      await expect(alert).toContainText('Próximas transferencias');
    }
  });
});
