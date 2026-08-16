"""Konfiguration: .env, targets.yaml, blocklist.txt."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from dotenv import load_dotenv


class ConfigError(RuntimeError):
    """Konfiguration fehlt oder ist unbrauchbar."""


@dataclass
class Filter:
    min_bewertungen: int = 0
    nur_operational: bool = True
    ausschluss_typen: list[str] = field(default_factory=list)


@dataclass
class Limits:
    """Kostenbremse. max_api_calls ist ein harter Abbruch, kein Richtwert."""

    max_api_calls: int = 200
    max_seiten_pro_query: int = 3  # Places deckelt ohnehin bei ~60 Treffern


@dataclass
class Crawl:
    """Einstellungen fuer das Impressum-Modul (Schritt 4)."""

    user_agent: str = (
        "ElevoLeadBot/0.1 (+https://elevo.solutions; kontakt@elevo.solutions)"
    )
    timeout_sekunden: float = 10.0
    pause_zwischen_domains: float = 1.5
    max_seiten_pro_domain: int = 2


@dataclass
class Targets:
    suchbegriffe: list[str]
    staedte: list[str]
    filter: Filter = field(default_factory=Filter)
    limits: Limits = field(default_factory=Limits)
    crawl: Crawl = field(default_factory=Crawl)

    @property
    def queries(self) -> list[tuple[str, str]]:
        """Kartesisches Produkt Suchbegriff x Stadt."""
        return [(b, s) for b in self.suchbegriffe for s in self.staedte]


def load_api_key(env_file: Path | None = None) -> str:
    """API-Key aus .env lesen. Niemals loggen, niemals in die Ausgabe schreiben."""
    load_dotenv(dotenv_path=env_file, override=False)
    key = os.getenv("GOOGLE_PLACES_API_KEY", "").strip()
    if not key:
        raise ConfigError(
            "GOOGLE_PLACES_API_KEY fehlt. Lege tools/leads/.env an "
            "(Vorlage: .env.example) und trage den Key ein."
        )
    return key


def _as_list(value: object, feld: str) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise ConfigError(f"'{feld}' muss eine Liste sein, ist aber {type(value).__name__}.")
    out = [str(v).strip() for v in value if str(v).strip()]
    return out


def load_targets(path: Path) -> Targets:
    if not path.exists():
        raise ConfigError(f"Config nicht gefunden: {path}")

    raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(raw, dict):
        raise ConfigError(f"{path} enthaelt kein YAML-Mapping.")

    suchbegriffe = _as_list(raw.get("suchbegriffe"), "suchbegriffe")
    staedte = _as_list(raw.get("staedte"), "staedte")
    if not suchbegriffe:
        raise ConfigError("Mindestens ein Eintrag unter 'suchbegriffe' noetig.")
    if not staedte:
        raise ConfigError("Mindestens ein Eintrag unter 'staedte' noetig.")

    f_raw = raw.get("filter") or {}
    filt = Filter(
        min_bewertungen=int(f_raw.get("min_bewertungen", 0)),
        nur_operational=bool(f_raw.get("nur_operational", True)),
        ausschluss_typen=_as_list(f_raw.get("ausschluss_typen"), "filter.ausschluss_typen"),
    )

    l_raw = raw.get("limits") or {}
    limits = Limits(
        max_api_calls=int(l_raw.get("max_api_calls", 200)),
        max_seiten_pro_query=int(l_raw.get("max_seiten_pro_query", 3)),
    )

    c_raw = raw.get("crawl") or {}
    crawl = Crawl(
        user_agent=str(c_raw.get("user_agent", Crawl.user_agent)),
        timeout_sekunden=float(c_raw.get("timeout_sekunden", Crawl.timeout_sekunden)),
        pause_zwischen_domains=float(
            c_raw.get("pause_zwischen_domains", Crawl.pause_zwischen_domains)
        ),
        max_seiten_pro_domain=int(
            c_raw.get("max_seiten_pro_domain", Crawl.max_seiten_pro_domain)
        ),
    )

    return Targets(
        suchbegriffe=suchbegriffe,
        staedte=staedte,
        filter=filt,
        limits=limits,
        crawl=crawl,
    )


@dataclass
class Blocklist:
    """Domains und E-Mail-Adressen, die nie in der Ausgabe landen duerfen."""

    domains: set[str] = field(default_factory=set)
    emails: set[str] = field(default_factory=set)

    @classmethod
    def load(cls, path: Path) -> "Blocklist":
        bl = cls()
        if not path.exists():
            return bl
        for zeile in path.read_text(encoding="utf-8").splitlines():
            eintrag = zeile.split("#", 1)[0].strip().lower()
            if not eintrag:
                continue
            if "@" in eintrag:
                bl.emails.add(eintrag)
            else:
                bl.domains.add(cls.normalize_domain(eintrag))
        return bl

    @staticmethod
    def normalize_domain(wert: str) -> str:
        wert = wert.strip().lower()
        for prefix in ("https://", "http://"):
            if wert.startswith(prefix):
                wert = wert[len(prefix) :]
        wert = wert.split("/", 1)[0]
        if wert.startswith("www."):
            wert = wert[4:]
        return wert

    def blockt_domain(self, domain: str | None) -> bool:
        if not domain:
            return False
        d = self.normalize_domain(domain)
        if d in self.domains:
            return True
        # Subdomains einer gesperrten Domain ebenfalls sperren
        return any(d.endswith("." + gesperrt) for gesperrt in self.domains)

    def blockt_email(self, email: str) -> bool:
        return email.strip().lower() in self.emails
