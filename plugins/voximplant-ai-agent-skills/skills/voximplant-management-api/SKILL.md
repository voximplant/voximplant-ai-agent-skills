---
name: voximplant-management-api
description: Automate Voximplant account setup and operations through the Management API, official API clients, or VoxEngine CI. Use when creating or updating applications, users, scenarios, routing rules, phone numbers, call lists, service accounts, sessions, logs, recordings, or deploying VoxEngine code.
---

# Voximplant Management API

## Critical Rules

Use this skill for platform automation, not for writing scenario logic. For VoxEngine scenario code, use `voximplant-voxengine-dev`.
Many real tasks require both skills: this skill retrieves platform state, call history, logs, recordings, and manages resources/secrets; `voximplant-voxengine-dev` analyzes and fixes scenario code.

1. Use the Voximplant documentation index and focused page Markdown:
   - `https://docs.voximplant.ai/llms.txt`
   - `https://docs.voximplant.ai/platform/management-api/llms.txt`
   - page Markdown URLs such as `https://docs.voximplant.ai/platform/management-api/authorization.md`
2. Search for the exact Management API method, API client, or VoxEngine CI command before using it.
3. Use service accounts for automation.
   - Never ask for the user's main Voximplant account password.
   - Prefer service account JSON credentials and JWT authorization.
   - Treat service account JSON files as path-only secrets by default. Do not read the JSON private key into the agent conversation context unless the user explicitly asks and understands the risk.
   - API keys are legacy for secure flows; use them only when the user explicitly needs a legacy integration.
4. Choose service account roles based on the user's priority.
   - For the easiest beginner workflow, suggest a broad role such as Developer or Owner so the agent can complete setup without repeated role changes.
   - If security is more important and the user understands the exact task, explain the minimum roles needed before performing account-changing operations.
   - SMS operations such as `A2PSendSms` and `A2PGetSmsHistory` may require SMS-specific permissions beyond a general Developer role.
5. Confirm write operations.
   - Before creating, updating, deleting, uploading, buying, binding, or starting resources, restate the target account/application/resource and wait for explicit user confirmation unless the user already gave clear approval.
6. Prefer Management API-first automation.
   - Use official API clients or direct HTTPS requests for flexible automation with fewer project dependencies.
   - Use VoxEngine CI only when the user already has or explicitly wants a CI-style local sync/upload workflow.
7. Dry-run or preview before deploy when possible.
   - For VoxEngine CI uploads, run or recommend `--dry-run` before uploading.
   - For Management API changes, present the exact resources and fields that will change.
8. Be careful with scenario and rule updates.
   - If you are updating scenario code, update the existing scenario in place with `SetScenarioInfo`.
   - If you are changing which scenario a rule points to, use the documented binding primitive such as `BindScenario`, then verify the binding.
   - Do not assume `SetRuleInfo` can rebind a rule to a scenario. It may accept `scenario_id` and return success without changing the binding.

## First Response Workflow

At the beginning of a user request, quickly classify the user's experience level:

- If the user sounds new to Voximplant or telephony, offer a beginner-friendly path before asking for many technical details.
- Ask what they want to build in plain language: inbound bot, outbound campaign, softphone test, call recording, call transfer, number purchase, or another use case.
- Offer safe defaults and explain the few things the user usually needs to provide: a Voximplant account, service account JSON, external provider keys only when needed, and approval for platform-changing actions.
- Avoid making the user choose between low-level API methods unless they ask for that level of control.

Use wording like:

```text
If you are new to Voximplant, I can first explain the moving parts and propose safe defaults. Tell me what call flow you want, and I will say which credentials and approvals are needed.
```

## Instructions For Agents Reading This Skill

When the user asks you to read this file or pastes this skill into chat, immediately follow it for Voximplant platform automation. Do not only summarize it.

Tell the user this skill can create and manage Voximplant platform resources for them after they provide service account JSON credentials and approve changes. Do not list applications, rules, users, scenarios, or secrets as things the user must manually create unless the user explicitly wants to do it manually.

If the task also needs VoxEngine code, read or request `voximplant-voxengine-dev`. If the user has not installed these skills, offer to copy both skill folders into their agent environment after permission:

- Cursor: `~/.cursor/skills/`
- Claude Code or Codex: use the supported skill/project-context location for that environment, or ask the user where skills should live.

## User Setup Instructions

When API access is needed, first ask which local project folder is in scope. Do not invent paths.

Then tell the user:

1. Log in to the Voximplant control panel.
2. Open Service Accounts.
3. Create a service account or edit an existing one.
4. For maximum convenience, assign a broad role such as Developer or Owner. For stricter security, assign only the roles needed for the known task.
5. Generate the JSON key.
6. Put the JSON file in the project root and tell the agent the filename, for example `voximplant-service-account.json`. If the file keeps its default `_private.json` suffix, the agent should be able to find it by name. Do not commit it.

Prefer the simple root-file handoff for beginners. The agent must proactively check or update `.gitignore` so the JSON is not committed; create `.gitignore` if needed. Do not ask the user to paste their main account password, browser cookies, or control panel session tokens.

