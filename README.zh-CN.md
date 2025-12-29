# esbuild-plugin-tsconfig-paths

[English](README.md) | [中文](README.zh-CN.md)

将 `compilerOptions.paths` 的别名转换为相对路径。

示例：

转换前

```typescript
// src/app/index.ts
import util from "@/utils/util"
```

转换后
```
import util from "../utils/util"
```

## 安装

```sh
npm install esbuild-plugin-tsconfig-paths --dev
```

## 使用

```typescript
import { tsconfigPathsPlugin } from "esbuild-plugin-tsconfig-paths";
import esbuild from "esbuild";

esbuild.build({
    // ...other config
    plugins: [
        // ... other plugins
        tsconfigPathsPlugin({
            // tsconfig 文件所在目录
            cwd: process.cwd(),
            // tsconfig 文件名
            tsconfig: "custom-tsconfig.json",
            // 需要被转换的文件匹配规则
            filter: /.*/,
        })
    ]
})

```
