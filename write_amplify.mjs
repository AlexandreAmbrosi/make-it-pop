import { join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const deployManifestConfig = {
    version: 1,
    routes: [
        {
            path: `/assets/*`,
            target: {
                kind: "Static",
            },
        },
        {
            path: `/*.*`,
            target: {
                kind: "Static",
            },
            fallback: {
                kind: "Compute",
                src: "default",
            },
        },
        {
            path: "/*",
            target: {
                kind: "Compute",
                src: "default",
            },
        },
    ],
    computeResources: [
        {
            name: "default",
            entrypoint: "index.js",
            runtime: "nodejs18.x",
        },
    ],
    framework: {
        name: "sveltekit",
        version: "1.20.4",
    },
};

mkdirSync(join(process.cwd(), '.amplify-hosting'))
mkdirSync(join(process.cwd(), '.amplify-hosting', 'static'))
mkdirSync(join(process.cwd(), '.amplify-hosting', 'compute'))
mkdirSync(join(process.cwd(), '.amplify-hosting', 'compute', 'default'))

const functionsConfigPath = join(
    process.cwd(),
    "/.amplify-hosting/deploy-manifest.json",
);

writeFileSync(
    functionsConfigPath,
    JSON.stringify(deployManifestConfig),
);