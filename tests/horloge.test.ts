import { describe, expect, it } from 'vitest';
import { dateLocale, enPendule, heureLocale } from '../src/moteur/horloge';

describe('les dates sont celles de Nouméa, pas celles du processus', () => {
  it('passe au lendemain onze heures avant UTC', () => {
    // 13 h UTC le 13 septembre, c'est déjà minuit le 14 en Nouvelle-Calédonie.
    const instant = Date.parse('2026-09-13T13:00:00Z');
    expect(dateLocale(instant)).toBe('14/09/2026');
    expect(new Date(instant).toISOString().slice(0, 10)).toBe('2026-09-13');
  });

  it('donne l’heure locale, pas l’heure UTC', () => {
    expect(heureLocale(Date.parse('2026-09-13T13:00:00Z'))).toBe('00:00');
  });
});

describe('le pendule', () => {
  it('passe aux heures quand il faut', () => {
    expect(enPendule(0)).toBe('00:00');
    expect(enPendule(65_000)).toBe('01:05');
    expect(enPendule(3_725_000)).toBe('1:02:05');
    expect(enPendule(-5000)).toBe('00:00');
  });
});
