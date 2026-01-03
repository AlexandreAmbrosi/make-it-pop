<script lang="ts">
  import { page } from '$app/stores'
  import { signIn } from '@auth/sveltekit/client'
  import { toast } from 'svelte-sonner'
  import { fly, scale } from 'svelte/transition'
  import { Loader2, Eye, EyeOff, Check, X, CheckCircle2 } from 'lucide-svelte'
  import GoogleIcon from '~icons/devicon/google'
  import GitHubIcon from '~icons/devicon/github'
  import Seo from '@/components/SEO.svelte'

  const providers: { id: string; name: string }[] = $page.data.providerMap

  let name = ''
  let email = ''
  let password = ''
  let confirmPassword = ''
  let loading = false
  let success = false
  let showPassword = false
  let showConfirmPassword = false
  let nameTouched = false
  let emailTouched = false
  let passwordTouched = false
  let confirmPasswordTouched = false

  // Validation
  $: nameValid = name.trim().length > 0
  $: emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  $: passwordValid = password.length >= 6
  $: confirmPasswordValid = confirmPassword === password && confirmPassword.length >= 6

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (!nameValid) {
      toast.error('Name required', { description: 'Please enter your name', duration: 5000 })
      return
    }
    if (!emailValid) {
      toast.error('Invalid email', { description: 'Please enter a valid email address', duration: 5000 })
      return
    }
    if (!passwordValid) {
      toast.error('Invalid password', { description: 'Password must be at least 6 characters long', duration: 5000 })
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { description: 'Please make sure both passwords are identical', duration: 5000 })
      return
    }

    loading = true

    try {
      // Pass 'name' in case the backend provider supports it
      const result = await signIn('credentials', {
        username: email,
        password,
        name,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Signup failed', {
          description: result.error || 'An error occurred while creating your account',
          duration: 5000,
        })
        loading = false
        return
      }

      success = true
      toast.success('Account created!', {
        description: `Welcome ${name || 'to Make It Pop'}! Redirecting to your dashboard...`,
        duration: 3000,
      })

      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    } catch (err: any) {
      toast.error('Signup failed', {
        description: err.message || 'An error occurred while creating your account',
        duration: 5000,
      })
      loading = false
    }
  }
</script>

<Seo title={'Sign Up'} />

