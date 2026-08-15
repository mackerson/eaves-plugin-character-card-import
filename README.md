# Character Card Import

**Version**: 1.0.0
**ID**: `com.eaves.character-card-import`

Import AI character cards (PNG with embedded metadata) as Eaves agents.

This plugin ships with Eaves (`tier: bundled`). It is developed here and
symlinked into the core for local work — see
[eaves](https://github.com/mackerson/eaves).

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