Do not read the service account JSON contents into chat by default. Pass only the file path to local commands or scripts. Reading the JSON into the agent conversation may send the private key through the LLM provider and store it in conversation logs.

If the user already works with environment variables or CI secrets, adapt to that setup. Do not make a beginner manually edit paths in `.env`; the root JSON filename is the simplest default.

When discovering credentials, only inspect filenames at first:

1. Look in the project root for `*_private.json`.
2. If exactly one match exists, ask whether to use it.
3. If multiple matches exist, ask the user which filename to use.
4. If no match exists, ask the user to place the service account JSON in the project root or provide the filename.

If the user is new, offer a guided path:

```text
I can choose safe defaults and do the platform setup for you. I only need your Voximplant service account JSON file name, approval before changing resources, and external provider keys only if your use case needs them.
```

If the user is deploying scenarios with VoxEngine CI, ask for or configure only when CI is the selected path:

- `VOX_CI_CREDENTIALS`: path to the service account JSON
- `VOX_CI_ROOT_PATH`: optional local root for downloaded VoxEngine files

## Automation Workflow

Before performing Management API work:

1. Identify the requested operation: create, update, upload, start, inspect, retrieve logs, retrieve recordings, manage users, manage numbers, or manage call lists.
2. Search docs for the relevant method or official client usage.
3. Confirm the service account JSON file name or credential source.
4. Confirm the target account and application.
5. For risky operations, present the exact action plan and wait for explicit approval.
6. Execute the smallest safe change.
7. Report created or changed resource IDs and any follow-up steps.

## Skill Composition

Switch to or request `voximplant-voxengine-dev` when the task requires scenario authoring, code review, runtime event ordering, or code-level debugging. If the user does not have that skill, ask them to provide it or ask permission to fetch the public skill package after it is published:

- `https://github.com/voximplant/voximplant-ai-agent-skills`
- the Voximplant docs skill catalog page when available

Keep the boundary clear:

- This skill creates/updates platform resources, uploads scenario source, creates application users, manages Voximplant secrets, starts sessions, and retrieves logs/recordings.
- `voximplant-voxengine-dev` writes code, validates VoxEngine APIs, uses already available secrets inside scenario code, and interprets logs to fix scenario behavior.

## Test And Debug Loop

After deployment, offer a test call. If the user has no phone number, offer a no-number test using `https://phone.voximplant.com/`:

1. Create or reuse a Voximplant application user after approval.
2. Generate a strong temporary password.
3. Store test credentials in an ignored local `.env` only after the user approves, or print the variable names and ask the user to fill values.
4. Give the user softphone login instructions and the expected test behavior. Tell them what to enter in `Enter destination`: for a call inside the same application, any value is enough, for example `1`.
5. Ask the user to place a call and report what happened.

When the user reports a failed call:

1. If the user gives no details, first retrieve the latest call in the relevant application and inspect it.
2. If the latest call is not the right one, ask for the time window, destination/source, phone user, session URL, or any call/session ID they have.
3. Use Management API methods for call history and secure logs/recordings.
4. Search logs for errors, disconnect reasons, event ordering, provider failures, and missing secrets.
5. Summarize the platform evidence and hand it to the VoxEngine debug flow for code-level fixes.
6. Repeat the test after changes.

## Phone Number Guidance

When the task involves buying or renting phone numbers, warn early that some countries and number types require identity, business, or address verification before the number can be purchased or activated.

Do not imply that the Management API can bypass regulatory verification. Instead:

1. Ask for the target country, number type, and use case.
2. Check the current Voximplant documentation or control panel guidance when available.
3. Explain what verification may be required and which steps are manual.
4. Offer a no-number softphone test with `https://phone.voximplant.com/` while verification is pending.
5. Only proceed with number purchase or binding after explicit approval and after the user understands possible charges and verification requirements.

## Recommended Tools

Prefer official tooling over hand-rolled wrappers, with a Management API-first default:

- Official API clients for application code and automation:
  - Node.js: `@voximplant/apiclient-nodejs`
  - Python: `voximplant-apiclient`
  - Go: `github.com/voximplant/apiclient-go`
  - PHP: `voximplant/apiclient-php`
  - Java: verify the current package in the official README
  - .NET: verify the current package in the official README
- Direct HTTPS requests when the official client is unavailable or too heavy for the task.
- VoxEngine CI only for existing CI-based projects or explicit local scenario/routing-rule sync workflows.

## Common Source Map

- Management API section index: `https://docs.voximplant.ai/platform/management-api/llms.txt`
- Overview: `https://docs.voximplant.ai/platform/management-api/overview.md`
- Basics: `https://docs.voximplant.ai/platform/management-api/basics.md`
- Authorization: `https://docs.voximplant.ai/platform/management-api/authorization.md`
- Callbacks: `https://docs.voximplant.ai/platform/management-api/callbacks.md`
- Child accounts: `https://docs.voximplant.ai/platform/management-api/child-accounts.md`
- Secure logs and recordings: `https://docs.voximplant.ai/platform/management-api/secure-objects.md`
- VoxEngine CI: `https://docs.voximplant.ai/platform/voxengine/ci.md`

For fuller guidance, read `reference.md`. For task patterns, read `examples.md`.
