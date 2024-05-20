/**
 * Given two lists of the same type, iterate the first list
 * and replace items matched by the matcher func in the
 * first place.
 */
export default function merge<T>(
  root: T[],
  others: T[],
  matcher: (item: T) => any,
) {
  if (!others && !root) return [];
  if (!others) return root;
  if (!root) return [];
  if (!matcher) return root;

  return root.reduce((acc, r) => {
    const matched = others.find((o) => matcher(r) === matcher(o));
    if (matched) acc.push({ ...r, ...matched });
    else acc.push(r);
    return acc;
  }, [] as T[]);
}
