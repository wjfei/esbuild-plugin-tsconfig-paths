import tsPaths from 'tsconfig-paths';
import path from 'path';
import fs from 'fs';


export function getTsConfig(cwd: string, customTsconfig?: string) {
    let tsconfigPath = path.join(cwd, 'tsconfig.json');
    if (customTsconfig) {
        if (path.isAbsolute(customTsconfig)) {
            return customTsconfig;
        } else {
            return path.join(cwd, customTsconfig);
        }
    }

    if (fs.existsSync(tsconfigPath)) {
        const str = fs.readFileSync(tsconfigPath).toString('utf-8');

        return JSON.parse(str);
    }
}


export function getNoAliasPath(sourcePath: string, importPath: string, matcher: tsPaths.MatchPath) {
    let result = matcher(importPath, undefined, undefined, [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
    ]);

    if (!result) {
        return null;
    }

    try {
        const packagePath = require.resolve(importPath, {
            paths: [process.cwd(), ...module.paths],
        });
        if (packagePath) {
            return importPath;
        }
    } catch { }

    const resolvedPath = path.posix.relative(path.dirname(sourcePath), result) || './';
    return resolvedPath[0] === '.' ? resolvedPath : './' + resolvedPath;
}