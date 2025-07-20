# Backlog - Wallet Sandbox

## Visión General del Producto

Wallet Sandbox es una aplicación de billetera digital que permite a los usuarios gestionar sus finanzas personales, realizar transferencias, administrar tarjetas, solicitar dinero y acceder a diversos servicios financieros desde una web.

## Estado Actual

La aplicación actualmente cuenta con las siguientes funcionalidades implementadas:

- Panel principal con visualización de saldo y movimientos
- Sistema de transferencias entre usuarios
- Gestión básica de tarjetas
- Solicitud de dinero
- Sistema de autenticación (simulado)

## Backlog de Producto

### Épicas

1. [EP-01] **Sistema de Autenticación y Seguridad**
2. [EP-02] **Gestión de Cuentas y Saldos**
3. [EP-03] **Transferencias y Pagos**
4. [EP-04] **Sistema de Inversiones**
5. [EP-05] **Pagos de Servicios**
6. [EP-06] **Funcionalidades de Negocios**
7. [EP-07] **Sistema de Créditos**
8. [EP-08] **Sistema Multi-divisa**
9. [EP-09] **Programa de Lealtad y Recompensas**
10. [EP-10] **Mejoras de UX y Accesibilidad**

---

## Historias de Usuario

### [EP-01] Sistema de Autenticación y Seguridad

#### [US-101] Autenticación Biométrica
**Como** usuario de la wallet  
**Quiero** poder acceder a la aplicación mediante mi huella digital o reconocimiento facial  
**Para** agilizar el inicio de sesión de manera segura  
**Criterios de Aceptación:**
- La aplicación debe permitir configurar el acceso biométrico
- Debe funcionar con huellas dactilares y reconocimiento facial
- Debe ofrecer fallback a PIN/contraseña en caso de fallos

**Tareas:**
- Integrar APIs biométricas del sistema operativo
- Implementar almacenamiento seguro de credenciales
- Desarrollar flujo de configuración de biometría
- Crear pantalla de fallback

#### [US-102] Autenticación en Dos Factores
**Como** usuario de la wallet  
**Quiero** tener la opción de activar verificación en dos pasos  
**Para** incrementar la seguridad de mi cuenta  
**Criterios de Aceptación:**
- Debe permitir activar/desactivar 2FA
- Debe soportar autenticación por SMS y app autenticadora
- Debe generar códigos de recuperación

**Tareas:**
- Implementar generación de tokens TOTP
- Desarrollar integración con servicios SMS
- Crear flujo de configuración de 2FA
- Implementar sistema de códigos de recuperación

#### [US-103] Sistema de Bloqueo de Cuenta
**Como** usuario de la wallet  
**Quiero** poder bloquear mi cuenta temporalmente  
**Para** proteger mi dinero en caso de pérdida de dispositivo  
**Criterios de Aceptación:**
- Debe permitir bloqueo desde otro dispositivo
- Debe enviar notificación de bloqueo por email
- Debe tener proceso de desbloqueo con verificación

**Tareas:**
- Implementar API de bloqueo remoto
- Crear flujo de bloqueo temporal
- Desarrollar sistema de notificaciones de seguridad
- Implementar proceso de desbloqueo verificado

### [EP-02] Gestión de Cuentas y Saldos

#### [US-201] Metas de Ahorro
**Como** usuario de la wallet  
**Quiero** crear objetivos de ahorro personalizados  
**Para** organizar mejor mis finanzas personales  
**Criterios de Aceptación:**
- Debe permitir definir monto objetivo y fecha límite
- Debe mostrar progreso visual de la meta
- Debe permitir aportes automáticos y manuales
- Debe enviar notificaciones de seguimiento

**Tareas:**
- Diseñar modelos de datos para metas de ahorro
- Implementar pantalla de creación de metas
- Desarrollar visualización de progreso con gráficos
- Crear sistema de aportes automáticos
- Implementar notificaciones de seguimiento

