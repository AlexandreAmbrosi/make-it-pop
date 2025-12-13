<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Textarea } from '$lib/components/ui/textarea'
  import { ArrowRight, Wrench, Sparkles, Newspaper, GraduationCap } from 'lucide-svelte'

  // Placeholder images - in real app, use asset paths
  const alexandreImg = 'https://github.com/alexandreambrosi.png' // Fallback to github user image if valid, or just a placeholder
</script>

<main>
  <!-- Hero Section -->
  <section class="bg-gray-50 px-8 py-20 text-center">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-5xl font-black tracking-tight sm:text-7xl">The Digital Design Bible</h1>
      <p class="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
        Your ultimate platform for curated tools, endless inspiration, industry news, and cutting-edge learning for digital creators.
      </p>

      <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button href="/toolz" size="lg" class="w-full bg-black font-bold text-white hover:bg-gray-800 sm:w-auto">
          <Wrench class="mr-2 h-4 w-4" /> Explore Toolz
        </Button>
        <Button href="/learn" size="lg" variant="secondary" class="w-full font-bold sm:w-auto">
          <GraduationCap class="mr-2 h-4 w-4" /> Start Learning
        </Button>
      </div>
    </div>
  </section>

  <!-- What you'll find -->
  <section class="px-8 py-20">
    <div class="mx-auto max-w-7xl">
      <h2 class="mb-16 text-center text-3xl font-bold">Everything you need to create</h2>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Toolz Card -->
        <a href="/toolz" class="group block rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-black hover:shadow-xl">
          <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
            <Wrench class="h-6 w-6 text-blue-600 group-hover:text-white" />
          </div>
          <h3 class="mb-2 text-xl font-bold">Toolz</h3>
          <p class="mb-4 text-gray-600">A curated directory of the best digital tools, power-charged by AI recommendations.</p>
          <span class="flex items-center text-sm font-semibold group-hover:underline">Explore <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a>

        <!-- Newz Card -->
        <!-- <a href="/newz" class="group block rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-green-600 hover:shadow-xl">
          <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 transition-colors group-hover:bg-green-600">
            <Newspaper class="h-6 w-6 text-green-600 group-hover:text-white" />
          </div>
          <h3 class="mb-2 text-xl font-bold">Newz</h3>
          <p class="mb-4 text-gray-600">Stay updated with the latest trends and news in the digital design world.</p>
          <span class="flex items-center text-sm font-semibold group-hover:underline">Read Newz <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a> -->

        <!-- Learn Card -->
        <a href="/learn" class="group block rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-orange-600 hover:shadow-xl">
          <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 transition-colors group-hover:bg-orange-600">
            <GraduationCap class="h-6 w-6 text-orange-600 group-hover:text-white" />
          </div>
          <h3 class="mb-2 text-xl font-bold">Learn</h3>
          <p class="mb-4 text-gray-600">Master new skills with our finest courses and quizzes.</p>
          <span class="flex items-center text-sm font-semibold group-hover:underline">Start Learning <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a>
      </div>
    </div>
  </section>

  <!-- About Creator -->
  <section class="bg-gray-50 px-8 py-20">
    <div class="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      <div class="w-full md:w-1/3">
        <img src={alexandreImg} alt="Alexandre Ambrosi" class="mx-auto w-full max-w-[300px] rotate-3 rounded-2xl shadow-lg transition-transform duration-300 hover:rotate-0" />
      </div>
      <div class="w-full text-center md:w-2/3 md:text-left">
        <h2 class="mb-6 text-3xl font-bold">Meet the Creator</h2>
        <p class="mb-6 text-lg leading-relaxed text-gray-700">
          Hi, I'm <span class="font-bold">Alexandre Ambrosi</span>. I built Make It Pop to be the resource I wish I had when starting out. It gathers everything a digital creator
          needs in one place, filtered through a lens of quality and utility.
        </p>
        <a
          href="https://www.alexandreambrosi.com/"
          target="_blank"
          class="inline-flex items-center border-b-2 border-black font-bold text-black transition-colors hover:border-gray-600 hover:text-gray-600"
        >
          Visit my portfolio <ArrowRight class="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- Contact Form -->
  <section class="px-8 py-20">
    <div class="mx-auto max-w-2xl">
      <h2 class="mb-12 text-center text-3xl font-bold">Get in touch</h2>
      <div class="rounded-2xl border bg-white p-8 shadow-sm">
        <form class="space-y-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Name</label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <div class="space-y-2">
            <label for="message" class="text-sm font-medium">Message</label>
            <Textarea id="message" placeholder="How can we help you?" class="min-h-[150px]" />
          </div>
          <Button type="submit" class="w-full font-bold">Send Message</Button>
        </form>
      </div>
    </div>
  </section>
</main>
