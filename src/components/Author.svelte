<script lang="ts">
  export let name: string
  export let image: string
</script>

<div class="mt-4 flex flex-row items-center gap-x-2">
  <img alt={name} class="rounded-full" height="20" width="20" loading="lazy" decoding="async" src={image} />
  <span class="text-md">{name}</span>
</div>
