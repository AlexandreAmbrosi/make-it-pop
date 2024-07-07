<script lang="ts">
  import GitHubIcon from 'virtual:icons/devicon/github'
  import TwitterIcon from 'virtual:icons/devicon/twitter'
  import LinkedInIcon from 'virtual:icons/devicon/linkedin'
  /*
    A component that can be used anywhere in your app

    <Footer
      twitter="rishi_raj_jain_"
      brand_name="launchfa.st"
    />
  */

  export let brand_name: string
  export let twitter: string = 'rishi_raj_jain_'
</script>

<footer class="relative mx-auto mt-8 flex max-w-7xl flex-col p-8 xl:grid xl:grid-cols-5">
  <div class="flex flex-col space-y-8 xl:col-span-2">
    <a href="/">
      <img decoding="async" loading="lazy" height="50" width="50" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/purple-icon.png?tr=w-50" alt={brand_name} />
    </a>
    <p class="max-w-xs text-sm text-gray-500">Launching SaaS just got faster today with LaunchFa.st 🚀</p>
    <div class="flex items-center space-x-2">
      <a target="_blank" rel="noreferrer" href={`https://twitter.com/${twitter}`} class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">Twitter</span>
        <TwitterIcon width="22" height="22" />
      </a>
      <div class="h-8 border-l"></div>
      <a target="_blank" rel="noreferrer" href="https://github.com/rishi-raj-jain" class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">Github</span>
        <GitHubIcon width="24" height="24" />
      </a>
      <div class="h-8 border-l"></div>
      <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/rishi-raj-jain/" class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">LinkedIn</span>
        <LinkedInIcon width="24" height="24" />
      </a>
    </div>
    <span class="text-xs font-light text-gray-400">
      © {new Date().getFullYear()}&nbsp;{brand_name}
    </span>
  </div>
  <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
    <div class="md:grid md:grid-cols-2 md:gap-8">
      <div>
        <h3 class="text-sm font-semibold">Product</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/#pricing">Pricing</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="mailto:contact@launchfa.st">Support</a>
          <a target="_blank" class="text-sm text-gray-500 hover:text-gray-900" href="https://affiliates.lemonsqueezy.com/programs/code-templates"> Affiliates - Earn 40% </a>
        </div>
      </div>
      <div class="mt-10 md:mt-0">
        <h3 class="text-sm font-semibold">Guides</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/blog">Blogs</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/documentation">Documentation</a>
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
    <div class="md:grid md:grid-cols-2 md:gap-8">
      <div>
        <h3 class="text-sm font-semibold">Free Tools</h3>
        <div class="mt-4 flex flex-col space-y-4">
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/free-tools/table-of-contents-generator">Markdown Table Of Contents Generator</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/free-tools/markdown-live-preview-generator">Markdown Live Preview Generator</a>
          <a class="text-sm text-gray-500 hover:text-gray-900" href="/free-tools/password-generator">Password Generator</a>
        </div>
      </div>
    </div>
  </div>
</footer>
