# esbuild-plugin-tsconfig-paths

[English](README.md) | 中文

在 esbuild 构建过程中，将 `tsconfig.json` 中 `compilerOptions.paths` 定义的
路径别名转换为相对导入路径。这样无需在运行时处理别名解析，产物更易于分发和使用。

## 示例

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

## 参数说明

| 参数       | 类型      | 默认值           | 说明                         |
|------------|-----------|------------------|------------------------------|
| `filter`   | `RegExp`  | `/.*/`           | 匹配需要转换的文件路径。     |
| `tsconfig` | `string`  | `tsconfig.json`  | 指定使用的 tsconfig 文件名。 |
| `cwd`      | `string`  | `process.cwd()`  | 查找 tsconfig 的工作目录。   |

## 注意事项

- 需要在 `tsconfig.json` 中配置 `compilerOptions.paths`；`baseUrl` 默认 `./`。
- 在 esbuild 的 `onLoad` 阶段执行，将匹配到的导入语句改写为相对路径。
- 以 `loader: 'ts'` 输出，目标为 TypeScript 源码；建议不要让 `filter` 匹配 `.tsx` 文件。
- 仅改写静态导入语句；动态导入或非路径规则的解析不会变更。

## 为什么需要

- 产物不依赖运行时别名解析，部署更简单。
- 源码保持别名的整洁写法，构建后面向消费者的是相对路径。

## 许可协议

MIT
