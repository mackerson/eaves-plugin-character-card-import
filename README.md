# Character Card Import

**Version**: 1.0.0
**ID**: `com.enclave.character-card-import`

Import AI character cards (PNG with embedded metadata) as Enclave agents.

This plugin ships with Enclave (`tier: bundled`). It is developed here and
symlinked into the core for local work — see
[enclave-ai](https://github.com/mackerson/enclave-ai).

## Permissions

- `ui:views:register`
- `events:listen` / `events:emit`
- `data:agents:write`
- `system:filesystem`

## Development

```bash
yarn install
yarn build
```

The UI bundle is `ui/dist/`, produced by Vite. The backend entry is `index.cjs`.

## License

MIT — Ackerson Labs
