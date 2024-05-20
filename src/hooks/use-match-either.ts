import { matchPath, useLocation } from "react-router-dom";

/**
 * Convenience hook, a version of useMatch that enables to match multiple patterns against current pathname
 * @param {Array} patterns Array of string full routes to pattern match
 * @returns {Boolean} Returns true if either one of the provided pattern matches the current pathname
 */
export default function useMatchEither(patterns: string[]): boolean {
  const { pathname } = useLocation();

  return patterns.some((pattern) => matchPath(pattern, pathname));
}
