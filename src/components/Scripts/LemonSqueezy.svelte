<script lang="ts">
  import { onMount } from 'svelte'

  onMount(() => {
    const buttonElements = document.querySelectorAll('.ls-button')
    const setupLS = () => {
      window.createLemonSqueezy()
      if (buttonElements) {
        buttonElements.forEach((i) => i.classList.remove('pointer-events-none'))
        buttonElements.forEach((i) => {
          i.addEventListener('click', (e) => {
            e.preventDefault()
            window.LemonSqueezy.Url.Open(i.getAttribute('href'))
          })
        })
      }
      window['hasLemonSqueezy'] = true
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          console.log(event)
        },
      })
    }
    if (buttonElements) {
      buttonElements.forEach((i) => i.classList.add('pointer-events-none'))
    }
    if (window['hasLemonSqueezy']) {
      setupLS()
    } else {
      var script = document.createElement('script')
      script.onload = () => {
        setTimeout(() => {
          setupLS()
        }, 100)
      }
      script.src = 'https://assets.lemonsqueezy.com/lemon.js'
      document.head.appendChild(script)
    }
  })
</script>
