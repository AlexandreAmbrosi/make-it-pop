<script lang="ts">
  import GitHubIcon from 'virtual:icons/devicon/github'
  import TwitterIcon from 'virtual:icons/devicon/twitter'
  import LinkedInIcon from 'virtual:icons/devicon/linkedin'
  import Logo from './Logo.svelte'

  interface Props {
    /*
    A component that can be used anywhere in your app

    <Footer
      twitter="rishi_raj_jain_"
      brand_name="ACME"
    />
  */
    brand_name: string
    twitter?: string
  }

  let { brand_name = 'ACME', twitter = 'rishi_raj_jain_' }: Props = $props()
</script>

<footer class="relative mx-auto mt-8 flex max-w-7xl flex-col p-8 xl:grid xl:grid-cols-5">
  <div class="flex flex-col space-y-8 xl:col-span-2">
    <a href="/" class="flex flex-row items-center gap-x-2">
      <Logo />
      <span class="font-semibold text-[#9810fa]">{brand_name}</span>
    </a>
    <p class="max-w-xs text-sm text-gray-500">The complete Astro, SvelteKit, Next.js full-stack starter kits to help you launch fast.</p>
    <div class="flex items-center space-x-2">
      <a target="_blank" href={`https://twitter.com/${twitter}`} class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">Twitter</span>
        <TwitterIcon width="22" height="22" />
      </a>
      <div class="h-8 border-l"></div>
      <a target="_blank" href="https://github.com/rishi-raj-jain" class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">Github</span>
        <GitHubIcon width="22" height="22" />
      </a>
      <div class="h-8 border-l"></div>
      <a target="_blank" href="https://www.linkedin.com/in/rishi-raj-jain/" class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">LinkedIn</span>
        <LinkedInIcon width="22" height="22" />
      </a>
    </div>
    <a target="_blank" href="https://www.launchfa.st" class="flex max-w-max flex-row items-center rounded border border-purple-600 px-2 py-1 text-purple-600 hover:scale-[101%]">
      <span>Built with</span>
      <div class="ml-2 flex flex-row items-center">
        <img height="20" width="20" loading="lazy" decoding="async" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/purple-icon.png" alt="LaunchFast Logo" />
        <span class="ml-1">LaunchFa.st</span>
      </div>
    </a>
  </div>
  <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
    <div class="md:grid md:grid-cols-2 md:gap-8">
      <div>
        <h3 class="text-sm font-semibold">Product</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/#pricing">Pricing</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/changelog">Changelog</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="mailto:contact@launchfa.st">Support</a>
          <a target="_blank" class="text-sm text-gray-500 hover:text-gray-900" href="https://code-templates.lemonsqueezy.com/affiliates">Affiliates - Earn 40%</a>
        </div>
      </div>
      <div class="mt-10 md:mt-0">
        <h3 class="text-sm font-semibold">Content</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/blog">Blog</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/docs">Documentation</a>
        </div>
      </div>
    </div>
    <div class="md:grid md:grid-cols-2 md:gap-8">
      <div>
        <h3 class="text-sm font-semibold">Company</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/#faq">FAQ</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/careers">Careers</a>
        </div>
      </div>
      <div class="mt-10 md:mt-0">
        <h3 class="text-sm font-semibold">Legal</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/privacy">Privacy</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/terms">Terms</a>
        </div>
      </div>
    </div>
  </div>
</footer>
