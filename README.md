# Menu Interactive - Frontend

Interface d'administration pour la gestion de menus de restaurant.

## Stack technique

- **Framework**: Angular 19 (Standalone)
- **CSS**: Tailwind CSS
- **i18n**: ngx-translate (FR/EN)
- **HTTP**: Angular HttpClient

## Installation

```bash
npm install
```

## Configuration

L'API URL est configurée dans `src/environments/environment.ts` pour le développement et `environment.prod.ts` pour la production.

## Lancement

```bash
# Développement
npm start
# ou
ng serve

# Production build
npm run build
```

L'application sera disponible sur `http://localhost:4200`

## Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/        # Auth guards
│   │   ├── interceptors/  # HTTP interceptors
│   │   └── services/      # API services
│   ├── features/
│   │   ├── auth/          # Login
│   │   ├── dashboard/     # Layout + Home
│   │   ├── menus/         # CRUD menus
│   │   ├── categories/    # CRUD catégories
│   │   └── dishes/        # CRUD plats
│   └── shared/            # Composants partagés
├── assets/
│   └── i18n/              # Fichiers de traduction
└── environments/          # Configuration par environnement
```

## Fonctionnalités

- **Authentification**: Login avec JWT
- **Dashboard**: Vue d'ensemble avec stats
- **Menus**: Création, édition, suppression
- **Catégories**: Gestion par menu
- **Plats**: Gestion avec upload d'images et tags
- **i18n**: Interface FR/EN

## Traductions

Les fichiers de traduction sont dans `src/assets/i18n/`:
- `fr.json` - Français (par défaut)
- `en.json` - Anglais

## Connexion avec le backend

Le frontend communique avec le backend via l'API REST. Assurez-vous que le backend est lancé sur le port configuré (par défaut `http://localhost:3000`).

Les tokens JWT sont stockés en localStorage et automatiquement ajoutés aux requêtes via l'interceptor.
