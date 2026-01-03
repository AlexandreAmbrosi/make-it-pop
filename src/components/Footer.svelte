<script lang="ts">
  const footerText = '/assets/footer-text.svg'

  interface Props {
    brand_name?: string
    twitter?: string
  }

  let { brand_name = 'Make It Pop', twitter = 'alexandreambrosi' }: Props = $props()
</script>

<footer class="relative flex min-h-[500px] w-full flex-col justify-between overflow-hidden bg-[#f2f4f6] p-8">
  <!-- Content Grid -->
  <div class="z-10 flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
    <!-- Left: Description -->
    <div class="max-w-[350px]">
      <p class="text-base leading-relaxed text-[#14171C]" style="font-family: 'Celex Grotesk', sans-serif;">
        Your ultimate platform for curated tools, endless inspiration, industry news, and cutting-edge learning for digital creators.
      </p>
    </div>

    <!-- Right: Links -->
    <div class="flex flex-wrap gap-12 md:gap-24">
      <!-- Socials -->
      <div class="flex flex-col gap-4">
        <h4 class="text-base font-bold text-[#14171C] opacity-70" style="font-family: 'Celex Grotesk', sans-serif;">Socials</h4>
        <div class="flex flex-col gap-2 text-base text-[#14171C] opacity-40">
          <a href="https://twitter.com/{twitter}" target="_blank" class="transition-opacity hover:opacity-100">X</a>
          <a href="#" class="transition-opacity hover:opacity-100">Discord</a>
          <a href="#" class="transition-opacity hover:opacity-100">Instagram</a>
          <a href="#" class="transition-opacity hover:opacity-100">LinkedIn</a>
        </div>
      </div>

      <!-- Find your way -->
      <div class="flex flex-col gap-4">
        <h4 class="text-base font-bold text-[#14171C] opacity-70" style="font-family: 'Celex Grotesk', sans-serif;">Find your way</h4>
        <div class="flex flex-col gap-2 text-base text-[#14171C] opacity-40">
          <a href="/inspirations" class="transition-opacity hover:opacity-100">Inspir'd</a>
          <a href="/toolz" class="transition-opacity hover:opacity-100">Toolz</a>
          <a href="/learn" class="transition-opacity hover:opacity-100">Coursez</a>
          <a href="/login" class="transition-opacity hover:opacity-100">Sign In</a>
          <a href="/register" class="transition-opacity hover:opacity-100">Sign Up</a>
        </div>
      </div>

      <!-- Boring Things -->
      <div class="flex flex-col gap-4">
        <h4 class="text-base font-bold text-[#14171C] opacity-70" style="font-family: 'Celex Grotesk', sans-serif;">Boring Things</h4>
        <div class="flex flex-col gap-2 text-base text-[#14171C] opacity-40">
          <a href="/legal" class="transition-opacity hover:opacity-100">Legal Mentions</a>
          <a href="/privacy" class="transition-opacity hover:opacity-100">Confidentiality Policy</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Big Text Image at Bottom -->
  <div class="pointer-events-none absolute right-0 bottom-[-10px] left-0 w-full overflow-hidden leading-none">
    <img src={footerText} alt="MAKE IT POP" class="w-full object-cover opacity-90" />
  </div>
</footer>
