#!/usr/bin/env python3
"""Insère l'en-tête et le pied de page communs dans toutes les pages HTML.

Chaque page contient deux zones délimitées :
    <!-- @header --> ... <!-- /@header -->
    <!-- @footer --> ... <!-- /@footer -->
Le contenu de ces zones est remplacé par partials/header.html et partials/footer.html.
Le lien du menu correspondant à la page (attribut data-page du <body>) est marqué
comme page courante.

Utilisation :  python3 tools/build.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SERVICES = {"elagage-abattage", "taille-de-haie", "entretien-terrain-et-maison", "autres-travaux"}


def render(partial: str, page: str) -> str:
    out = partial.replace(f'data-nav="{page}"', f'data-nav="{page}" aria-current="page"')
    return out.replace("{{services_active}}", " is-active" if page in SERVICES else "")


PHOTOS = ROOT / "assets/img/photos"
MANAGED = re.compile(r'\s(?:src|srcset|width|height|loading|decoding)="[^"]*"')


def webp_size(path: Path) -> tuple[int, int]:
    """Lit la taille d'une image WebP (VP8 / VP8L / VP8X) sans dépendance."""
    b = path.read_bytes()[:30]
    kind = b[12:16]
    if kind == b"VP8 ":
        return int.from_bytes(b[26:28], "little") & 0x3FFF, int.from_bytes(b[28:30], "little") & 0x3FFF
    if kind == b"VP8L":
        bits = int.from_bytes(b[21:25], "little")
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    return int.from_bytes(b[24:27], "little") + 1, int.from_bytes(b[27:30], "little") + 1


def expand_photo(m: re.Match) -> str:
    """<img data-photo="nom" alt="…"> → image responsive complète (800 / 1600 px)."""
    tag = m.group(0)
    name = re.search(r'data-photo="([^"]+)"', tag).group(1)
    small, big = f"assets/img/photos/{name}-800.webp", f"assets/img/photos/{name}-1600.webp"
    w, h = webp_size(PHOTOS / f"{name}-800.webp")
    attrs = MANAGED.sub("", tag[4:-1].rstrip(" /"))
    loading = "eager" if "data-eager" in tag else "lazy"
    return (f'<img src="{small}" srcset="{small} 800w, {big} 1600w" width="{w}" height="{h}" '
            f'loading="{loading}" decoding="async"{attrs}>')


def main() -> None:
    header = (ROOT / "partials/header.html").read_text(encoding="utf-8").strip()
    footer = (ROOT / "partials/footer.html").read_text(encoding="utf-8").strip()
    for f in sorted(ROOT.glob("*.html")):
        src = f.read_text(encoding="utf-8")
        src = re.sub(r"<img\b[^>]*\bdata-photo=\"[^\"]+\"[^>]*>", expand_photo, src)
        m = re.search(r'<body[^>]*data-page="([^"]+)"', src)
        if not m:
            continue
        page = m.group(1)
        for name, part in (("header", header), ("footer", footer)):
            src = re.sub(
                rf"<!-- @{name} -->.*?<!-- /@{name} -->",
                lambda _: f"<!-- @{name} -->\n{render(part, page)}\n<!-- /@{name} -->",
                src,
                flags=re.S,
            )
        f.write_text(src, encoding="utf-8")
        print(f"✓ {f.name}")


if __name__ == "__main__":
    main()
