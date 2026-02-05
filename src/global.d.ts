// Allow the editor / TypeScript to resolve path-alias imports like `@/...`
// This provides a permissive declaration so modules imported via the
// `@/*` path map are treated as `any` when no specific type is available.
declare module "@/*" {
  const _default: any;
  export = _default;
}
