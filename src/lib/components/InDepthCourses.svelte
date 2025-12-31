<script lang="ts">
  import { Check } from 'lucide-svelte'

  const courses = [
    {
      title: 'Design fundamentals for everyone.',
      description: 'Everything you need to start designing.',
      image: '/assets/courses/card-1.png',
      tags: [
        { label: 'UX Design', icon: 'briefcase' },
        { label: 'Beginner', icon: 'graduation-cap' },
        { label: '3h', icon: 'clock' },
      ],
      features: ['Color Theory', 'Branding', 'Typography', 'Accessibility', 'Wireframing', 'User Experience'],
    },
    {
      title: 'Learn the basics of product design.',
      description: 'Everything you need to improve your designs.',
      image: '/assets/courses/card-2.png',
      tags: [
        { label: 'Product Strategy', icon: 'briefcase' },
        { label: 'Intermediate', icon: 'graduation-cap' },
        { label: '4h', icon: 'clock' },
      ],
      features: ['UI Design', 'Design Systems', 'Visual Design', 'User Research', 'Prototyping', 'Interaction Design'],
    },
    {
      title: 'The basics of web design and more.',
      description: 'Everything to improve your designs.',
      image: '/assets/courses/card-3.png',
      tags: [
        { label: 'Web Design', icon: 'briefcase' },
        { label: 'Advanced', icon: 'graduation-cap' },
        { label: '5h', icon: 'clock' },
      ],
      features: ['Layout Design', 'Design Thinking', 'Visual Hierarchy', 'User Research', 'User Interface', 'Motion Design'],
    },
  ]
</script>

<section class="velocity-skew relative w-full py-20">
  <!-- Halfway Purple Background -->
  <div class="absolute inset-x-0 top-0 h-[65%] w-full overflow-hidden rounded-[8px] bg-purple-500">
    <!-- Background Vector -->
    <div class="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
      <img src="/assets/courses/bg-pattern.svg" alt="" class="h-full w-full object-cover" />
    </div>
  </div>

  <div class="relative z-10 mx-auto w-full max-w-[1400px] px-4">
    <!-- Header -->
    <div class="mb-16 flex flex-col items-center text-center text-white">
      <h2 class="text-display-1 mb-4">In-depth courses</h2>
      <p class="text-body-large max-w-2xl opacity-90">
        Your ultimate platform for curated tools, endless inspiration, industry news, and cutting-edge learning for digital creators.
      </p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each courses as course}
        <div class="group relative flex min-h-[500px] flex-col overflow-hidden rounded-2xl bg-[#14171C] shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl">
          <!-- Image & Gradient -->
          <div class="absolute inset-0 z-0">
            <img src={course.image} alt={course.title} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#14171C] via-[#14171C]/80 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 flex h-full flex-col p-8">
            <!-- Tags -->
            <div class="mb-auto flex flex-wrap gap-2">
              {#each course.tags as tag}
                <div class="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-[#14171C]">
                  <!-- Simple Icon Placeholder logic or use Lucide if mapped properly. For now text-only or generic icon -->
                  {#if tag.icon === 'briefcase'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                      ><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg
                    >
                  {:else if tag.icon === 'graduation-cap'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                      ><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg
                    >
                  {:else if tag.icon === 'clock'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                      ><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
                    >
                  {/if}
                  {tag.label}
                </div>
              {/each}
            </div>

            <!-- Text Content -->
            <div class="mt-8">
              <h3 class="font-display mb-2 text-2xl leading-tight font-bold text-white">{course.title}</h3>
              <p class="mb-6 text-sm text-gray-300">{course.description}</p>

              <div class="mb-6 h-px w-full bg-white/10"></div>

              <!-- Features Grid -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                {#each course.features as feature}
                  <div class="flex items-center gap-2 text-xs font-medium text-gray-200">
                    <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#4ADE80] text-[#14171C]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
                        ><path d="M20 6 9 17l-5-5" /></svg
                      >
                    </div>
                    {feature}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
