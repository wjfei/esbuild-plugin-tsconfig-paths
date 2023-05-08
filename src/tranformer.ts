import tsPaths from 'tsconfig-paths';
import ts from 'typescript';
import { getNoAliasPath } from './utils';

interface GetTransformerOptions {
    sourcePath: string;
    tsLib: typeof ts;
}

export function getTransformer(options: GetTransformerOptions, matcher: tsPaths.MatchPath) {
    const { sourcePath, tsLib } = options;

    return (context: ts.TransformationContext): ts.Transformer<any> => {
        return function visitNode(node: any) {

            try {
                if (tsLib.isImportDeclaration(node) || tsLib.isExportDeclaration(node) && node.moduleSpecifier) {


                    const importPath =
                        node.moduleSpecifier && (node.moduleSpecifier as any).text;

                    if (!importPath) {
                        return node;
                    }

                    const relativePath = getNoAliasPath(sourcePath, importPath, matcher);

                    if (!relativePath) {
                        return node
                    }

                    const newModuleSpecifier = tsLib.factory.createStringLiteral(relativePath);
                    (newModuleSpecifier as any).parent = node.moduleSpecifier.parent

                    if (tsLib.isImportDeclaration(node)) {
                        const newNode = tsLib.factory.updateImportDeclaration(node, node.modifiers, node.importClause, newModuleSpecifier, node.assertClause);

                        (newNode as any).flags = node.flags;

                        return newNode;
                    } else if (tsLib.isExportDeclaration(node)) {
                        const newNode = tsLib.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, newModuleSpecifier, node.assertClause);

                        (newNode as any).flags = node.flags;

                        return newNode;
                    }
                }

            } catch (error) {
                console.log(error)
                return node

            }

            return tsLib.visitEachChild(node, visitNode, context);
        }
    }
}

