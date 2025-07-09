declare global {
    namespace GraphileConfig {
        interface Plugins {
            MyRandomFieldPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface SchemaOptions {
            myDefaultMin?: number;
            myDefaultMax?: number;
        }
    }
}
export {};
//# sourceMappingURL=README-1.d.ts.map