# 🛡️ Application de Gestion des EPI

Cette application web permet de gérer les Équipements de Protection Individuelle (EPI) au sein d'une entreprise. Elle offre une gestion centralisée des rôles, du stock, des affectations et des attributions de matériel.

## ⚙️ Technologies utilisées

- **Laravel 10** – Backend (API REST)
- **React + Vite** – Frontend
- **TypeScript** – Typage statique du frontend
- **Tailwind CSS** – Framework CSS utilitaire
- **MySQL** – Base de données
- **Composer** – Gestion des dépendances PHP
- **NPM** – Gestion des packages JS

---

## 🚀 Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/atigui/Gestionnaire-EPI.git
cd Gestionnaire-EPI
```

### 2. Installer le backend Laravel

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configurer la base de données dans .env
php artisan migrate --seed
php artisan serve
```

> L’API sera disponible sur : `http://127.0.0.1:8000`

### 3. Installer le frontend React

```bash
cd ../frontend
npm install
```

Créer un fichier `.env.local` à la racine du dossier `frontend` avec :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Puis lancer le serveur :

```bash
npm run dev
```

> L’interface sera disponible sur : `http://localhost:5173`

---

## 🔐 Redirection après connexion

Après authentification, chaque utilisateur est automatiquement redirigé vers son interface spécifique :
- **Admin** → Tableau de bord administrateur
- **Affecteur** → Interface d’affectation
- **Magasinier** → Interface d’attribution

---
