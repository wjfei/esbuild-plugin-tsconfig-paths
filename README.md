# esbuild-plugin-tsconfig-paths

Transform `compilerOptions.paths` alias to relative path;

For example:

before transformed

```typescript
// src/app/index.ts
import util from "@/utils/util"
```

after transformed
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