# Voximplant AI Agent Skills

Voximplant AI Agent Skills help coding agents build, deploy, test, and debug Voximplant voice applications. They work with Cursor, Claude Code, Codex, and other clients that support the Agent Skills format.

Use them when you want an agent to write VoxEngine scenarios, automate Voximplant setup, deploy and test call flows, or debug real calls from platform logs.

## Quick Install


| Client      | Recommended path                            | Status                   |
| ----------- | ------------------------------------------- | ------------------------ |
| Cursor      | Install from Cursor Marketplace             | Coming soon              |
| Claude Code | Add this repository as a plugin marketplace | Available from this repo |
| Codex       | Add this repository as a plugin marketplace | Available from this repo |


Claude Code:

```text
/plugin marketplace add voximplant/voximplant-ai-agent-skills
/plugin install voximplant-ai-agent-skills@voximplant
```

Codex:

```text
codex plugin marketplace add voximplant/voximplant-ai-agent-skills
```

Cursor Marketplace publication is planned. Until it is approved, use the manual setup below or install the plugin locally from this repository if you are testing plugin development.

Prefer manual setup? See [Manual Install](#manual-install).

## Contents

- [Included Skills](#included-skills)
- [Install In Cursor](#install-in-cursor)
- [Install In Claude Code](#install-in-claude-code)
- [Install In Codex](#install-in-codex)
- [Manual Install](#manual-install)
- [Useful Prompts](#useful-prompts)
- [What You Need To Provide](#what-you-need-to-provide)
- [Documentation Sources](#documentation-sources)
- [Credentials And Security](#credentials-and-security)
- [Testing And Debugging](#testing-and-debugging)
- [Feedback And Contributions](#feedback-and-contributions)
- [Beta Notice](#beta-notice)

## Included Skills


| Skill                       | Use when                                                                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `voximplant-voxengine-dev`  | Writing, reviewing, validating, or debugging VoxEngine scenario code.                                                                                 |
| `voximplant-management-api` | Automating Voximplant account setup, resources, deployment, users, secrets, sessions, logs, and recordings through the Management API or API clients. |


Many workflows need both skills. `voximplant-voxengine-dev` handles scenario code and code-level debugging. `voximplant-management-api` handles platform resources, deployment, call history, logs, recordings, and uploading Voximplant secrets.

## Install In Cursor

Cursor Marketplace publication is planned after review. Once approved, this README will link to the marketplace listing.

For now, choose one of these paths:

- Use [Manual Install](#manual-install) to copy the skill folders into Cursor.
- For local plugin testing, copy or link `plugins/voximplant-ai-agent-skills` into `~/.cursor/plugins/local/voximplant-ai-agent-skills`, then reload Cursor.
- For Cursor Teams or Enterprise, import this GitHub repository as a team marketplace from the Cursor dashboard when your workspace supports team marketplaces.

## Install In Claude Code

Add this repository as a plugin marketplace:

```text
/plugin marketplace add voximplant/voximplant-ai-agent-skills
```

Install the plugin:

```text
/plugin install voximplant-ai-agent-skills@voximplant
```

After installation, start a new Claude Code session or reload plugins if Claude Code asks you to do so.

## Install In Codex

Add this repository as a plugin marketplace:

```text
codex plugin marketplace add voximplant/voximplant-ai-agent-skills
```

Then open the plugin browser in Codex, select the Voximplant marketplace, and install `voximplant-ai-agent-skills`.

Public Codex Plugin Directory publication is a follow-up. The repository marketplace path works before public directory approval.

## Manual Install

If your client does not support plugins yet, or you prefer to manage skills yourself, clone this repository and copy the skill folders manually.

Copy these folders:

```text
plugins/voximplant-ai-agent-skills/skills/voximplant-voxengine-dev
plugins/voximplant-ai-agent-skills/skills/voximplant-management-api
```

Each skill folder must stay together with its adjacent files:

```text
voximplant-voxengine-dev/
  SKILL.md
  reference.md
  examples.md

voximplant-management-api/
  SKILL.md
  reference.md
  examples.md
```

Common destinations:


| Client      | User-level destination | Project-level destination |
| ----------- | ---------------------- | ------------------------- |
| Cursor      | `~/.cursor/skills/`    | `.cursor/skills/`         |
| Claude Code | `~/.claude/skills/`    | `.claude/skills/`         |
| Codex       | `~/.agents/skills/`    | `.agents/skills/`         |


macOS/Linux example:

```bash
git clone https://github.com/voximplant/voximplant-ai-agent-skills.git
mkdir -p ~/.cursor/skills ~/.claude/skills ~/.agents/skills
cp -R voximplant-ai-agent-skills/plugins/voximplant-ai-agent-skills/skills/voximplant-voxengine-dev ~/.cursor/skills/
cp -R voximplant-ai-agent-skills/plugins/voximplant-ai-agent-skills/skills/voximplant-management-api ~/.cursor/skills/
```

Windows PowerShell example for Cursor:

```powershell
git clone https://github.com/voximplant/voximplant-ai-agent-skills.git
New-Item -ItemType Directory -Force "$env:USERPROFILE\.cursor\skills"
Copy-Item -Recurse -Force "voximplant-ai-agent-skills\plugins\voximplant-ai-agent-skills\skills\voximplant-voxengine-dev" "$env:USERPROFILE\.cursor\skills\"
Copy-Item -Recurse -Force "voximplant-ai-agent-skills\plugins\voximplant-ai-agent-skills\skills\voximplant-management-api" "$env:USERPROFILE\.cursor\skills\"
```

Use the destination for your client, then reload or restart the client if the skills do not appear immediately.

## Useful Prompts

```text
Use Voximplant AI Agent Skills to build an inbound Voice AI scenario.
```

```text
Use Voximplant AI Agent Skills to deploy and test this VoxEngine scenario.
```

```text
I am new to Voximplant. Please choose safe defaults and tell me exactly which credentials you need.
```

If you are not a developer, start with your use case. A good agent should explain the Voximplant pieces, propose a simple first test, and ask only for the credentials or approvals that are actually needed.

## What You Need To Provide

For most first projects, you only need:

1. A Voximplant account.
2. A service account JSON file. For the easiest workflow, use a broad role such as Developer or Owner; for stricter security, use task-specific roles.
3. Provider API keys only if the use case needs an external AI, LLM, speech, or voice provider.
4. Phone-number verification and account balance only if you need to buy or rent phone numbers.

The skills can help with the rest: writing the VoxEngine scenario, creating applications, rules, users, secrets, uploading code, testing through a softphone, retrieving logs, and debugging failures.

## Documentation Sources

Agents should use these sources to verify API names, method signatures, and current examples:

- `https://docs.voximplant.ai/llms.txt` for the documentation index
- `https://docs.voximplant.ai/api-reference/llms.txt` for API Reference discovery
- section-level indexes such as `https://docs.voximplant.ai/platform/voxengine/llms.txt`
- page Markdown by appending `.md` to a docs page URL

Do not paste large documentation dumps into prompts by default. Prefer narrow page-level Markdown fetches. For VoxEngine TypeScript declarations, follow `voximplant-voxengine-dev`; the declaration file is best downloaded locally and used for validation rather than loaded as a general README source.

## Credentials And Security

For real account actions, the user usually needs only:

- a Voximplant account
- a Voximplant service account JSON
- provider API keys only when the chosen use case needs an external AI/LLM/voice provider
- phone-number verification and account balance only when the workflow requires buying or renting phone numbers
- approval before the agent creates, changes, deletes, uploads, buys, binds, or starts platform resources

For the easiest agent workflow, create a service account with a broad role such as Developer or Owner. If security is more important and you know the exact task, use the minimum roles for that task instead.

The simplest credential handoff is to put the service account JSON in the project root and tell the agent the filename, for example `voximplant-service-account.json`. If you keep the default filename ending in `_private.json`, the agent should find it automatically. Do not commit the file. The agent should check or update `.gitignore` before working with local credentials.

Treat service account JSON files as path-only secrets by default. Give the agent the filename or path, not the JSON contents. Reading the private key into chat may send it through the LLM provider and store it in conversation logs.

The agent should not ask for:

- your main Voximplant account password
- browser cookies or control panel session tokens
- secrets committed into source control

If a `.env` file is useful, the agent should create safe variable names or placeholders and tell you what values to provide. Do not commit `.env`, service account JSON files, private keys, or recordings/logs that may contain user data.

## Testing And Debugging

The skills encourage a practical loop:

1. Build or update the scenario.
2. Deploy or configure platform resources after your approval.
3. Test with a real call.
4. If you do not have a phone number, test with a Voximplant application user at `https://phone.voximplant.com/`.
5. If the call fails, tell the agent what happened. It can retrieve platform logs through the Management API skill and debug the VoxEngine code from evidence.

If your workflow requires buying a phone number, note that some countries and number types require identity, business, address, or use-case verification. The agent should warn you early, explain which steps may be manual, and offer a softphone test path while verification is pending.

## Feedback And Contributions

After publication, please use GitHub Issues for bugs or confusing instructions, GitHub Discussions for ideas and usage questions, and pull requests for proposed improvements.

External pull requests should come from forks and will be reviewed by Voximplant maintainers before merge. The `main` branch is protected; direct pushes and unreviewed external changes are not accepted.

## Beta Notice

These skills are beta. Review generated code and approve platform-changing operations explicitly before running them against a real Voximplant account.