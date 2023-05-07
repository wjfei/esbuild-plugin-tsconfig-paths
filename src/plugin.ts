import tsPaths from 'tsconfig-paths';
import { DEFAULT_FILTER, PLUGIN_NAME } from "./constants";
import { TsconfigPathsPluginOptions } from "./typing";
import { getTsConfig } from "./utils";
import ts from 'typescript';
import { getTransformer } from './tranformer';



export function tsconfigPathsPlugin(options?: TsconfigPathsPluginOptions) {
    const { filter, tsconfig, cwd } = options ?? {};

    const tsconfigJson = getTsConfig(cwd || process.cwd(), tsconfig);
    const { paths = {}, baseUrl = './' } = tsconfigJson?.compilerOptions;

    const pathMatcher = tsPaths.createMatchPath(baseUrl!, paths, ['main']);

    return {
        name: PLUGIN_NAME,
        setup(build) {
            build.onLoad({ filter: filter || DEFAULT_FILTER }, (args) => {
                const fromPath = args.path;

                const program = ts.createProgram([args.path], {});
                const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

            })
        }
    }
}
