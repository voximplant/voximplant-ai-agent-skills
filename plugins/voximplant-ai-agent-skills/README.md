# Voximplant AI Agent Skills

This plugin installs two Agent Skills for building, deploying, testing, and debugging Voximplant voice applications with AI coding agents.

## Included Skills

| Skill | Use when |
| --- | --- |
| `voximplant-voxengine-dev` | Writing, reviewing, validating, or debugging VoxEngine scenario code. |
| `voximplant-management-api` | Creating platform resources, uploading scenarios, testing calls, and retrieving logs through the Management API. |

Most real workflows use both skills: one handles scenario code, the other handles Voximplant account resources and runtime evidence.

## How To Use

After installing the plugin, ask your agent for the result you want:

```text
Use Voximplant AI Agent Skills to build an inbound Voice AI scenario.
```

```text
Use Voximplant AI Agent Skills to deploy and test this VoxEngine scenario.
```

In clients that support explicit skill invocation, you can also invoke the skills by name.

## What You Need

For most first projects, you only need:

1. A Voximplant account.
2. A Voximplant service account JSON file.
3. Provider API keys only if the use case needs an external AI, LLM, speech, or voice provider.
4. Approval before the agent creates, changes, deletes, uploads, buys, binds, or starts platform resources.

The agent should not ask for your main Voximplant account password, browser cookies, control panel session tokens, or secrets committed into source control.

Treat service account JSON files as path-only secrets by default. Give the agent the filename or path, not the JSON contents. Reading the private key into chat may send it through the LLM provider and store it in conversation logs.

## Documentation Lookup

These skills use public Voximplant documentation sources:

- `https://docs.voximplant.ai/llms.txt`
- section-level indexes such as `https://docs.voximplant.ai/platform/voxengine/llms.txt`
- focused page Markdown by appending `.md` to docs page URLs
- VoxEngine type declarations at `https://cdn.voximplant.com/voxengine_typings/voxengine.d.ts`

## Safety

Review generated code before production use. The Management API skill must ask for explicit approval before platform-changing operations or actions that can incur charges.
