<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowRight, Wrench, Sparkles, Newspaper, GraduationCap } from 'lucide-svelte';
  
  // Placeholder images - in real app, use asset paths
  const alexandreImg = "https://github.com/alexandreambrosi.png"; // Fallback to github user image if valid, or just a placeholder
</script>

<main>
  <!-- Hero Section -->
  <section class="px-8 py-20 text-center bg-gray-50">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-5xl font-black tracking-tight sm:text-7xl mb-6">
        The Digital Design Bible
      </h1>
      <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Your ultimate platform for curated tools, endless inspiration, industry news, and cutting-edge learning for digital creators.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button href="/toolz" size="lg" class="w-full sm:w-auto font-bold bg-black text-white hover:bg-gray-800">
          <Wrench class="mr-2 h-4 w-4" /> Explore Toolz
        </Button>
        <Button href="/inspird" size="lg" variant="outline" class="w-full sm:w-auto font-bold">
           <Sparkles class="mr-2 h-4 w-4" /> Get Inspired
        </Button>
        <Button href="/learn" size="lg" variant="secondary" class="w-full sm:w-auto font-bold">
          <GraduationCap class="mr-2 h-4 w-4" /> Start Learning
        </Button>
      </div>
    </div>
  </section>

  <!-- What you'll find -->
  <section class="px-8 py-20">
    <div class="mx-auto max-w-7xl">
      <h2 class="text-3xl font-bold text-center mb-16">Everything you need to create</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Toolz Card -->
        <a href="/toolz" class="group block p-8 rounded-2xl border border-gray-200 hover:border-black transition-all bg-white hover:shadow-xl">
          <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Wrench class="h-6 w-6 text-blue-600 group-hover:text-white" />
          </div>
          <h3 class="text-xl font-bold mb-2">Toolz</h3>
          <p class="text-gray-600 mb-4">A curated directory of the best digital tools, power-charged by AI recommendations.</p>
          <span class="text-sm font-semibold flex items-center group-hover:underline">Explore <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a>

        <!-- Inspird Card -->
        <a href="/inspird" class="group block p-8 rounded-2xl border border-gray-200 hover:border-purple-600 transition-all bg-white hover:shadow-xl">
          <div class="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
            <Sparkles class="h-6 w-6 text-purple-600 group-hover:text-white" />
          </div>
          <h3 class="text-xl font-bold mb-2">Inspird</h3>
          <p class="text-gray-600 mb-4">Hand-picked design inspiration from the best creators across the web.</p>
          <span class="text-sm font-semibold flex items-center group-hover:underline">Get Inspired <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a>

        <!-- Newz Card -->
        <a href="/newz" class="group block p-8 rounded-2xl border border-gray-200 hover:border-green-600 transition-all bg-white hover:shadow-xl">
          <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
            <Newspaper class="h-6 w-6 text-green-600 group-hover:text-white" />
          </div>
          <h3 class="text-xl font-bold mb-2">Newz</h3>
          <p class="text-gray-600 mb-4">Stay updated with the latest trends and news in the digital design world.</p>
          <span class="text-sm font-semibold flex items-center group-hover:underline">Read Newz <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a>

        <!-- Learn Card -->
        <a href="/learn" class="group block p-8 rounded-2xl border border-gray-200 hover:border-orange-600 transition-all bg-white hover:shadow-xl">
          <div class="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
            <GraduationCap class="h-6 w-6 text-orange-600 group-hover:text-white" />
          </div>
          <h3 class="text-xl font-bold mb-2">Learn</h3>
          <p class="text-gray-600 mb-4">Master new skills with our finest courses and quizzes.</p>
          <span class="text-sm font-semibold flex items-center group-hover:underline">Start Learning <ArrowRight class="ml-1 h-3 w-3" /></span>
        </a>
      </div>
    </div>
  </section>

  <!-- About Creator -->
  <section class="px-8 py-20 bg-gray-50">
    <div class="mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
      <div class="w-full md:w-1/3">
        <img src={alexandreImg} alt="Alexandre Ambrosi" class="w-full max-w-[300px] mx-auto rounded-2xl shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300" />
      </div>
      <div class="w-full md:w-2/3 text-center md:text-left">
        <h2 class="text-3xl font-bold mb-6">Meet the Creator</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">
          Hi, I'm <span class="font-bold">Alexandre Ambrosi</span>. I built Make It Pop to be the resource I wish I had when starting out. 
          It gathers everything a digital creator needs in one place, filtered through a lens of quality and utility.
        </p>
        <a href="https://www.alexandreambrosi.com/" target="_blank" class="inline-flex items-center font-bold text-black border-b-2 border-black hover:text-gray-600 hover:border-gray-600 transition-colors">
          Visit my portfolio <ArrowRight class="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- Contact Form -->
  <section class="px-8 py-20">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-3xl font-bold text-center mb-12">Get in touch</h2>
      <div class="bg-white p-8 rounded-2xl border shadow-sm">
        <form class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
