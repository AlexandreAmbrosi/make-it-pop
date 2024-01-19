<script lang="ts">
  /*
      A component that can be used anywhere in your app
      Add this to the bottom of the page if you want to use it globally
  
      <AnalyticsWa
        ID="GA-ID-12345678"
      />
    */

  import { onMount } from 'svelte'

  export let ID: string

  onMount(() => {
    if (ID && ID.length > 1) {
      const waScript = document.createElement('script')
      waScript.id = 'waa'
      waScript.defer = true
      waScript.src = `https://stats.wideangle.co/script/${ID}.js`
      document.head.appendChild(waScript)
    }
  })
</script>