#### [US-202] Categorización Automática de Gastos
**Como** usuario de la wallet  
**Quiero** que mis transacciones se categoricen automáticamente  
**Para** entender mejor mis patrones de gasto  
**Criterios de Aceptación:**
- Debe clasificar transacciones por tipo de comercio
- Debe permitir recategorizar manualmente
- Debe aprender de correcciones manuales
- Debe generar reportes por categoría

**Tareas:**
- Implementar algoritmo de categorización
- Desarrollar base de datos de comercios y categorías
- Crear interfaz para ajustes manuales
- Implementar sistema de aprendizaje

#### [US-203] Reportes Financieros
**Como** usuario de la wallet  
**Quiero** acceder a reportes detallados de mis finanzas  
**Para** tener mejor control de mis ingresos y gastos  
**Criterios de Aceptación:**
- Debe mostrar gráficos de gastos por categoría
- Debe permitir filtrar por periodo de tiempo
- Debe ofrecer comparativas con meses anteriores
- Debe permitir exportar en formatos comunes

**Tareas:**
- Diseñar dashboard financiero
- Implementar generación de gráficos
- Desarrollar filtros temporales
- Crear funcionalidad de exportación

### [EP-03] Transferencias y Pagos

#### [US-301] Transferencias Programadas
**Como** usuario de la wallet  
**Quiero** programar transferencias recurrentes  
**Para** automatizar pagos periódicos  
**Criterios de Aceptación:**
- Debe permitir definir frecuencia (diaria, semanal, mensual)
- Debe enviar recordatorios antes de ejecutar
- Debe permitir cancelar/modificar programaciones
- Debe mostrar historial de transferencias programadas

**Tareas:**
- Implementar en transferencias la opción de seleccionar una fecha del futuro
- Desarrollar motor de ejecución automática
- Crear interfaz de gestión de programaciones
- Implementar sistema de notificaciones

#### [US-302] Grupos de Gastos Compartidos
**Como** usuario de la wallet  
**Quiero** crear grupos para compartir gastos  
**Para** facilitar la división de cuentas con amigos o familiares  
**Criterios de Aceptación:**
- Debe permitir crear grupos e invitar usuarios
- Debe calcular automáticamente saldos entre miembros
- Debe registrar quién pagó cada gasto
- Debe facilitar la liquidación de saldos

**Tareas:**
- Diseñar modelo de datos para grupos y gastos compartidos
- Implementar sistema de invitaciones
- Desarrollar algoritmo de cálculo de saldos
- Crear interfaz de gestión de grupos

#### [US-303] Mejoras en Transferencias QR
**Como** usuario de la wallet  
**Quiero** poder generar y escanear códigos QR para transferencias  
**Para** realizar pagos de forma rápida y segura  
**Criterios de Aceptación:**
- Debe generar QR con monto predefinido o abierto
- Debe permitir incluir concepto en el QR
- Debe validar la seguridad del código escaneado
- Debe funcionar sin conexión a internet

**Tareas:**
- Implementar generación de QR con encriptación
- Integrar biblioteca de escaneo QR
- Desarrollar validación de seguridad
- Crear flujo de pago mediante QR

### [EP-04] Sistema de Inversiones

#### [US-401] Plataforma de Inversiones
**Como** usuario de la wallet  
**Quiero** poder invertir mi dinero en diferentes instrumentos financieros  
**Para** generar rendimientos  
**Criterios de Aceptación:**
- Debe mostrar opciones de inversión disponibles
- Debe explicar claramente riesgos y rendimientos estimados
- Debe permitir invertir y retirar fondos
- Debe mostrar rendimientos en tiempo real

**Tareas:**
- Diseñar catálogo de instrumentos financieros
- Implementar simulador de rendimientos
- Desarrollar flujo de inversión y retiro
- Crear dashboard de seguimiento

