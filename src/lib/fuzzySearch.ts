/**
 * Normaliza un string removiendo acentos/tildes y convirtiendo a minúsculas.
 * Esto permite búsquedas insensibles a mayúsculas y acentos.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Filtro estricto de búsqueda.
 * Retorna `true` SOLO si el texto contiene TODOS los términos del query.
 * No usa Levenshtein ni tolerancia difusa para evitar resultados irrelevantes.
 * - Insensible a mayúsculas/minúsculas
 * - Insensible a tildes/acentos (é → e, ñ → n, etc.)
 */
export function strictMatch(text: string, query: string): boolean {
  const normalizedText = normalize(text);
  const words = normalize(query).split(/\s+/).filter(Boolean);

  if (words.length === 0) return true;

  return words.every((word) => normalizedText.includes(word));
}

/**
 * @deprecated Usar `strictMatch` en su lugar. Esta función usa Levenshtein
 * con tolerancia excesiva que genera resultados irrelevantes.
 */
export function fuzzyMatch(text: string, query: string): boolean {
  return strictMatch(text, query);
}
