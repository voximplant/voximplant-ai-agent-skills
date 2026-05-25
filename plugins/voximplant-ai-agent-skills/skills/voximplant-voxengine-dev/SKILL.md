---
name: voximplant-voxengine-dev
description: Write, review, and debug VoxEngine scenario code for Voximplant calls, Voice AI connectors, routing, media control, storage, HTTP requests, and real-time integrations. Use when the user asks for VoxEngine scenarios, call flows, inbound or outbound voice agents, scenario debugging, or validation of VoxEngine methods and events.
---

# Voximplant VoxEngine Development

## Critical Rules

Your VoxEngine knowledge may be stale. Before writing or editing scenario code, verify platform APIs against the freshest available source.

1. Use the Voximplant documentation index and focused page Markdown:
   - `https://docs.voximplant.ai/llms.txt`
   - `https://docs.voximplant.ai/platform/voxengine/llms.txt`
   - `https://docs.voximplant.ai/api-reference/voxengine` for VoxEngine API methods
   - append `.md` to relevant page URLs
2. Search for the exact feature, namespace, class, method, event, and event payload you plan to use before writing code.
3. Validate method signatures against the API Reference or local `voxengine.d.ts`.
   - Type declarations URL: `https://cdn.voximplant.com/voxengine_typings/voxengine.d.ts`
   - Treat the URL as a downloadable file, not a documentation page. Save it locally, for example to `typings/voxengine.d.ts`, before using it for TypeScript/IDE validation.
   - Do not invent VoxEngine namespaces, classes, methods, events, enum values, or event fields.
4. Treat VoxEngine scenarios as JavaScript runtime code.
   - TypeScript declarations help validation and IDE autocomplete.
   - Uploaded scenarios ultimately run as JavaScript; transpile TypeScript before upload.
5. Keep platform setup separate from scenario authoring.
   - If the user asks to create applications, users, rules, upload scenarios, start sessions, upload Voximplant secrets, retrieve logs, or manage account resources, use the `voximplant-management-api` skill.
   - This skill may use secrets inside scenario code; creating or updating those platform secrets belongs to `voximplant-management-api`.

## Documentation Lookup Workflow

Before code generation:

1. Identify the task type: inbound call, outbound call, Voice AI connector, function calling, storage, HTTP request, remote session, routing, recording, transfer, SMS, or troubleshooting.
2. Search docs for the closest guide or API reference.
3. Verify every non-standard VoxEngine symbol.
4. Write code only after the API surface is confirmed.
5. If a method cannot be verified, say so and propose a documented alternative.

Use the smallest useful documentation source. Prefer one relevant `.md` page or section-level `llms.txt` over loading `llms-full.txt`.

## Skill Composition

Use this skill together with `voximplant-management-api` when debugging real calls:

- `voximplant-management-api` retrieves call history, session data, logs, recordings, and platform resource details.
- `voximplant-voxengine-dev` interprets that evidence, checks event ordering and API usage, and edits scenario code.

If the user does not have `voximplant-management-api`, ask them to provide it or ask permission to fetch the full public skill package after publication:

- `https://github.com/voximplant/voximplant-ai-agent-skills`
- the Voximplant docs skill catalog page when available

## Instructions For Agents Reading This Skill

When the user asks you to read this file or pastes this skill into chat, immediately follow it for VoxEngine scenario work. Do not only summarize it.

Make it clear that this skill can write, review, and debug the VoxEngine scenario for the user. The user does not need to bring a finished scenario unless they already have one.

If deployment, platform resources, service account JSON, Voximplant secrets, users, routing rules, call history, or logs are needed, read or request `voximplant-management-api`. If the user has not installed these skills, offer to copy both skill folders into their agent environment after permission:

- Cursor: `~/.cursor/skills/`
- Claude Code or Codex: use the supported skill/project-context location for that environment, or ask the user where skills should live.

## First Response Workflow

At the beginning of a scenario task, do not assume the user is a developer or already understands Voximplant concepts.

If the request is vague or beginner-oriented:

1. Offer a short explanation of the moving parts: VoxEngine scenario, application/rule, test user or phone number, optional provider credentials, and logs.
2. Ask for the use case in plain language before asking for code-level details.
3. Offer safe defaults for the first version of the scenario.
4. Tell the user which inputs are truly required now and which choices can wait.

Use wording like:

