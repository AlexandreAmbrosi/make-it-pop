<script lang="ts">
  /*
    A component that can be used anywhere in your app

    <Testimonials />
  */

  import testimonialData from '@/lib/data/testimonials'
  import Testimonial from '@/components/Testimonial.svelte'
</script>

<section id="testimonials">
  <div class="mx-auto mt-12 flex max-w-7xl flex-col gap-12 px-8">
    <div class="flex flex-col text-left">
      <a href="/#testimonials" class="block max-w-max -rotate-1 scale-[102.5%] rounded bg-astro px-4 py-1 text-2xl font-medium text-white shadow-sm">Our growing wall of love 🤍</a>
      <span class="mt-4 text-xl text-gray-600">
        Join
        <b>30+ builders</b>
        who launch fast using LaunchFa.st Boilerplates ✨
      </span>
      <div class="relative mt-8 columns-1 gap-4 sm:columns-2 md:columns-3">
        {#each testimonialData as i}
          <Testimonial {...i} />
        {/each}
      </div>
    </div>
  </div>
</section>