<div class="font-display relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-8 text-[#14171C]">
  <!-- Gradient Background -->
  <div
    class="rotating-gradient absolute"
    style="width: 200vmax; height: 200vmax; top: 50%; left: 50%; transform: translate(-50%, -50%); transform-origin: center center; background-image: conic-gradient(from 90deg, rgba(116, 95, 244, 1) -5.2885%, rgba(116, 95, 244, 1) 5.2885%, rgba(89, 149, 246, 1) 16.827%, rgba(92, 222, 235, 1) 27.885%, rgba(113, 231, 173, 1) 33.413%, rgba(133, 239, 111, 1) 38.942%, rgba(189, 244, 113, 1) 44.471%, rgba(244, 248, 114, 1) 50%, rgba(241, 207, 97, 1) 55.769%, rgba(238, 165, 79, 1) 61.538%, rgba(238, 127, 84, 1) 67.067%, rgba(238, 89, 89, 1) 72.596%, rgba(238, 94, 126, 1) 75.361%, rgba(238, 99, 163, 1) 78.125%, rgba(237, 108, 237, 1) 83.654%, rgba(177, 102, 241, 1) 89.183%, rgba(116, 95, 244, 1) 94.712%, rgba(116, 95, 244, 1) 105.29%);"
  ></div>

  <!-- Card -->
  <div class="absolute inset-[6px]">
    <div class="flex h-full items-center justify-center rounded-[8px] bg-white p-6 shadow-xl">
      <form on:submit={handleSubmit} class="flex w-full max-w-[446px] flex-col gap-6">
        <!-- Header -->
        <div in:fly={{ y: 20, duration: 400, delay: 100 }} class="flex flex-col items-center gap-6 pb-0">
          <div class="flex h-[68px] justify-center">
            {#if success}
              <div class="flex h-[68px] w-[68px] items-center justify-center rounded-[8px] bg-green-500" in:scale={{ duration: 600, start: 0.8 }}>
                <CheckCircle2 class="h-10 w-10 text-white" />
              </div>
            {:else}
              <img src="/figma_by_alex/assets/8d97b428e5970dea61a2c0f5fac7bdc8f578db5f.png" alt="Make It Pop" class="h-[68px] w-auto" />
            {/if}
          </div>
          <div class="space-y-2 text-center">
            <h1 class="text-[18px] leading-[16px] font-medium text-neutral-950">
              {success ? 'Welcome aboard!' : 'Join the community'}
            </h1>
            <p class="text-[16px] leading-[24px] text-[#717182]">
              {success ? 'Your account has been created successfully' : 'Start your design learning journey today'}
            </p>
          </div>
        </div>

        <!-- Form Content -->
        <div in:fly={{ y: 20, duration: 400, delay: 200 }} class="flex flex-col gap-3 px-4">
          <!-- Name Field -->
          <div class="flex flex-col gap-2.5">
            <label for="name" class="text-[14px] leading-[14px] font-medium text-neutral-950"> Name </label>
            <div class="relative">
              <input
                id="name"
                type="text"
                placeholder="Your name"
                bind:value={name}
                on:blur={() => (nameTouched = true)}
                disabled={loading || success}
                class="h-[36px] w-full rounded-[8px] border-0 bg-[#f3f3f5] px-3 py-1 pr-10 text-[14px] text-neutral-950 transition-all placeholder:text-[#717182] placeholder:opacity-40 focus:ring-2 focus:ring-neutral-950/10 focus:outline-none"
              />
              {#if nameTouched && name}
                <div class="absolute top-1/2 right-3 -translate-y-1/2">
                  {#if nameValid}
                    <Check class="h-4 w-4 text-green-600" />
                  {:else}
                    <X class="h-4 w-4 text-red-600" />
                  {/if}
                </div>
              {/if}
            </div>
          </div>

          <!-- Email Field -->
          <div class="flex flex-col gap-2.5">
            <label for="email" class="text-[14px] leading-[14px] font-medium text-neutral-950"> Email </label>
            <div class="relative">
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                bind:value={email}
                on:blur={() => (emailTouched = true)}
                required
                disabled={loading || success}
                class="h-[36px] w-full rounded-[8px] border-0 bg-[#f3f3f5] px-3 py-1 pr-10 text-[14px] text-neutral-950 transition-all placeholder:text-[#717182] placeholder:opacity-40 focus:ring-2 focus:ring-neutral-950/10 focus:outline-none"
              />
              {#if emailTouched && email}
                <div class="absolute top-1/2 right-3 -translate-y-1/2">
                  {#if emailValid}
                    <Check class="h-4 w-4 text-green-600" />
                  {:else}
                    <X class="h-4 w-4 text-red-600" />
                  {/if}
                </div>
              {/if}
            </div>
          </div>

          <!-- Password Field -->
          <div class="flex flex-col gap-2.5">
            <label for="password" class="text-[14px] leading-[14px] font-medium text-neutral-950"> Password </label>
            <div class="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                bind:value={password}
                on:blur={() => (passwordTouched = true)}
                required
                disabled={loading || success}
                class="h-[36px] w-full rounded-[8px] border-0 bg-[#f3f3f5] px-3 py-1 pr-20 text-[14px] text-neutral-950 transition-all placeholder:text-[#717182] placeholder:opacity-40 focus:ring-2 focus:ring-neutral-950/10 focus:outline-none"
              />
              <div class="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                {#if passwordTouched && password}
                  {#if passwordValid}
                    <Check class="h-4 w-4 text-green-600" />
                  {:else}
                    <X class="h-4 w-4 text-red-600" />
                  {/if}
                {/if}
                <button
                  type="button"
                  on:click={() => (showPassword = !showPassword)}
                  class="cursor-pointer text-[#717182] transition-colors hover:text-neutral-950"
                  disabled={loading || success}
                >
                  {#if showPassword}
                    <EyeOff class="h-4 w-4" />
                  {:else}
                    <Eye class="h-4 w-4" />
                  {/if}
                </button>
              </div>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="flex flex-col gap-2.5">
            <label for="confirmPassword" class="text-[14px] leading-[14px] font-medium text-neutral-950"> Confirm Password </label>
            <div class="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                bind:value={confirmPassword}
                on:blur={() => (confirmPasswordTouched = true)}
                required
                disabled={loading || success}
                class="h-[36px] w-full rounded-[8px] border-0 bg-[#f3f3f5] px-3 py-1 pr-20 text-[14px] text-neutral-950 transition-all placeholder:text-[#717182] placeholder:opacity-40 focus:ring-2 focus:ring-neutral-950/10 focus:outline-none"
              />
              <div class="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                {#if confirmPasswordTouched && confirmPassword}
                  {#if confirmPasswordValid}
                    <Check class="h-4 w-4 text-green-600" />
                  {:else}
                    <X class="h-4 w-4 text-red-600" />
                  {/if}
                {/if}
                <button
                  type="button"
                  on:click={() => (showConfirmPassword = !showConfirmPassword)}
                  class="cursor-pointer text-[#717182] transition-colors hover:text-neutral-950"
                  disabled={loading || success}
                >
                  {#if showConfirmPassword}
                    <EyeOff class="h-4 w-4" />
                  {:else}
                    <Eye class="h-4 w-4" />
                  {/if}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div in:fly={{ y: 20, duration: 400, delay: 300 }} class="flex flex-col items-center gap-6 px-4">
          <!-- Submit Button -->
          <button
            type="submit"
            disabled={loading || success}
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#030213] px-4 py-2 text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#030213]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#if loading}
              <Loader2 class="h-4 w-4 animate-spin" />
              <span class="text-[14px] leading-[20px] font-medium">Creating account...</span>
            {:else if success}
              <CheckCircle2 class="h-4 w-4" />
              <span class="text-[14px] leading-[20px] font-medium">Account created!</span>
            {:else}
              <span class="text-[14px] leading-[20px] font-medium">Sign up for free</span>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 16 16">
                <path d="M3.33333 8H12.6667" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33333" />
                <path d="M8 3.33333L12.6667 8L8 12.6667" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33333" />
              </svg>
            {/if}
          </button>

          {#if !success}
            <!-- OAuth Buttons -->
            {#each providers.filter((item) => item.id !== 'credentials') as provider}
              <button
                type="button"
                on:click={() => signIn(provider.id)}
                class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[8px] border border-[#e9ebef] bg-white px-4 py-2 text-neutral-950 transition-all duration-200 hover:bg-[#f3f3f5]"
              >
                {#if provider.id === 'google'}
                  <GoogleIcon />
                {/if}
                {#if provider.id === 'github'}
                  <GitHubIcon />
                {/if}
                <span class="text-[14px] leading-[20px] font-medium">Continue with {provider.name}</span>
              </button>
            {/each}

            <!-- Signin Link -->
            <div class="flex items-center gap-1.5">
              <span class="text-[14px] leading-[20px] text-[#717182]">Already have an account ?</span>
              <a href="/signin" class="cursor-pointer text-[14px] leading-[24px] font-medium text-neutral-950 transition-all hover:underline disabled:opacity-50"> Sign in </a>
            </div>
          {/if}
        </div>
      </form>
    </div>
  </div>

  <!-- Back Button -->
  <a href="/" class="fixed top-6 left-6 z-10 flex cursor-pointer items-center gap-2 no-underline opacity-50 transition-opacity duration-200 hover:opacity-100">
    <svg class="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M12.6667 8H3.33333" stroke="#717182" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33333" />
      <path d="M8 12.6667L3.33333 8L8 3.33333" stroke="#717182" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33333" />
    </svg>
    <span class="text-sm text-[#717182]">Retour</span>
  </a>
</div>
