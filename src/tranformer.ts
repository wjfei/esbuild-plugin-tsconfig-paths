import tsPaths from 'tsconfig-paths';
import ts from 'typescript';
import { getNoAliasPath } from './utils';

interface GetTransformerOptions {
    sourcePath: string;
}

export function getTransformer(options: GetTransformerOptions, matcher: tsPaths.MatchPath) {
    const { sourcePath } = options;

    return (context: ts.TransformationContext): ts.Transformer<any> => {
        return function visitNode(node: any) {

            try {
                if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node) && node.moduleSpecifier) {
                    const importPath =
                        node.moduleSpecifier && node.moduleSpecifier.getText();

                    if (!importPath) {
                        return node;
                    }

                    const relativePath = getNoAliasPath(sourcePath, importPath, matcher);

                    if (!relativePath) {
                        return node
                    }

                    const newModuleSpecifier = ts.factory.createStringLiteral(relativePath);
                    (newModuleSpecifier as any).parent = node.moduleSpecifier.parent

                    if (ts.isImportDeclaration(node)) {
                        const newNode = ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause, newModuleSpecifier, node.assertClause);

                        (newNode as any).flags = node.flags;

                        return newNode;
                    } else if (ts.isExportDeclaration(node)) {
                        const newNode = ts.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, newModuleSpecifier, node.assertClause);

                        (newNode as any).flags = node.flags;

                        return newNode;
                    }
                }

            } catch (error) {
                return node

            }

            return ts.visitEachChild(node, visitNode, context);
        }
    }
}