#### [US-402] Plazo Fijo Digital
**Como** usuario de la wallet  
**Quiero** poder crear plazos fijos desde la aplicación  
**Para** obtener rendimientos con bajo riesgo  
**Criterios de Aceptación:**
- Debe permitir seleccionar plazo y monto
- Debe mostrar interés a ganar al vencimiento
- Debe notificar cerca del vencimiento
- Debe ofrecer renovación automática

**Tareas:**
- Implementar calculadora de intereses
- Desarrollar flujo de creación de plazo fijo
- Crear sistema de notificaciones de vencimiento
- Implementar funcionalidad de renovación

#### [US-403] Fondos Comunes de Inversión
**Como** usuario de la wallet  
**Quiero** poder invertir en fondos comunes de inversión  
**Para** diversificar mi cartera con diferentes niveles de riesgo  
**Criterios de Aceptación:**
- Debe clasificar fondos por nivel de riesgo
- Debe mostrar composición y rendimiento histórico
- Debe permitir suscripción y rescate
- Debe actualizar valor de cuotas parte diariamente

**Tareas:**
- Implementar catálogo de fondos disponibles
- Desarrollar visualización de rendimientos históricos
- Crear flujo de suscripción y rescate
- Implementar actualización automática de valores

### [EP-05] Pagos de Servicios

#### [US-501] Pago de Servicios e Impuestos
**Como** usuario de la wallet  
**Quiero** pagar mis servicios e impuestos desde la aplicación  
**Para** centralizar mis pagos en un solo lugar  
**Criterios de Aceptación:**
- Debe permitir buscar empresas por nombre o rubro
- Debe soportar ingreso manual y escaneo de códigos de barras
- Debe permitir agendar servicios frecuentes
- Debe generar y almacenar comprobantes

**Tareas:**
- Implementar directorio de empresas y servicios
- Integrar lector de códigos de barras
- Desarrollar sistema de comprobantes digitales
- Crear funcionalidad de servicios favoritos

#### [US-502] Pagos Programados y Recurrentes
**Como** usuario de la wallet  
**Quiero** programar pagos recurrentes de servicios  
**Para** no olvidar fechas de vencimiento  
**Criterios de Aceptación:**
- Debe permitir configurar frecuencia y monto máximo
- Debe notificar antes del pago automático
- Debe permitir activar/desactivar por servicio
- Debe mostrar historial de pagos automáticos

**Tareas:**
- Implementar sistema de pagos programados
- Desarrollar motor de ejecución automática
- Crear sistema de notificaciones previas
- Implementar panel de control de pagos recurrentes

#### [US-503] Recordatorios de Vencimientos
**Como** usuario de la wallet  
**Quiero** recibir alertas de vencimientos próximos  
**Para** evitar recargos por pagos fuera de término  
**Criterios de Aceptación:**
- Debe permitir configurar días de anticipación
- Debe mostrar monto estimado a pagar
- Debe ofrecer opción de pago directo desde la notificación
- Debe sincronizarse con calendario del dispositivo

**Tareas:**
- Implementar sistema de recordatorios
- Desarrollar estimación de montos basada en historial
- Crear notificaciones accionables
- Implementar integración con calendario

### [EP-06] Funcionalidades de Negocios

#### [US-601] Perfil de Negocio
**Como** dueño de un negocio  
**Quiero** configurar un perfil comercial en la aplicación  
**Para** gestionar cobros digitales  
**Criterios de Aceptación:**
- Debe permitir configurar datos fiscales
- Debe ofrecer diferentes categorías de negocio
- Debe permitir horarios de atención
- Debe generar perfil público para clientes

**Tareas:**
- Diseñar modelo de datos para perfiles comerciales
- Implementar sistema de categorías de negocios
- Crear flujo de configuración de negocio
- Desarrollar perfiles públicos

#### [US-602] Punto de Venta Digital
**Como** dueño de un negocio  
**Quiero** tener un sistema de punto de venta en la app  
**Para** gestionar ventas y cobros digitales  
**Criterios de Aceptación:**
- Debe permitir crear catálogo de productos
- Debe generar QR de cobro dinámico
- Debe registrar ventas y generar reportes
- Debe sincronizarse con inventario

