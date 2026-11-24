# Statistiques de visite — mode d'emploi

Les statistiques du site sont enregistrées par **Umami** (umami.is), un service de mesure d'audience
respectueux de la vie privée : sans cookie, sans bandeau de consentement, données anonymes.
Le tableau de bord est **privé** : il faut votre identifiant et votre mot de passe Umami pour le voir.

## Mise en service (une seule fois)

1. Créer un compte gratuit sur https://cloud.umami.is (offre gratuite « Hobby »).
2. Ajouter un site web : nom « Prestat Services Élagage », domaine `www.prestat-services-elagage.fr`.
3. Copier le **Website ID** (une suite du type `a1b2c3d4-…`).
4. Le coller dans `assets/js/main.js`, ligne `const UMAMI_ID = "";` (ou le donner à Claude).

Seules les visites sur le vrai domaine sont comptées (pas les aperçus de test).

## Ce que vous verrez dans le tableau de bord

| Statistique | Où la trouver |
|---|---|
| Visiteurs, visites, pages vues | Vue d'ensemble |
| Temps moyen passé sur le site, taux de rebond | Vue d'ensemble |
| Pages les plus vues, pages d'entrée et de sortie | Pages |
| Comment les gens trouvent le site (Google, Facebook, accès direct…) | Référents |
| Ordinateur / téléphone / tablette, navigateur, système | Appareils |
| Pays, région, ville des visiteurs | Lieux |
| Clics, demandes de devis, recherches… | Événements |

## Événements enregistrés par le site

| Événement | Détail enregistré |
|---|---|
| Clic Appeler | emplacement du bouton (en-tête, barre du bas, bouton flottant…) et page |
| Clic E-mail | emplacement et page |
| Clic E-mail devis | boutons « Devis gratuit » / « Demander un devis » |
| Clic Formulaire de devis | bouton « Devis » qui ouvre le formulaire |
| Demande de devis (formulaire) | prestation(s) choisie(s) et commune |
| Recherche commune | lieu tapé, trouvé ou non (utile pour savoir d'où viennent les demandes) |
| Photo agrandie / Filtre galerie | quelle photo ou catégorie intéresse |
| Question consultée | questions ouvertes dans la page Conseils |
| Liste dépliée | listes de communes ouvertes |
| Copie adresse e-mail, Lien externe | — |
