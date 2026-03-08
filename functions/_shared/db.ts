export async function queryAll<T = Record<string, unknown>>(stmt: D1PreparedStatement): Promise<T[]> {
  const result = await stmt.all<T>();
  return result.results ?? [];
}

export async function queryFirst<T = Record<string, unknown>>(stmt: D1PreparedStatement): Promise<T | null> {
  const result = await stmt.first<T>();
  return result ?? null;
}
