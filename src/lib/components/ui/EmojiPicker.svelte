<script lang="ts">
  import 'emoji-picker-element'
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let picker: HTMLElement

  onMount(() => {
    picker.addEventListener('emoji-click', (event: any) => {
      dispatch('emoji-click', event.detail)
    })
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
