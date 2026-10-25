# La librairie des auteurs — Cusset

Web app (PWA) de la librairie : les **nouveautés** en rayon, les **séances
de dédicace** à venir (avec ajout à l'agenda) et une **fiche par auteur**
avec ses livres disponibles.

Stack : Next.js 16 (App Router) + Supabase (base de données,
authentification, stockage des photos) + Tailwind 4, déployée sur Vercel.
Même base technique que la Boutique des Artisans.

## Fonctionnement

| Onglet | Contenu |
| --- | --- |
| Accueil | Prochaines dédicaces, derniers livres arrivés, un livre et un auteur au hasard |
| Nouveautés | Livres ajoutés ces 45 derniers jours + annonces (librairie et auteurs), abonnement aux notifications |
| Dédicaces | Séances à venir groupées par mois, bouton « Ajouter à mon agenda » (.ics / Google Agenda) |
| Auteurs | Recherche + filtre par genre / auteurs de la région ; fiche = bio, réseaux, dédicaces, livres |
| Favoris | Liste d'envies de livres, enregistrée sur l'appareil |

**Espace pro (`/admin`, icône en haut à droite) :**

- **Le libraire (superadmin)** gère tout : auteurs (avec ou sans compte de
  connexion), livres, dédicaces, annonces de la librairie.
- **Un auteur avec compte** gère sa fiche, ses livres, ses dédicaces et une
  annonce à la fois (15 jours max).

Toutes les modifications passent par des Server Actions qui vérifient les
droits, puis écrivent avec la clé `service_role`. La base n'autorise que la
lecture publique (voir `supabase/schema.sql`).

Les nom, adresse, horaires et URL de la librairie sont centralisés dans
**`lib/site.ts`**.

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com/dashboard), créez un **nouveau projet**.
2. **SQL Editor → New query** : exécutez `supabase/schema.sql`.
3. (Optionnel) exécutez `supabase/seed.sql` pour avoir 2 auteurs, 3 livres
   et 2 dédicaces **d'exemple** (à supprimer ensuite depuis `/admin/auteurs`).
4. **Project Settings → API** : notez l'URL, la clé `anon` et la clé
   `service_role`.

## 2. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplissez `.env.local` (et les mêmes variables dans Vercel → Settings →
Environment Variables). Pour les notifications :

```bash
npx web-push generate-vapid-keys
```

## 3. Créer le compte libraire (superadmin)

1. Supabase → **Authentication → Users → Add user** : créez votre compte
   (email + mot de passe, cochez « Auto Confirm User »).
2. Mettez ce même email dans `SUPERADMIN_EMAIL` (plusieurs comptes possibles, séparés par des virgules).
3. Connectez-vous sur `/admin/login` : le panneau « Gestion de la
   librairie » apparaît.

Ensuite, ajoutez les auteurs depuis **Auteurs → + Ajouter**. Si vous
renseignez leur email, un compte est créé et les identifiants leur sont
envoyés (via Brevo) ou affichés à l'écran.

## 4. Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000).

## 5. Déployer sur Vercel

1. Poussez le dossier sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com/new), importez le dépôt.
3. Renseignez les variables d'environnement, déployez.
4. Si l'adresse finale diffère de `https://librairie-des-auteurs.vercel.app`,
   modifiez `url` dans `lib/site.ts`.