**Tareas:**
- Implementar catálogo de productos
- Desarrollar generación de QR de cobro
- Crear sistema de registro de ventas
- Implementar reportes de ventas

#### [US-603] Gestión de Empleados
**Como** dueño de un negocio  
**Quiero** gestionar permisos para mis empleados  
**Para** delegarles funciones específicas  
**Criterios de Aceptación:**
- Debe permitir crear usuarios con diferentes niveles de acceso
- Debe registrar qué empleado realizó cada operación
- Debe permitir limitar montos por empleado
- Debe generar reportes de actividad

**Tareas:**
- Implementar sistema de roles y permisos
- Desarrollar registro de actividad por usuario
- Crear configuración de límites por empleado
- Implementar reportes de actividad

### [EP-07] Sistema de Créditos

#### [US-701] Préstamos Personales
**Como** usuario de la wallet  
**Quiero** poder solicitar préstamos personales  
**Para** financiar gastos importantes  
**Criterios de Aceptación:**
- Debe prevalidar elegibilidad sin afectar score crediticio
- Debe ofrecer diferentes plazos y montos
- Debe mostrar claramente tasas y costos totales
- Debe permitir cancelación anticipada

**Tareas:**
- Implementar algoritmo de evaluación crediticia
- Desarrollar simulador de préstamos
- Crear flujo de solicitud y aprobación
- Implementar gestión de cuotas y pagos

#### [US-702] Adelanto de Sueldo
**Como** usuario de la wallet  
**Quiero** poder adelantar parte de mi sueldo  
**Para** cubrir gastos imprevistos  
**Criterios de Aceptación:**
- Debe validar ingresos recurrentes
- Debe permitir adelantar hasta cierto porcentaje
- Debe descontar automáticamente al recibir próximo sueldo
- Debe mostrar claramente costos asociados

**Tareas:**
- Implementar detección de ingresos recurrentes
- Desarrollar cálculo de montos disponibles
- Crear flujo de solicitud de adelanto
- Implementar sistema de descuento automático

#### [US-703] Tarjetas de Crédito Virtuales
**Como** usuario de la wallet  
**Quiero** generar tarjetas virtuales con límites específicos  
**Para** compras online más seguras  
**Criterios de Aceptación:**
- Debe permitir generar tarjetas de un solo uso
- Debe permitir establecer límites de monto
- Debe registrar qué comercio utilizó cada tarjeta
- Debe permitir bloquear tarjetas específicas

**Tareas:**
- Implementar generación de números de tarjeta virtuales
- Desarrollar sistema de límites y restricciones
- Crear registro de uso y seguimiento
- Implementar bloqueo inmediato

### [EP-08] Sistema Multi-divisa

#### [US-801] Cuenta en Dólares
**Como** usuario de la wallet  
**Quiero** poder manejar saldo en dólares  
**Para** diversificar mis ahorros  
**Criterios de Aceptación:**
- Debe mostrar cotización actualizada
- Debe permitir compra/venta de dólares
- Debe permitir transferencias en la misma moneda
- Debe generar comprobantes de operaciones

**Tareas:**
- Implementar sistema multi-cuenta con diferentes divisas
- Integrar servicio de cotizaciones en tiempo real
- Desarrollar flujo de compra/venta de dólares
- Crear sistema de comprobantes digitales

#### [US-802] Alertas de Tipo de Cambio
**Como** usuario de la wallet  
**Quiero** configurar alertas de variaciones en el tipo de cambio  
**Para** operar en momentos convenientes  
**Criterios de Aceptación:**
- Debe permitir configurar umbrales personalizados
- Debe notificar cuando se alcance el umbral
- Debe mostrar histórico de cotizaciones
- Debe permitir operación directa desde la alerta

**Tareas:**
- Implementar sistema de alertas configurables
- Desarrollar monitoreo continuo de cotizaciones
- Crear notificaciones accionables
- Implementar visualización de históricos

