import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

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

const functionsConfigPath = join(
    process.cwd(),
    "/.amplify-hosting/deploy-manifest.json",
);

writeFileSync(
    functionsConfigPath,
    JSON.stringify(deployManifestConfig),
);