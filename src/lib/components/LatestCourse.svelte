<script lang="ts">
  import { Check, Clock, User, Briefcase, GraduationCap } from 'lucide-svelte'

  const bg = '/assets/latest-course/bg.png'
  const separator = '/assets/latest-course/separator.svg'
  // Use placeholder for avatar if not available
  const avatar = 'https://github.com/shadcn.png'

  const features = ['Color Theory', 'Accessibility', 'Branding', 'Wireframing', 'Typography', 'User Experience']
</script>

<div class="velocity-skew bento-card relative col-span-12 min-h-[700px] overflow-hidden rounded-lg p-4 md:col-span-12 lg:h-[800px] lg:p-4">
  <!-- Background Video -->
  <div class="absolute inset-0 z-0">
    <video src="/Designer_s_Online_Course_Video_Generated.mp4" poster={bg} autoplay muted loop playsinline class="h-full w-full scale-x-[-1] object-cover opacity-90"></video>
  </div>

  <!-- Content Card -->
  <div class="relative z-10 flex h-full items-center justify-center lg:justify-end lg:pr-12">
    <div class="flex h-full w-full max-w-[450px] flex-col overflow-hidden rounded bg-white shadow-xl">
      <div class="flex h-full flex-col justify-between px-8 py-10">
        <!-- Top Section -->
        <div class="flex flex-col gap-6">
          <!-- Header -->
          <div class="reveal flex flex-col gap-3">
            <p class="text-xs font-bold tracking-[0.16em] text-[#14171C] opacity-80" style="font-family: 'Celex Grotesk', sans-serif;">LATEST COURSE</p>
            <div class="relative h-px w-full overflow-hidden">
              <img src={separator} alt="" class="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>

          <!-- Author -->
          <div class="reveal flex items-center gap-3">
            <img src={avatar} alt="Alexandre Ambrosi" class="h-8 w-8 rounded-full object-cover" />
            <span class="text-sm font-medium text-[#14171C]">Alexandre Ambrosi</span>
          </div>

          <!-- Tags -->
          <div class="reveal flex flex-wrap gap-2 text-xs font-medium text-[#14171C]">
            <div class="flex items-center gap-1.5 rounded-md bg-[#F1EFFE] px-3 py-1.5">
              <Briefcase size={12} /> UX Design
            </div>
            <div class="flex items-center gap-1.5 rounded-md bg-[#F1EFFE] px-3 py-1.5">
              <GraduationCap size={12} /> Beginner
            </div>
            <div class="flex items-center gap-1.5 rounded-md bg-[#F1EFFE] px-3 py-1.5">
              <Clock size={12} /> 3h
            </div>
          </div>

          <!-- Title -->
          <h3 class="reveal text-4xl leading-[1.1] font-medium text-[#14171C]" style="font-family: 'WS Paradose', sans-serif;">
            Design Fundamentals — <br /> A Complete, Systemic Foundation
          </h3>

          <!-- Description -->
          <p class="reveal text-sm leading-relaxed text-[#14171C]/80">
            Your ultimate platform for curated tools, endless inspiration, industry news, and cutting-edge learning for digital creators.
          </p>

          <!-- Checkmark List -->
          <div class="reveal mt-2 grid grid-cols-1 gap-y-3">
            {#each features as feature}
              <div class="flex items-center gap-3">
                <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] text-white">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span class="text-sm font-medium text-[#14171C]">{feature}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Bottom Button -->
        <div class="pt-8">
          <button class="reveal w-full rounded bg-[#745ff4] py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-[#5f4de0]">
            Start the course for free
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