#### [US-803] Transferencias Internacionales
**Como** usuario de la wallet  
**Quiero** poder realizar transferencias internacionales  
**Para** enviar dinero al exterior  
**Criterios de Aceptación:**
- Debe mostrar comisiones y tiempo estimado
- Debe permitir seleccionar moneda de destino
- Debe mostrar estado de la transferencia en tiempo real
- Debe notificar al remitente y receptor

**Tareas:**
- Integrar servicio de transferencias internacionales
- Implementar cálculo de comisiones
- Desarrollar sistema de seguimiento de transferencias
- Crear sistema de notificaciones

### [EP-09] Programa de Lealtad y Recompensas

#### [US-901] Sistema de Puntos por Uso
**Como** usuario de la wallet  
**Quiero** acumular puntos al usar la aplicación  
**Para** obtener beneficios adicionales  
**Criterios de Aceptación:**
- Debe otorgar puntos por diferentes acciones
- Debe mostrar claramente el balance de puntos
- Debe notificar cuando se ganan puntos
- Debe explicar cómo ganar más puntos

**Tareas:**
- Implementar sistema de asignación de puntos
- Desarrollar visualización de saldo y movimientos
- Crear sistema de notificaciones de puntos
- Implementar catálogo de acciones bonificadas

#### [US-902] Catálogo de Recompensas
**Como** usuario de la wallet  
**Quiero** poder canjear mis puntos por recompensas  
**Para** obtener beneficios tangibles  
**Criterios de Aceptación:**
- Debe mostrar catálogo con diferentes opciones
- Debe permitir filtrar por categoría y puntos requeridos
- Debe mostrar disponibilidad en tiempo real
- Debe generar vouchers digitales canjeables

**Tareas:**
- Implementar catálogo de recompensas
- Desarrollar sistema de filtros y búsqueda
- Crear flujo de canje de puntos
- Implementar generación de vouchers digitales

#### [US-903] Programa de Referidos
**Como** usuario de la wallet  
**Quiero** invitar a amigos y obtener beneficios  
**Para** ampliar mi red y ganar recompensas  
**Criterios de Aceptación:**
- Debe generar códigos de invitación personalizados
- Debe rastrear instalaciones y registros completos
- Debe bonificar tanto al referidor como al referido
- Debe mostrar estado de referidos pendientes/completados

**Tareas:**
- Implementar generación de códigos únicos
- Desarrollar sistema de seguimiento de conversiones
- Crear mecanismo de bonificación dual
- Implementar dashboard de seguimiento de referidos

### [EP-10] Mejoras de UX y Accesibilidad

#### [US-1001] Modo Oscuro
**Como** usuario de la wallet  
**Quiero** poder activar un modo oscuro  
**Para** reducir la fatiga visual y ahorrar batería  
**Criterios de Aceptación:**
- Debe permitir cambiar entre modo claro y oscuro
- Debe seguir preferencias del sistema
- Debe mantener alto contraste para accesibilidad
- Debe recordar la preferencia del usuario

**Tareas:**
- Implementar sistema de temas
- Desarrollar paletas de color para modo oscuro
- Crear ajustes de preferencias
- Implementar detección de preferencias del sistema

#### [US-1002] Atajos Personalizados
**Como** usuario de la wallet  
**Quiero** personalizar los accesos rápidos  
**Para** acceder más fácilmente a mis funciones más usadas  
**Criterios de Aceptación:**
- Debe permitir elegir funciones favoritas
- Debe permitir reordenar atajos
- Debe sugerir atajos basados en uso
- Debe permitir restablecer configuración predeterminada

**Tareas:**
- Implementar sistema de atajos configurables
- Desarrollar algoritmo de sugerencias
- Crear interfaz de arrastrar y soltar para ordenar
- Implementar almacenamiento de preferencias

