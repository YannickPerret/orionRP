const esbuild = require("esbuild");

const IS_WATCH_MODE = process.env.IS_WATCH_MODE === '1';

const TARGET_ENTRIES = [
    {
        target: "node16",
        entryPoints: ["server/main.ts"],
        platform: "node",
        outfile: "./build/server/main.js",
    },
    {
        target: "es2020",
        entryPoints: ["client/main.ts"],
        outfile: "./build/client/main.js",
    },
];

const buildBundle = async () => {
    try {
        const baseOptions = {
            logLevel: "info",
            bundle: true,
            charset: "utf8",
            minifyWhitespace: true,
            absWorkingDir: process.cwd(),
        };

        for (const targetOpts of TARGET_ENTRIES) {
            const mergedOpts = { ...baseOptions, ...targetOpts };

            if (IS_WATCH_MODE) {
                // Using esbuild's context API for watch mode
                const ctx = await esbuild.context(mergedOpts);
                await ctx.watch();
                console.log(`[ESBuild Watch] (${targetOpts.entryPoints[0]}) Watching for changes...`);
            } else {
                const { errors } = await esbuild.build(mergedOpts);

                if (errors.length) {
                    console.error(`[ESBuild] Bundle failed with ${errors.length} errors`);
                    process.exit(1);
                }
            }
        }
    } catch (e) {
        console.log("[ESBuild] Build failed with error");
        console.error(e);
        process.exit(1);
    }
};

buildBundle().catch(() => process.exit(1));
