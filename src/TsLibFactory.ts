
export class TsLibFactory {
    ts: any;

    import() {
        try {
            if (this.ts) {
                return this.ts;
            }

            const tsPath = require.resolve('typescript', {
                paths: [process.cwd(), ...module.paths]
            })

            const tsLib = require(tsPath);
            this.ts = tsLib;
            return tsLib;
        } catch (error) {
            throw new Error('Please install typescript');
        }
    }
}