# Pragma To-Do App

Aplicación móvil híbrida construida con **Ionic 8 + Angular 20 + Cordova**.

## Stack

- Ionic 8
- Angular 20
- Cordova (bridge nativo Android / iOS)
- Firebase + Remote Config
- LocalStorage (persistencia de tareas)

## Prerequisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js | 18.x |
| npm | 9.x |
| Ionic CLI | 7.x |
| Cordova CLI | 12.x |
| Android Studio | Hedgehog+ (para APK) |
| Xcode | 15+ macOS (para IPA) |

```bash
npm install -g @ionic/cli cordova
```

## Instalación

```bash
git clone <repo-url>
cd pragma-todo-app
npm install
```

## Desarrollo (browser)

```bash
ionic serve
```

## Agregar plataformas nativas

```bash
# Android
ionic cordova platform add android

# iOS (requiere macOS + Xcode)
ionic cordova platform add ios
```

## Compilar

```bash
# Android APK (debug)
ionic cordova build android

# Android APK (release)
npm run cordova:build:android

# iOS IPA (requiere macOS + Xcode)
npm run cordova:build:ios
```

## Ejecutar en emulador / dispositivo

```bash
# Android
ionic cordova run android --emulator

# iOS
ionic cordova run ios --emulator
```

## Estructura del proyecto

```
src/
├── app/
│   ├── home/           # Página principal
│   ├── app.module.ts
│   └── app-routing.module.ts
├── environments/
│   ├── environment.ts       # Config desarrollo
│   └── environment.prod.ts  # Config producción
└── assets/
config.xml                   # Configuración Cordova
```
