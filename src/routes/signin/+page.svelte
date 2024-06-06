<script>
  import SignInWithGoogle from '@/components/Sign-In-With-Google.svelte'
  import SignInWithTwitter from '@/components/Sign-In-With-Twitter.svelte'
</script>

<div class="w-full py-8 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Sign In</h1>
        <p class="text-muted-foreground text-balance">Enter your email below to sign in to your account.</p>
      </div>
      <form method="POST" class="grid gap-4" action="/api/sign/in">
        <div class="grid gap-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email">Email</label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="m@example.com"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          class="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Sign In
        </button>
      </form>
      <SignInWithTwitter />
      <SignInWithGoogle />
      <div class="mt-4 text-center text-sm">Don't have an account? <a href="/signup" class="underline"> Sign up </a></div>
    </div>
  </div>
  <div class="hidden lg:block">
    <img alt="Finder" width="4000" height="6000" src="https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg" class="h-[98vh] w-full object-cover" />
  </div>
</div>
