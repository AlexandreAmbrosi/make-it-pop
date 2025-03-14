<script lang="ts">
  import { page } from '$app/stores'
  import { signIn } from '@auth/sveltekit/client'
  import GoogleIcon from '~icons/devicon/google'
  import GitHubIcon from '~icons/devicon/github'
  import FacebookIcon from '~icons/devicon/facebook'
  import Seo from '@/components/SEO.svelte'

  const providers: { id: string; name: string }[] = $page.data.providerMap

  const signInUser = () => {
    const username = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    signIn('credentials', { username, password })
  }
</script>

<Seo title={'Sign In'} />

<div class="w-full py-8 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Sign In</h1>
        <p class="text-muted-foreground text-balance">Enter your email below to sign in to your account.</p>
      </div>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email">Email</label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="m@example.com"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="password">Password</label>
            <a href="/forgot-password" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
          </div>
          <input
            required
            id="password"
            name="password"
            type="password"
            autocomplete="off"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button
          onclick={signInUser}
          class="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        >
          Sign In
        </button>
      </div>
      {#each providers.filter((item) => item.id !== 'credentials') as provider}
        <button
          onclick={() => signIn(provider.id)}
          class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-center gap-x-3 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        >
          {#if provider.id === 'google'}
            <GoogleIcon />
          {/if}
          {#if provider.id === 'github'}
            <GitHubIcon />
          {/if}
          {#if provider.id === 'facebook'}
            <FacebookIcon />
          {/if}
          <span> Continue with {provider.name}</span>
        </button>
      {/each}
      <div class="mt-4 text-center text-sm">Don't have an account? <a href="/signup" class="underline"> Sign up </a></div>
    </div>
  </div>
  <div class="hidden lg:block">
    <img
      alt="Cover"
      width="4000"
      height="6000"
      loading="lazy"
      decoding="async"
      class="h-[98vh] w-full object-cover"
      src="https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg"
    />
  </div>
</div>
