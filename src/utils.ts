import tsPaths from 'tsconfig-paths';
import path from 'path';
import os from 'os';

export function getNoAliasPath(sourcePath: string, importPath: string, matcher: tsPaths.MatchPath) {
    let formatSourcePath = sourcePath;
    let formatImportPath = importPath;

    let result = matcher(formatImportPath, undefined, undefined, [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
    ]);

    if (!result) {
        return null;
    }
    formatImportPath = result;

    if (os.platform() === 'win32') {
        formatImportPath = formatImportPath.replace(/\\/g, '/')
        formatSourcePath = formatSourcePath.replace(/\\/g, '/')
    }


    try {
        const packagePath = require.resolve(importPath, {
            paths: [process.cwd(), ...module.paths],
        });
        if (packagePath) {
            return importPath;
        }
    } catch { }

    const resolvedPath = path.posix.relative(path.dirname(formatSourcePath), formatImportPath) || './';

    return resolvedPath[0] === '.' ? resolvedPath : './' + resolvedPath;
}