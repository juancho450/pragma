# Pragma To-Do App

Aplicación móvil híbrida construida con **Ionic 8 + Angular 20 + Cordova**.

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Ionic | 8 | UI components |
| Angular | 20 | Framework (standalone) |
| Cordova | 13 | Bridge nativo Android/iOS |
| Firebase | 11 | Remote Config |
| @angular/fire | 20 | SDK Firebase para Angular |
| @angular/cdk | 20 | Virtual scrolling |

---

## Prerequisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Ionic CLI | 7.x |
| Cordova CLI | 13.x |
| Android Studio | Quail 1 (2026.1.1) + Build Tools 36+ |
| Xcode | 15+ (macOS requerido para iOS) |
| Java JDK | 17+ |

```bash
npm install -g @ionic/cli cordova native-run cordova-res
```

---

## Instalación

```bash
git clone https://github.com/juancho450/pragma.git
cd pragma
git checkout feature/todo-categories-firebase
npm install
```

---

## Configurar Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Registrar app web y copiar credenciales en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    storageBucket: 'TU_PROYECTO.appspot.com',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID'
  },
  remoteConfigDefaults: {
    show_task_stats: false
  }
};
```

3. En Firebase Console → **Remote Config** → Agregar parámetro:
   - Nombre: `show_task_stats` | Tipo: Boolean | Valor: `false`
   - Publicar cambios

> **Nota:** Antes de cada commit, dejar las credenciales vacías en `environment.ts` y `environment.prod.ts`.

---

## Desarrollo (browser)

```bash
ionic serve
```

Disponible en `http://localhost:8100`

---

## Agregar plataformas nativas

```bash
ionic cordova platform add android
ionic cordova platform add ios   # requiere macOS
```

---

## Compilar APK / IPA

```bash
# Android APK (producción)
npm run build:android

# iOS IPA (producción — requiere macOS + Xcode)
npm run build:ios
```

## Correr en emulador

```bash
npm run run:android   # lanza en emulador Android
npm run run:ios       # lanza en simulador iOS
```

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── models/
│   │   ├── task.model.ts
│   │   └── category.model.ts
│   └── services/
│       ├── task.service.ts
│       ├── category.service.ts
│       └── remote-config.service.ts
├── features/
│   ├── home/               # Lista de tareas
│   └── categories/         # CRUD de categorías
└── shared/
    ├── components/
    │   ├── task-item/
    │   ├── task-stats/
    │   ├── add-task-modal/
    │   └── add-category-modal/
    └── pipes/
        └── category-by-id.pipe.ts
```

---

## Funcionalidades implementadas

- Agregar, completar y eliminar tareas (con confirmación)
- Crear, editar y eliminar (con confirmación) categorías con color picker
- Asignar categoría a cada tarea
- Filtrar tareas por categoría
- Feature flag `show_task_stats` vía Firebase Remote Config:
  - `false` → barra de estadísticas oculta
  - `true` → muestra Total / Pendientes / Completadas / % progreso

---

## Preguntas de la prueba técnica

### ¿Cuáles fueron los principales desafíos?

El primero fue configurar Ionic con Cordova desde cero. Normalmente trabajo con Capacitor, que es el runtime nativo oficial actual de Ionic y tiene una configuración mucho más directa. Con Cordova tuve que entender cómo empaqueta la app web dentro de una app nativa, cómo se configura mediante el archivo `config.xml`, cómo se agregan las plataformas y por qué el build nativo requiere herramientas adicionales como Gradle para Android o Xcode para iOS. Además, la versión actual de `cordova-android@15` tiene incompatibilidades con Gradle 9 y Groovy 4 (el lenguaje de los scripts de build de Android) que requirieron investigación y ajuste puntual.

El segundo fue implementar Firebase Remote Config, que no había usado antes. Entender cómo funciona el ciclo de fetch y activate, cómo configurar los valores por defecto, y cómo integrarlo correctamente con Angular 20 (que deprecó `APP_INITIALIZER` en favor de `provideAppInitializer`) fue un proceso de aprendizaje durante el desarrollo. El desafío más concreto fue que Firebase no estaba inicializado en el momento en que el servicio intentaba acceder a él, lo que se resolvió inyectando el `FirebaseApp` a través del sistema de dependencias de Angular en lugar de usar `getApp()` del SDK directamente.

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

| Técnica | Motivo |
|---|---|
| `ChangeDetectionStrategy.OnPush` | Angular por defecto revisa todos los componentes en cada evento. Con OnPush solo revisa cuando cambia una entrada o emite un observable, lo que reduce drásticamente el trabajo en el árbol de componentes. |
| Lazy loading de rutas | El bundle inicial solo carga el código necesario para la primera pantalla. Las demás rutas se cargan bajo demanda, lo que acelera el tiempo de carga inicial. |
| `async` pipe | Maneja la suscripción y cancelación automáticamente. Sin él, habría que gestionar manualmente el `unsubscribe`, lo que es una fuente común de memory leaks. |
| `CategoryByIdPipe` (pure) | Reemplazó una llamada a método en el template. Angular re-ejecuta los métodos en cada ciclo de detección, pero un pipe puro solo se re-ejecuta cuando cambian sus argumentos. |
| `cdk-virtual-scroll-viewport` | Solo renderiza en el DOM los elementos visibles en pantalla. Con 1000 tareas, el DOM tiene ~10 nodos en vez de 1000, lo que impacta directamente en memoria y fluidez del scroll. |
| `trackByTaskId` | Le dice al motor de rendering cómo identificar cada ítem de la lista. Sin esto, Angular destruye y recrea todos los nodos al actualizar la lista aunque solo haya cambiado uno. |

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

- **Arquitectura `core/feature/shared`**: separar el código en estas tres capas hace que cada parte tenga una responsabilidad clara. `core` tiene los servicios y modelos que son globales, `features` tiene las páginas, y `shared` tiene los componentes y pipes reutilizables. Esto facilita encontrar cualquier cosa y evita que el código crezca de forma desordenada.

- **Servicios con `BehaviorSubject`**: el estado de tareas y categorías vive dentro del servicio y solo se puede modificar a través de sus métodos. Los componentes no pueden mutar el estado directamente, lo que hace el flujo de datos predecible y fácil de rastrear cuando algo falla.

- **Standalone components**: cada componente declara explícitamente qué necesita para funcionar. No hay un módulo central que importe todo de forma masiva, lo que hace más fácil entender las dependencias de cada pieza y permite que Angular elimine código no usado en el bundle de producción.

- **TypeScript estricto**: con `strict: true` activado, el compilador obliga a manejar casos nulos, a tipar correctamente las funciones y a no dejar variables sin inicializar. Esto atrapa errores en tiempo de compilación que de otra forma aparecerían en runtime.

- **Interfaces tipadas**: usar `Task` y `Category` como interfaces en lugar de `any` permite que el IDE y el compilador detecten usos incorrectos automáticamente, y sirve como documentación viva de la estructura de datos.

- **Conventional Commits**: el historial de git usa prefijos como `feat:`, `perf:`, `docs:` que permiten entender qué cambió en cada commit sin necesidad de leer el diff.
