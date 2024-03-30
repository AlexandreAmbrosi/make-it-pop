import { join } from 'node:path';
import { nodeFileTrace } from '@vercel/nft';
import { writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';

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
            entrypoint: "build/index.js",
            runtime: "nodejs18.x",
        },
    ],
    framework: {
        name: "sveltekit",
        version: "1.20.4",
    },
};

const amplifyDirectories = [
    join(process.cwd(), '.amplify-hosting'),
    join(process.cwd(), '.amplify-hosting', 'static'),
    join(process.cwd(), '.amplify-hosting', 'compute'),
    join(process.cwd(), '.amplify-hosting', 'compute', 'default'),
    join(process.cwd(), '.amplify-hosting', 'compute', 'default', 'node_modules'),
]

amplifyDirectories.forEach((i => {
    if (!existsSync(i)) mkdirSync(i)
}))

const functionsConfigPath = join(
    process.cwd(),
    "/.amplify-hosting/deploy-manifest.json",
);

writeFileSync(
    functionsConfigPath,
    JSON.stringify(deployManifestConfig),
);

cpSync(join(process.cwd(), 'build', 'client'), amplifyDirectories[1], { recursive: true })

/**
* Exports a function to write a json that computes dependencies required by given paths
* @param paths List of paths for which dependencies need to be computed
* @param filename Name of the file to write json to
* @returns void
*/
async function computeDependencies(paths = []) {
    // the whole app inside index.js,
    // include other paths that are
    // not bundled with your app builds
    const files = paths
    // Compute file trace
    const { fileList } = await nodeFileTrace(files)
    // Store set of packages
    let packages = {}
    fileList.forEach((i) => {
        if (i.includes('node_modules/')) {
            let temp = i.replace('node_modules/', '')
            temp = temp.substring(0, temp.indexOf('/'))
            packages[`node_modules/${temp}`] = true
        } else
            packages[i] = true
    })
    // Sort the set of packages by name (for easier difference comparison with git)
    packages = Object.keys(packages)
        .sort()
    // Dump the list of the computed packages for further references while deploying the app
    packages.forEach(i => {
        cpSync(i, join(amplifyDirectories[3], i), { recursive: true })
    })

}

computeDependencies(['./build/index.js'])
