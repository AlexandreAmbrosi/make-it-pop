<script lang="ts">
  interface Props {
    name: string
    image: string
  }

  let { name, image }: Props = $props()
</script>

<div class="mt-4 flex flex-row items-center gap-x-2">
  <img alt={name} class="rounded-full" height="20" width="20" decoding="async" src={image} />
  <span class="text-md">{name}</span>
</div>
