# Management API Examples

Use these examples as workflow scaffolding. Verify method details through docs before executing or generating final code.

## Ask for Setup

When the user wants the agent to manage Voximplant resources:

```text
To automate this through Voximplant, I need:
- the local project folder we are working in
- the service account JSON filename, for example voximplant-service-account.json
- the target Voximplant account/application, only if you already know it

For the simplest workflow, put the JSON file in the project root. If its name ends with `_private.json`, I can find it by filename; if you renamed it, send me the filename. I will check `.gitignore` and add the filename if needed before using it. Do not send your main Voximplant account password.

For maximum convenience, create the service account with a broad role such as Developer or Owner. If security is more important and you know the exact task, use minimum task-specific roles instead.

If you are new to Voximplant, I can use safe defaults and do the setup for you. You only need the Voximplant account, service account JSON, and provider API keys only when your use case needs an AI or voice provider.
```

## Beginner Use Case Consultation

When the user is non-technical or unsure where to start:

```text
Let's start from the use case, not the API.

Please tell me:
- who calls whom
- whether this is inbound, outbound, or softphone-only testing
- which AI/provider you want to use, if any
- what should count as a successful first test

I can suggest default Voximplant objects and tell you exactly which credentials or manual approvals are needed.
After you provide service account JSON credentials, I can write the scenario, create the platform resources, upload secrets, deploy, test, and retrieve logs for debugging.
```

## Create a Test Bot Environment

For a request like "create an app, user, rule, and scenario":

1. Search docs for application, user, scenario, and routing-rule methods.
2. Ask for the service account JSON filename and target account if needed.
3. Confirm names:
   - application name
   - user name
   - scenario name
   - routing rule name/pattern
4. Present the exact create/update plan.
5. Wait for approval.
6. Create resources in dependency order.
7. Return IDs and next test instructions.

## Deploy With Management API

Use this as the default path for creating or updating platform resources:

```text
Recommended flow:
1. Verify the relevant Management API methods.
2. Confirm the service account JSON filename and target account/application.
3. Read the local scenario/rule inputs from the confirmed project folder.
4. Present the exact resources and fields that will change.
5. Wait for approval.
6. Create or update the scenario, routing rule, users, and secrets through an official API client or direct HTTPS.
7. Return resource IDs and the test instructions.
```

## Optional VoxEngine CI Deploy

Use this only when the user already has or explicitly wants a VoxEngine CI project:

```text
Optional CI flow:
1. Install or reuse `@voximplant/voxengine-ci`.
2. Configure `VOX_CI_CREDENTIALS`.
3. Run `npx voxengine-ci init` only if the project is not initialized.
4. Run upload with `--dry-run`.
5. Review output.
6. Upload only after approval.
```

## Start a Scenario

For a request like "start this scenario from API":

1. Verify `StartScenarios` docs.
2. Confirm `rule_id` or the rule lookup path.
3. Confirm `script_custom_data` shape if used.
4. Call through official client or HTTPS request with JWT.
5. Return `media_session_access_url` if provided and explain how it can be used for remote session interaction.

## Retrieve Logs or Recordings

Before accessing secure objects:

1. Confirm the target session/call/history item.
2. Verify the required secure-object authorization flow.
3. Confirm the service account role allows access.
4. Avoid exposing recordings/logs in public output unless the user asks for a specific excerpt or summary.

## Debug Call Via Logs

When the user says a test call failed:

```text
I can debug this from platform logs. Please provide any of:
- approximate call time and timezone
- source/destination or application user
- session/call/history ID
- what you expected and what happened

I will retrieve the relevant call history/logs through the Management API, summarize the evidence, and then use the VoxEngine debug workflow to fix the scenario code.
```

Then:

1. Search docs for the current call history and secure-object methods.
2. If the user gave no details, retrieve the latest call in the application first.
3. If the latest call is not the target, ask for a narrower time window, source/destination, phone user, session URL, or call/session ID.
4. Search logs for exceptions, disconnect reasons, provider failures, missing secrets, and event ordering issues.
5. Share concise findings, not raw logs, unless the user asks.
6. Hand the evidence to `voximplant-voxengine-dev` for code-level fixes.

## Test Without Buying A Number

When the user wants to test through a softphone:

```text
I can set up a no-number test using https://phone.voximplant.com/.
With your approval I will:
- create or reuse a Voximplant application user
- generate a temporary password
- confirm the routing path to the scenario
- store test credentials in an ignored `.env` or provide variables for you to fill

Then you can log in to the softphone and place the test call.
For `Enter destination`, use the real destination if the route expects one. For a call inside the same application, type any simple value, for example `1`.
```

Use clear variable names:

```text
VOXIMPLANT_SOFTPHONE_USER=
VOXIMPLANT_SOFTPHONE_PASSWORD=
VOXIMPLANT_APPLICATION_NAME=
```

## Phone Number Verification Warning

When the user wants to buy or rent a number:

```text
Before we buy a number, note that some countries and number types require identity, business, address, or use-case verification. The Management API cannot bypass those requirements.

Tell me the target country and number type. I will check the current guidance, explain any manual verification steps, and suggest a softphone test path while verification is pending.
```

## Confirmation Template

```text
I am about to change Voximplant resources:
- Account: [account]
- Application: [application]
- Operation: [operation]
- Resources: [names/ids]
- Charges: [none/possible/unknown]
- Reversible: [yes/no/partial]

Reply "yes" to proceed.
```
