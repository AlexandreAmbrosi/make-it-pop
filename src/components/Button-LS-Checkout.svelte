<script lang="ts">
  /*
    A component that can be used anywhere in your app to open a Lemon Squeezy checkout
  
    <ButtonLSCheckout
      product_url="https://launchfast.lemonsqueezy.com/checkout/buy/30dd570f-3598-440d-a29a-1e002bda0eb6?checkout[discount_code]=M0OTIWMA"
    />
  */

  import { onMount } from 'svelte'
  import { slug } from 'github-slugger'

  interface Props {
    minimal?: boolean
    brand_name?: string
    className?: string
    product_url?: string
  }

  let {
    minimal = false,
    brand_name = 'LaunchFast',
    className = 'bg-launchfast',
    product_url = 'https://launchfast.lemonsqueezy.com/checkout/buy/30dd570f-3598-440d-a29a-1e002bda0eb6?checkout[discount_code]=M0OTIWMA',
  }: Props = $props()

  let BUTTON_ID = $derived(slug(product_url))

  onMount(() => {
    const buttonElement = document.querySelectorAll('#' + BUTTON_ID)
    const setupLS = () => {
      window.createLemonSqueezy()
      if (buttonElement) {
        buttonElement.forEach((i) => i.classList.remove('pointer-events-none'))
        buttonElement.forEach((i) => {
          i.addEventListener('click', () => {
            window.LemonSqueezy.Url.Open(i.getAttribute('id'))
          })
        })
      }
      window['hasLemonSqueezy'] = true
      window.LemonSqueezy.Setup({
        eventHandler: (event: any) => {
          console.log(event)
        },
      })
    }
    if (buttonElement) buttonElement.forEach((i) => i.classList.add('pointer-events-none'))
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

<button id={BUTTON_ID} class={['flex flex-row items-center justify-center gap-x-2 rounded-full text-white', minimal ? 'py-1 pl-2 pr-4' : 'px-10 py-3', className].join(' ')}>
  <img
    loading="lazy"
    decoding="async"
    alt="LaunchFast Logo"
    width={minimal ? '24' : '30'}
    height={minimal ? '24' : '30'}
    class={minimal ? 'h-[24px] w-[24px]' : 'h-[30px] w-[30px]'}
    src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/purple-icon.png"
  />
  <span> Get {brand_name}</span>
</button>
