# Management API Reference Notes

Use this file when the main skill needs more detail for Voximplant account automation, deployment, or operations.

## Source Priority

1. Management API Reference in `docs.voximplant.ai`
2. Management API pages under `https://docs.voximplant.ai/platform/management-api/`
3. Section-level `llms.txt` indexes
4. Official API client README files
5. VoxEngine CI documentation when CI is the selected deployment path

Use official API clients or direct HTTPS requests by default. Use VoxEngine CI only for an existing or explicitly requested CI-style project workflow.

## Credential Rules

Ask for a service account JSON when real API calls are required.

Do not ask for:

- the user's main account password
- browser cookies
- control panel session tokens
- credentials pasted into source files

Prefer:

- local secret files excluded from version control
- a service account JSON file in the project root, with the filename sent in chat
- path-only handling for service account JSON files: pass the filename or path to local commands and scripts instead of reading the private key into the agent conversation
- automatic filename discovery for root-level `*_private.json` files
- environment variables or CI secret stores when the user already uses them
- broad service account roles such as Developer or Owner for the simplest beginner workflow
- minimum task-specific roles when security is more important and the user knows the exact task

If the user needs Voximplant secrets available to a scenario, uploading or updating those secrets is a Management API/platform task. The VoxEngine skill should only reference secrets that already exist or that this workflow creates after confirmation.

Avoid:

- committing service account JSON
- reading service account JSON contents into chat unless the user explicitly asks and understands that the private key may transit the LLM provider and be stored in conversation logs
- asking the user to hand-edit fragile credential file paths
- writing secrets to `.env` without explicit approval
- using a personal account password as automation credentials

## Role Planning

Before asking the user to create credentials, choose the role guidance:

- Beginner/easiest path: suggest a broad role such as Developer or Owner so the agent can create applications, rules, users, scenarios, secrets, and retrieve logs without repeated role changes.
- Security-focused path: explain the likely permission scope and ask the user to grant only what is needed.

Useful scopes to discuss for the security-focused path:

- scenario start/run: Scenarios role may be enough
- application/rule/scenario management: application and scenario management permissions are needed
- users: user management permissions are needed
- numbers/SIP: phone number or SIP permissions are needed
- logs/recordings: roles allowed to access secure objects are needed
- service account management: role-system permissions are needed
- secret management: roles that can create or update Voximplant secrets are needed
- SMS sending/history: SMS-specific permissions may be required beyond a general Developer role. If `A2PSendSms` or `A2PGetSmsHistory` returns `code: 100 Authorization failed` while the same JWT works for other methods, check role scope before debugging JWT generation.

If unsure, search the docs for the exact method and required role before advising. Do not block a beginner flow on fine-grained role planning if the user is comfortable granting a broad role.

## Beginner Consultation

When the user is not sure what they need, start with a short consultation instead of an API checklist:

- Ask for the business goal and who calls whom.
- Identify whether the first test can avoid phone-number purchase.
- Explain the minimum Voximplant objects involved: application, scenario, rule, user or number, and optional secrets.
- Recommend a safe first milestone: softphone test, test user, or single controlled outbound call.
- Tell the user that the agent can create the objects, write/upload the scenario, configure secrets, test, and retrieve logs after receiving service account JSON credentials and approval.

## Write Operation Confirmation

Before changing platform state, summarize:

- account or child account
- application
- resource type and name/ID
- operation
- whether it is reversible
- whether it can incur charges

Then wait for explicit user confirmation unless the user already gave direct approval for that exact operation.

## Deployment Choices

Use Management API clients or direct HTTPS when the user wants flexible automation:

- create or update applications, users, scenarios, rules, and secrets
- start scenarios
- retrieve call history, secure logs, and recordings
- integrate provisioning into an existing backend or agent workflow
- avoid pulling CI-specific dependencies into small tasks

Use VoxEngine CI only when the user wants project-like local source management:

- initialize local VoxEngine files
- create/update scenarios and routing rules
- upload with `--dry-run`
- upload after approval

If both paths fit, recommend Management API first and explain that CI is useful for teams already managing VoxEngine files as a local deployable project.

## Scenario And Rule Updates

Keep scenario code updates separate from rule-to-scenario binding changes.

- If you are updating scenario code, update the existing scenario in place with `SetScenarioInfo`.
- If you are changing which scenario a rule points to, use the documented binding primitive such as `BindScenario`, then verify the resulting rule/scenario association.
- Do not rely on `SetRuleInfo` to rebind a rule by passing `scenario_id`. It may accept the field and return `result: 1` without actually changing the bound scenario.
- If an unbind primitive is unavailable or returns an unknown-command response in the target account, prefer updating the existing scenario in place when the user's goal is only to change code.

## Call Debug Data

When a test call fails, the Management API part of the debug loop should collect platform evidence:

1. If the user gives no details, retrieve and inspect the latest call in the relevant application first.
2. If the latest call is not the target, identify the session or history item by time window, caller/callee, application user, rule, or provided ID.
3. Retrieve call history and any available secure objects.
4. Download or fetch logs/recordings only when the service account role allows it and the user approved access.
5. Search logs for exceptions, disconnect codes, missing secrets, failed HTTP/WebSocket requests, provider errors, and unexpected event ordering.
6. Summarize concise evidence for `voximplant-voxengine-dev`, which handles code-level diagnosis and fixes.

Do not paste full logs or recordings into public output by default. Provide excerpts, filenames, IDs, and a short diagnosis unless the user asks for raw output.

## Softphone Test Without A Phone Number

Use `https://phone.voximplant.com/` when the user needs a quick manual test without buying a phone number:

1. Create or reuse a Voximplant application user after approval.
2. Generate a strong temporary password.
3. Bind or confirm a routing path that lets the user reach the scenario.
4. Store test credentials in an ignored local `.env` only after explicit approval, or print them clearly for the user to copy into the softphone.
5. Give login instructions and the expected call flow. In the `Enter destination` field, tell the user to enter the real destination when one is needed; for a call inside the same application, entering any simple value such as `1` is enough.
6. After the user tests, retrieve logs if behavior differs from expected.

## Number Verification

Phone number purchase is not always a pure API operation. Some countries and number categories require regulatory verification before purchase or activation.

Before buying or binding numbers:

1. Confirm country, number type, and traffic use case.
2. Warn about possible identity, business, address, or use-case verification.
3. Check current docs or control panel instructions for that country when available.
4. Explain that verification may require manual user action and cannot be bypassed by service account credentials.
5. Offer a softphone/application-user test path while number verification is pending.

## API Reference Discovery

API Reference paths can move as docs evolve. Do not hardcode a guessed endpoint page. Search for the method name, for example:

- `AddApplication Management API`
- `AddScenario Management API`
- `SetScenarioInfo Management API`
- `BindScenario Management API`
- `SetRuleInfo Management API`
- `A2PSendSms Management API`
- `A2PGetSmsHistory Management API`
- `StartScenarios Management API`
- `GetCallHistory Management API`
- `DownloadHistoryReport Management API`
- `GetCallSessionHistory Management API`
- `GetCallHistoryAsync Management API`
- `GetCallSessionHistoryAsync Management API`

Use `https://docs.voximplant.ai/llms.txt` and the Management API section index first.
