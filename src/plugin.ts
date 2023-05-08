import { createMatchPath } from 'tsconfig-paths/lib/index';
import { DEFAULT_CONFIG_NAME, DEFAULT_FILTER, PLUGIN_NAME } from "./constants";
import ts from 'typescript';
import { getTransformer } from './tranformer';
import { TsLibFactory } from './TsLibFactory';

export interface TsconfigPathsPluginOptions {
    filter?: RegExp;
    tsconfig?: string;
    cwd?:string;
}

export function tsconfigPathsPlugin(options?: TsconfigPathsPluginOptions) {
    const { filter, tsconfig = DEFAULT_CONFIG_NAME, cwd } = options ?? {};
    const tsLib: typeof ts = new TsLibFactory().import();

    const tsconfigPath = tsLib.findConfigFile(cwd || process.cwd(), tsLib.sys.fileExists, tsconfig);


    const { config, error } = tsLib.readConfigFile(tsconfigPath, tsLib.sys.readFile);

    if (error) {
        throw error;
    }

    const { paths = {}, baseUrl = './' } = config?.compilerOptions || {};

    const pathMatcher = createMatchPath(baseUrl!, paths, ['main']);

    return {
        name: PLUGIN_NAME,
        setup(build) {
            build.onLoad({ filter: filter || DEFAULT_FILTER }, (args) => {
                const fromPath = args.path;

                const program = tsLib.createProgram([fromPath], {});
                const sourceFile = program.getSourceFile(fromPath);
                const tranformer = tsLib.transform(sourceFile, [getTransformer({ sourcePath: fromPath, tsLib }, pathMatcher)])

                const printer = tsLib.createPrinter({ newLine: tsLib.NewLineKind.LineFeed });
                const code = printer.printFile(tranformer.transformed[0]);

                return {
                    contents: code,
                    loader: 'ts'
                }
            })
        }
    }
}
