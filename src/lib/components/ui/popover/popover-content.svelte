<script lang="ts">
  import { Popover as PopoverPrimitive } from 'bits-ui'
  import { cn, flyAndScale } from '@/lib/utils.js'

  type $$Props = PopoverPrimitive.ContentProps
  interface Props {
    [key: string]: any
    class?: $$Props['class']
    transition?: $$Props['transition']
    children?: import('svelte').Snippet
    transitionConfig?: $$Props['transitionConfig']
  }

  let { class: className = undefined, transition = flyAndScale, transitionConfig = undefined, children, ...rest }: Props = $props()
</script>

<PopoverPrimitive.Content
  {...rest}
  {transition}
  {transitionConfig}
  class={cn('bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden', className)}
>
  {@render children()}
</PopoverPrimitive.Content>
