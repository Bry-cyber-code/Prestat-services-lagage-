# Prestat Services — site vitrine

Nouveau site de **Prestat Services** (élagage, abattage, taille de haies, entretien d'espaces verts — Romilly-sur-Seine, Aube).

Site 100 % statique (HTML / CSS / JavaScript, aucune dépendance), hébergé sur **GitHub Pages**
(branche `main`, dossier racine). Le fichier `CNAME` déclare le domaine `www.prestat-services-elagage.fr`.
Chaque modification poussée sur `main` est publiée automatiquement.

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil |
| `elagage-abattage.html` | Élagage, abattage, étêtage, débitage, dessouchage |
| `taille-de-haie.html` | Haies, arbres fruitiers, autres végétaux |
| `entretien-terrain-et-maison.html` | Tonte, débroussaillage, toiture, mini-pelle |
| `autres-travaux.html` | Clôtures, allées, dalles, terrasses |
| `galerie.html` | Réalisations (photos filtrables + visionneuse) |
| `zone-desservie.html` | Carte des 40 km, 334 communes + 301 hameaux / lieux-dits, recherche (nom ou code postal) |
| `conseils.html` | FAQ réglementation (ancienne page « Détail ») |
| `contact.html` | Coordonnées + formulaire de devis (ouvre un e-mail prérempli) |
| `mentions-legales.html` | Mentions légales (**à compléter : SIRET, hébergeur…**) |
| `detail.html`, `elagueur.html`, `elagage-arbre-fruitier.html` | Redirections des anciennes adresses Webador |

Les noms de fichiers reprennent les adresses de l'ancien site (`/elagage-abattage`, `/contact`…)
pour conserver le référencement Google lors de la bascule du nom de domaine.

## Modifier le site

- **Menu / en-tête / pied de page** : modifier `partials/header.html` ou `partials/footer.html`,
  puis lancer `python3 tools/build.py` pour les recopier dans toutes les pages.
- **Photos** : `assets/img/photos/` (WebP, 800 px et 1600 px). Dans le HTML, une image s'écrit
  `<img data-photo="nom-de-la-photo" alt="…" sizes="…">` ; `tools/build.py` complète le reste.
- **Couleurs** : variables en haut de `assets/css/style.css` (vert dominant, orange, écorce, ciel).

## Aperçu en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
