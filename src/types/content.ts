// Union types are better than enums here because:
// 1. They're more TypeScript-idiomatic
// 2. They don't generate runtime code (tree-shakeable)
// 3. They work seamlessly with string literals
// 4. They provide better type inference
export type ContentType = "track" | "album" | "artist";
