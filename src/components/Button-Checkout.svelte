<script lang="ts">
  interface Props {
    /*
    A component that can be used anywhere in your app to open a Stripe checkout
    
    <ButtonCheckout />
  */
    minimal?: boolean
    brand_name?: string
    className?: string
  }

  let { minimal = false, brand_name = 'LaunchFast', className = 'bg-launchfast' }: Props = $props()
</script>

<form method="post" action="/api/stripe/checkout">
  <button class={['flex cursor-pointer flex-row items-center justify-center gap-x-2 rounded-full text-white', minimal ? 'py-1 pl-2 pr-4' : 'px-10 py-3', className].join(' ')}>
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
</form>
