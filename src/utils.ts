import tsPaths from 'tsconfig-paths';
import path from 'path';

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