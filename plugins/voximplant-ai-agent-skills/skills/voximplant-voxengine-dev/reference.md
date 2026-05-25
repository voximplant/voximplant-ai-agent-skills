# VoxEngine Reference Notes

Use this file when the main skill needs more detail for scenario authoring, review, or debugging.

## Source Priority

1. VoxEngine API Reference in `docs.voximplant.ai`
2. local `voxengine.d.ts` downloaded from `https://cdn.voximplant.com/voxengine_typings/voxengine.d.ts`
3. Focused `.md` pages from `docs.voximplant.ai`
4. Section-level `llms.txt` indexes
5. `llms-full.txt` only when narrow sources are insufficient

Use `https://docs.voximplant.ai/api-reference/voxengine` as the direct API Reference entry point for VoxEngine methods.

If sources disagree, prefer the newest API Reference or type declaration for signatures, and the newest guide for recommended architecture.

## Verification Checklist

Before finalizing code, verify:

- Namespaces/classes exist.
- Methods exist with the expected arity and parameter object shape.
- Events exist on the object receiving the listener.
- Event payload fields are documented or present in type declarations.
- Async ordering is safe: listeners are attached before calls that can emit events.
- The scenario ends or cleans up explicitly when calls, sockets, timers, or external sessions finish.
- External credentials are read from secrets or injected configuration, not hardcoded.
- Any required Voximplant platform secret already exists, or the task is handed to `voximplant-management-api`.

## Common VoxEngine Areas

Search docs by these concepts instead of guessing method names:

- inbound calls and `CallAlerting`
- outbound calls and call connection lifecycle
- call transfers
- recordings
- WebSocket integrations
- HTTP requests from scenarios
- remote session control
- key-value storage and custom data
- secret storage
- application users and SDK authentication
- scenario troubleshooting and limits

## Type Declaration Use

Use `voxengine.d.ts` as a signature oracle, not as a tutorial.

The CDN URL returns a downloadable declaration file. For TypeScript-heavy work, download it into the project first, for example:

```text
typings/voxengine.d.ts
```

Then include it in the local TypeScript setup. A minimal project can use:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "types": [],
    "typeRoots": ["./typings", "./node_modules/@types"]
  },
  "include": ["src/**/*", "typings/voxengine.d.ts"]
}
```

Good uses:

- Confirm a method or event exists.
- Inspect accepted parameter types.
- Check enum/member spelling.
- Validate callback/event payload fields.

Bad uses:

- Inferring full architecture from signatures only.
- Using an undocumented method when docs provide a newer recommended flow.
- Assuming TypeScript can be uploaded directly without transpilation.
- Treating the CDN URL as a small text page that can be casually loaded into every prompt.

## Runtime Debug Loop

Code-level debugging should use platform evidence when available:

1. Ask the user what happened and what they expected.
2. Request the approximate time, source/destination, application user, session URL, or call/session ID.
3. Use `voximplant-management-api` to retrieve call history, session data, logs, and recordings. If the user gives no details, inspect the latest call in the application first.
4. Inspect the scenario code and logs together.
5. Look first for listener ordering, missing cleanup, unhandled hangups, missing secrets, provider/WebSocket failures, invalid event payload assumptions, and nonexistent VoxEngine APIs.
6. Make the smallest scenario fix and ask the user to test again.

If the user does not have the Management API skill, ask them to provide it or approve fetching the public package after publication: `https://github.com/voximplant/voximplant-ai-agent-skills`.

## Hallucination Guardrails

If a requested method cannot be found:

1. Do not silently replace it with a guessed method.
2. Search docs for the underlying task.
3. State that the requested method was not verified.
4. Offer the documented alternative and cite the source URL used.

If a provider-specific example is needed, search for the provider page first:

- OpenAI
- Gemini
- Ultravox
- ElevenLabs
- Cartesia
- Deepgram
- Grok
- Dialogflow

## Escalation to Management API

VoxEngine code can define runtime behavior, but it does not by itself create platform resources. If the user wants deployment or account setup, switch to the Management API workflow for:

- creating applications
- creating scenarios in the account
- creating or changing routing rules
- creating users
- uploading scenario source
- starting scenarios via API
- retrieving logs or recordings
- creating or updating Voximplant secrets
