import node from '@sveltejs/adapter-node'
import vercel from '@sveltejs/adapter-vercel'
import netlify from '@sveltejs/adapter-netlify'

const nodeAdapter = node()

const netlifyAdapter = netlify({
    edge: false,
    split: false,
})

const vercelAdapter = vercel({
    split: false,
    runtime: 'nodejs18.x',
})

const adapters = {
    node: nodeAdapter,
    vercel: vercelAdapter,
    netlify: netlifyAdapter,
}

export default (adapters[process.env.DEPLOYMENT_PLATFORM] ?? adapters['node'])
