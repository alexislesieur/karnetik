# K KARNETIK
### Votre carnet d'entretien digital

![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey)
![Status](https://img.shields.io/badge/status-En%20développement-orange)

---

## À propos

**Karnetik** est un carnet d'entretien digital pour voiture, destiné aux particuliers. Il permet de centraliser l'historique complet des entretiens et réparations d'un véhicule — qu'ils soient réalisés chez un professionnel ou à domicile.

> 🔒 Projet privé — usage personnel — aucune donnée n'est vendue.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 11 |
| Frontend | Vue.js 3 + Inertia.js |
| CSS / UI | Tailwind CSS |
| Base de données | PostgreSQL |
| PWA | Vite PWA Plugin |
| Authentification | Laravel Fortify |
| Administration | Interface custom Vue.js |

---

## Architecture multi-domaines

| URL | Usage |
|---|---|
| `karnetik.com` | Site vitrine |
| `auth.karnetik.com` | Authentification |
| `app.karnetik.com` | Application Desktop |
| `mob.karnetik.com` | Application PWA |
| `admin.karnetik.com` | Administration |

---

## Modules V1

- [x] Authentification & profil
- [x] Gestion du véhicule (1 véhicule / compte)
- [x] Suivi des entretiens & réparations
- [x] Suivi carburant
- [x] Back-office Admin

---

## Installation locale

### Prérequis

- PHP 8.4+
- Composer
- Node.js + npm
- PostgreSQL

### Setup

```bash
# Cloner le projet
git clone <repo-url> karnetik
cd karnetik

# Installer les dépendances PHP
composer install

# Installer les dépendances JS
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé applicative
php artisan key:generate

# Configurer la base de données dans .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=karnetik
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Lancer les migrations
php artisan migrate

# Compiler les assets
npm run dev
```

### Lancer le serveur de développement

```bash
php artisan serve
```

---

## Méthodologie — Ticketing

Le développement suit une convention de tickets unitaires :

- **Format** : `KRN-XXX` (numérotation séquentielle)
- **Catégories** : `SETUP` `FEAT` `FIX` `REFACTOR` `DESIGN` `DOC`
- Chaque ticket fait l'objet d'une discussion avant implémentation

---

## Roadmap V1

| Phase | Statut |
|---|---|
| 🎨 Branding & Charte graphique | ✅ Terminé |
| 🏗️ Setup & Architecture | 🔄 En cours |
| 🖥️ UI/UX Design | ⏳ À venir |
| ⚙️ Développement V1 | ⏳ À venir |
| 🧪 Tests & QA | ⏳ À venir |
| 🚀 Lancement V1 | ⏳ À venir |

---

## Politique de données

- ✅ Aucune donnée personnelle vendue à des tiers
- ✅ Aucune publicité ciblée
- ✅ Les données appartiennent à l'utilisateur
- ✅ Conformité RGPD — anonymisation lors de la suppression de compte
- ✅ Véhicule non supprimable — historique préservé pour le prochain propriétaire

---

## Licence

Projet propriétaire — Tous droits réservés © Karnetik 2026.  
Aucune réutilisation ou distribution sans autorisation écrite.

---

*Développé avec ❤️ par Alexis LESIEUR*