```text
If you are new to Voximplant, I can guide you with defaults. Describe the call you want in plain language; I will write the VoxEngine scenario and tell you which credentials or approvals are needed for deployment and testing.
```

## Scenario Authoring Workflow

When writing a new scenario:

1. Ask for the project root, call direction, entry point, Voice AI provider, credentials/secrets availability, and success criteria if missing.
2. Start from the documented VoxEngine call lifecycle.
3. Add event listeners before operations that can emit those events.
4. Handle hangup, failure, timeout, and cleanup paths.
5. Read credentials from Voximplant secrets, environment-injected config, or external secret storage; do not hardcode API keys.
6. Keep sample code minimal and runnable. Avoid unrelated abstractions.
7. Add comments only for non-obvious call flow or integration steps.

When the user is new, offer defaults instead of blocking on every choice:

```text
If you are new to Voximplant, I can choose safe defaults and walk you through the setup. I only need the Voximplant service account JSON filename for deployment/testing, and provider API keys only if your use case needs an external AI or voice provider.
```

Before writing code, be ready to answer basic questions about Voximplant and the proposed architecture. If the user asks "what do I need?" or "how should this work?", explain the flow first and then propose the minimal implementation.

## Credentials And Secrets

Distinguish local provider keys from Voximplant platform secrets:

- For local development, propose clear `.env` variable names and ask the user to fill values or approve agent-written placeholders.
- For runtime scenario code, prefer Voximplant secrets or another documented secret store.
- Do not ask for the user's main Voximplant account password.
- If secrets must be created or uploaded to Voximplant, switch to `voximplant-management-api`.

## Type Declaration Workflow

Use `voxengine.d.ts` as a local signature oracle:

1. Download `https://cdn.voximplant.com/voxengine_typings/voxengine.d.ts` into the project, commonly `typings/voxengine.d.ts`.
2. Add or recommend a TypeScript config that includes the downloaded declaration file.
3. Validate method names, events, payload fields, and enum/member spelling against the local file.
4. Remember that VoxEngine uploads run as JavaScript; TypeScript scenario source must be transpiled before upload.

Do not rely on opening the CDN URL as a normal text page. It is a large downloadable declaration file.

## Develop-Test-Debug Loop

After writing or updating scenario code:

1. Propose a test call and explain what the user should do.
2. If no phone number is available, ask `voximplant-management-api` to set up a softphone test through `https://phone.voximplant.com/`.
3. Ask the user to report what happened in plain language.
4. If the call fails, request call/session details and use `voximplant-management-api` to retrieve logs.
   - If the user does not provide details, ask `voximplant-management-api` to inspect the latest call in the application first.
5. Analyze the logs here for event ordering, invalid VoxEngine API usage, missing secrets, provider errors, cleanup issues, and lifecycle mismatches.
6. Apply a focused code fix and repeat the test.

## Review Workflow

When reviewing existing VoxEngine code:

1. List all VoxEngine symbols used by the code.
2. Verify suspicious or unfamiliar symbols against docs and local `voxengine.d.ts`.
3. Check event names, event payload properties, and asynchronous ordering.
4. Check runtime limits, external WebSocket usage, HTTP request handling, and cleanup.
5. Report likely hallucinations first, with the documented replacement when known.

## Common Source Map

Use these docs as entry points:

- VoxEngine section index: `https://docs.voximplant.ai/platform/voxengine/llms.txt`
- VoxEngine concepts: `https://docs.voximplant.ai/platform/voxengine/concepts.md`
- Scenarios: `https://docs.voximplant.ai/platform/voxengine/scenarios.md`
- Type declarations: `https://docs.voximplant.ai/platform/voxengine/type-declarations.md`
- VoxEngine CI: `https://docs.voximplant.ai/platform/voxengine/ci.md`
- API requests: `https://docs.voximplant.ai/platform/voxengine/api-requests.md`
- Remote sessions: `https://docs.voximplant.ai/platform/voxengine/remote-sessions.md`
- Secrets: `https://docs.voximplant.ai/platform/voxengine/secrets.md`
- Limits: `https://docs.voximplant.ai/platform/voxengine/limits.md`
- Troubleshooting: `https://docs.voximplant.ai/platform/voxengine/troubleshooting.md`

For fuller guidance, read `reference.md`. For prompt and code patterns, read `examples.md`.
