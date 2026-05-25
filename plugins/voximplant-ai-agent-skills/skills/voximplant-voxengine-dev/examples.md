# VoxEngine Examples

Use these patterns as prompt and response scaffolding. Verify API details through docs before producing final code.

## Beginner First Response

When the user is new to Voximplant or does not describe implementation details:

```text
I can guide you from the use case.

Tell me in plain language:
- who starts the call
- who or what should answer
- which AI/provider should participate, if any
- what a successful first test should look like

I will propose a simple VoxEngine flow, write the scenario, explain the Voximplant pieces involved, and tell you the credentials or approvals needed for deployment and testing.
```

## Inbound Voice AI Scenario

When the user asks for an inbound voice agent:

1. Search docs for the chosen provider and inbound example.
2. Confirm how the inbound call is answered.
3. Confirm the connector/WebSocket setup.
4. Handle call disconnect, provider disconnect, and errors.
5. Keep provider credentials in secrets.

Recommended response shape:

```text
I will build an inbound VoxEngine scenario. I need:
- local project folder
- Voice AI provider, only if this is an AI bot
- provider API key/secret location, only if an external provider is used
- desired greeting or system prompt
- what should end the call

If you are new to Voximplant, I can choose safe defaults and guide you step by step. I can write the scenario for you; for deployment/testing I need the Voximplant service account JSON filename, and a provider API key only if the bot uses an external AI or voice provider.
```

## Outbound Voice AI Scenario

When the user asks for outbound calling:

1. Confirm caller ID, destination number source, and compliance expectations.
2. Search docs for outbound call lifecycle and provider-specific outbound example.
3. Start provider media only after the callee answers.
4. Add failure and timeout handling.
5. Keep test calls explicit; do not assume production dialing permission.

## Review for Hallucinated APIs

Use this checklist:

```text
VoxEngine symbols found:
- [symbol]

Verified:
- [symbol] -> [source]

Unverified or suspicious:
- [symbol] -> not found in docs/type declarations

Recommended changes:
- Replace [bad symbol] with [documented approach]
```

## Debugging Prompt

If the user provides an error or behavior:

```text
I will check:
1. whether the event/method exists
2. whether listeners are attached early enough
3. whether the call/session lifecycle reaches the expected state
4. whether VoxEngine limits or external service errors apply

If this happened during a real call, I can also use the Management API skill to retrieve call history and logs from Voximplant. Please provide the approximate time, caller/callee or application user, and any session/call ID you have.
```

## Softphone Test Checklist

After scenario code is ready:

```text
Next, test it with a real call.
- If you already have a number or SIP setup, call the route you configured.
- If you do not have a number, I can use the Management API skill to create an application user and give you instructions for https://phone.voximplant.com/.
- If the call behaves differently than expected, tell me what happened in plain language. I will pull the logs through the Management API skill and debug the scenario from evidence.
```

## Handoff To Management API Logs

When a call fails:

```text
I need platform evidence for the next debugging step. I will switch to the Management API workflow to retrieve:
- matching call history
- session logs
- secure objects if needed and allowed

Then I will return to the VoxEngine workflow to fix the scenario code.
```

Use the retrieved logs to check:

- event listener ordering
- provider connection failures
- missing or unavailable secrets
- invalid event payload assumptions
- unhandled hangup/failure paths
- nonexistent or deprecated VoxEngine APIs

## Local Type Declaration Setup

For TypeScript validation:

```text
Download https://cdn.voximplant.com/voxengine_typings/voxengine.d.ts into:
typings/voxengine.d.ts

Use it for local type checking and autocomplete. Do not upload TypeScript directly to VoxEngine without transpiling to JavaScript.
```

## Minimal Documentation Lookup Examples

Good documentation searches:

- `VoxEngine inbound call OpenAI Realtime example`
- `VoxEngine CallAlerting event payload`
- `VoxEngine WebSocket external audio streaming`
- `VoxEngine secrets API scenario`
- `VoxEngine limits WebSocket connections`

Avoid broad queries like:

- `Voximplant`
- `voice bot`
- `API`
