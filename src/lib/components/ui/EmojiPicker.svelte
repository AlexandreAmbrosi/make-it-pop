<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let picker: HTMLElement

  onMount(async () => {
    // Dynamically import to avoid SSR errors (requestAnimationFrame not defined)
    await import('emoji-picker-element')

    if (picker) {
      picker.addEventListener('emoji-click', (event: any) => {
        dispatch('emoji-click', event.detail)
      })
    }
  })
</script>

<emoji-picker bind:this={picker}></emoji-picker>

<style>
  emoji-picker {
    width: 100%;
    height: 320px;
    --num-columns: 6;
  }
</style>
