# Tests de Automatización - Wallet Sandbox

Este directorio contiene pruebas automatizadas usando Playwright para el proyecto Wallet Sandbox.

## Estructura

\`\`\`
tests/
├── fixtures/     # Datos de prueba y fixtures comunes
├── pages/        # Page Object Models
├── utils/        # Funciones de utilidad
├── api/          # Pruebas de API
└── specs/        # Especificaciones de prueba organizadas por módulo
    ├── auth/     # Pruebas de autenticación
    └── transfer/ # Pruebas de transferencia
\`\`\`

## Ejecutar pruebas

Para ejecutar todas las pruebas:

\`\`\`bash
npx playwright test
\`\`\`

Para ejecutar pruebas específicas:

\`\`\`bash
npx playwright test tests/specs/auth
\`\`\`

Para ejecutar en un navegador específico:

\`\`\`bash
npx playwright test --project=chromium
\`\`\`

Para ejecutar en modo UI (interfaz visual):

\`\`\`bash
npx playwright test --ui
\`\`\`

## Ver reportes

Para ver el reporte HTML después de ejecutar las pruebas:

\`\`\`bash
npx playwright show-report
\`\`\`

## Estándares de Desarrollo

Este proyecto sigue los estándares definidos en `PLAYWRIGHT_STANDARDS.md`. Asegúrate de leerlo antes de contribuir.

Principales estándares:
1. Usar TypeScript para todos los archivos (extensión `.ts`)
2. Seguir el patrón Page Object Model (POM)
3. Asegurar que las pruebas sean independientes entre sí
4. Usar localizadores basados en roles para accesibilidad
5. Estructurar pruebas con el patrón AAA (Arrange-Act-Assert)