#### [US-1003] Asistente por Voz
**Como** usuario de la wallet  
**Quiero** poder realizar operaciones por comandos de voz  
**Para** usar la app de forma más accesible  
**Criterios de Aceptación:**
- Debe reconocer comandos básicos en español
- Debe confirmar verbalmente antes de ejecutar acciones críticas
- Debe funcionar sin necesidad de conexión a internet
- Debe ser compatible con lectores de pantalla

**Tareas:**
- Integrar biblioteca de reconocimiento de voz
- Desarrollar conjunto de comandos y acciones
- Crear sistema de confirmación verbal
- Implementar compatibilidad con accesibilidad

---

## Plan de Pruebas

### 1. Pruebas Funcionales

#### Registro y Autenticación
- Verificar proceso de registro de nuevos usuarios
- Validar inicio de sesión con credenciales correctas/incorrectas
- Comprobar recuperación de contraseña
- Validar bloqueo tras intentos fallidos

#### Saldo y Movimientos
- Verificar visualización correcta del saldo disponible
- Validar función mostrar/ocultar saldo
- Comprobar actualización de saldo tras transacciones
- Verificar filtrado de movimientos

#### Transferencias
- Validar búsqueda y selección de contactos
- Comprobar validación de montos (mínimo, máximo, formato)
- Verificar proceso completo de transferencia
- Validar actualización de saldo post-transferencia

#### Tarjetas
- Verificar visualización correcta de tarjetas
- Validar navegación entre tarjetas
- Comprobar información mostrada para cada tarjeta

### 2. Pruebas No Funcionales

#### Rendimiento
- Validar tiempos de respuesta en operaciones críticas
- Comprobar comportamiento con conexión lenta
- Verificar funcionamiento offline de funciones clave

#### Seguridad
- Validar encriptación de datos sensibles
- Comprobar expiración de sesiones
- Verificar protección contra inyección y XSS

#### Usabilidad
- Validar experiencia en diferentes tamaños de pantalla
- Comprobar accesibilidad según estándares WCAG
- Verificar contraste de colores y legibilidad

---

## Tareas de Automatización de UI

### 1. Configuración de Framework
- Seleccionar e instalar framework (Playwright)
- Configurar entorno de pruebas
- Crear estructura base del proyecto

### 2. Pruebas de Login/Registro
- Automatizar inicio de sesión exitoso
- Automatizar validaciones de campos
- Automatizar mensajes de error

### 3. Pruebas de Home
- Automatizar verificación de elementos en home
- Automatizar función mostrar/ocultar saldo
- Automatizar navegación a funcionalidades principales

### 4. Pruebas de Transferencias
- Automatizar flujo completo de transferencia
- Automatizar búsqueda y selección de contactos
- Automatizar validaciones de montos

### 5. Pruebas de Tarjetas
- Automatizar navegación entre tarjetas
- Automatizar verificación de información
- Automatizar acciones disponibles

### 6. Reportes e Integración
- Configurar generación automática de reportes
- Implementar capturas en fallos
- Configurar integración en CI/CD

---

## Priorización

### Alta (Próximo Sprint)
- [US-301] Transferencias Programadas
- [US-503] Recordatorios de Vencimientos
- [US-101] Autenticación Biométrica
- [US-201] Metas de Ahorro

### Media (2-3 Sprints)
- [US-403] Fondos Comunes de Inversión
- [US-501] Pago de Servicios e Impuestos
- [US-602] Punto de Venta Digital
- [US-801] Cuenta en Dólares

### Baja (4+ Sprints)
- [US-703] Tarjetas de Crédito Virtuales
- [US-903] Programa de Referidos
- [US-1003] Asistente por Voz
- [US-803] Transferencias Internacionales

---

## Métricas de Seguimiento

- Velocidad del equipo (story points/sprint)
- Cobertura de pruebas automatizadas
- Tasa de errores post-implementación
- Tiempo medio de resolución de bugs
- Satisfacción del usuario (NPS)

Este backlog será revisado y actualizado al inicio de cada sprint para asegurar que refleje las prioridades actuales del proyecto y las necesidades de los usuarios.
