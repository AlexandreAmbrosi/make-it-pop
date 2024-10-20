<script lang="ts">
  import { page } from '$app/stores'
  import { signIn } from '@auth/sveltekit/client'
  import GoogleIcon from '~icons/devicon/google'
  import GitHubIcon from '~icons/devicon/github'
  import FacebookIcon from '~icons/devicon/facebook'

  const providers: { id: string; name: string }[] = $page.data.providerMap

  const signInUser = () => {
    const username = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    signIn('credentials', { username, password })
  }
</script>

<div class="w-full py-8 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Sign In</h1>
        <p class="text-balance text-muted-foreground">Enter your email below to sign in to your account.</p>
      </div>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email">Email</label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="m@example.com"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="password">Password</label>
            <a href="/forgot-password" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
          </div>
          <input
            required
            id="password"
            name="password"
            type="password"
            autocomplete="off"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button
          onclick={signInUser}
          class="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Sign In
        </button>
      </div>
      {#each providers.filter((item) => item.id !== 'credentials') as provider}
        <button
          onclick={() => signIn(provider.id)}
          class="flex h-10 w-full items-center justify-center gap-x-3 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
    <img alt="Cover" width="4000" height="6000" src="https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg" class="h-[98vh] w-full object-cover" />
  </div>
</div>
