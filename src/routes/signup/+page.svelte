<script>
  import SignInWithGoogle from '@/components/Sign-In-With-Google.svelte'
  import SignInWithTwitter from '@/components/Sign-In-With-Twitter.svelte'
</script>

<div class="w-full py-8 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Sign Up</h1>
        <p class="text-balance text-muted-foreground">Enter your email below to sign up with an account.</p>
      </div>
      <form method="POST" class="grid gap-4" action="/api/sign/up">
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
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="password">Password</label>
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
          type="submit"
          class="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Sign Up
        </button>
      </form>
      <SignInWithGoogle />
      <SignInWithTwitter />
      <div class="mt-4 text-center text-sm">Already have an account? <a class="underline" href="/signin">Sign In</a></div>
    </div>
  </div>
  <div class="hidden lg:block">
    <img alt="Finder" width="4000" height="6000" src="https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg" class="h-[98vh] w-full object-cover" />
  </div>
</div>
