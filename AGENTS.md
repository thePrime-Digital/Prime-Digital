<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:version-rules -->
# Version Tracking

- A `VERSION` file exists at the project root tracking the current version in `0.0.x` format.
- Every time the agent makes changes to the codebase, it MUST increment the patch number in `VERSION` (e.g., `0.0.1` → `0.0.2`).
- The agent MUST track all changes made in the session and append a short changelog entry in `CHANGELOG.md` with the new version, a one-line description (max 10 words), and which files were touched.
- Before starting work, read `VERSION` and `CHANGELOG.md` to understand the current state and recent context.
<!-- END:version-rules -->
