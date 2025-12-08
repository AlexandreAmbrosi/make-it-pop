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
    <a href="/" class="z-10 flex flex-row items-center gap-x-2">
      <Logo />
      <span class="font-semibold text-[#9810fa]">{brand_name}</span>
    </a>
    <p class="max-w-xs text-sm text-gray-500">The Digital Design Bible. Curated tools, inspiration, news and learning for digital creators.</p>
    <div class="flex items-center space-x-2">
      <a target="_blank" href={`https://twitter.com/${twitter}`} class="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200">
        <span class="sr-only">Twitter</span>
        <TwitterIcon width="22" height="22" />
      </a>
    </div>
  </div>
  <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
     <div class="md:grid md:grid-cols-2 md:gap-8">
       <div>
         <h3 class="text-sm font-semibold">Explore</h3>
         <div class="mt-4 flex flex-col space-y-4">
           <a class="text-sm text-gray-500 hover:text-gray-900" href="/toolz">Toolz</a>
           <a class="text-sm text-gray-500 hover:text-gray-900" href="/inspird">Inspird</a>
           <a class="text-sm text-gray-500 hover:text-gray-900" href="/newz">Newz</a>
           <a class="text-sm text-gray-500 hover:text-gray-900" href="/learn">Learn</a>
         </div>
       </div>
     </div>
  </div>
</footer>
