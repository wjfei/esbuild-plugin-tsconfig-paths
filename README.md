# esbuild-plugin-tsconfig-paths

English | [中文](README.zh-CN.md)

Converts TypeScript path aliases defined in `tsconfig.json` (`compilerOptions.paths`)
into relative import paths during an esbuild build. This removes the need for
runtime alias resolution and makes emitted code portable.

## Example

Before
```typescript
// src/app/index.ts
import util from "@/utils/util"
```

After
```
import util from "../utils/util"
```


## Install

```sh
npm install esbuild-plugin-tsconfig-paths --dev
```

## Usage

```typescript
import { tsconfigPathsPlugin } from "esbuild-plugin-tsconfig-paths";
import esbuild from "esbuild";

esbuild.build({
    // ...other config
    plugins: [
        // ... other plugins
        tsconfigPathsPlugin({
            // Directory of tsconfig file
            cwd: process.cwd(),
            // tsconfig filename
            tsconfig: "custom-tsconfig.json",
            // which files will be transformed
            filter: /.*/,
        })
    ]
})

```

## Options

| Option   | Type     | Default          | Description                                   |
|----------|----------|------------------|-----------------------------------------------|
| `filter` | `RegExp` | `/.*/`           | Matches files to transform in `onLoad`.       |
| `tsconfig` | `string` | `tsconfig.json` | Tsconfig filename used to resolve aliases.     |
| `cwd`    | `string` | `process.cwd()`  | Directory used to locate the tsconfig file.   |

## Notes

- Requires `compilerOptions.paths` in your `tsconfig.json`. `baseUrl` defaults to `./`.
- Runs in esbuild’s `onLoad` phase and rewrites matched import specifiers to relative paths.
- Emits with `loader: 'ts'`, targeting TypeScript sources. Avoid matching `.tsx` files with `filter`.
- Only rewrites static import specifiers; dynamic imports or non-path-based resolution are not changed.

## Why use this

- Ships portable code without relying on runtime alias resolution.
- Keeps source imports clean with aliases while producing relative paths for consumers.

## License

MIT
