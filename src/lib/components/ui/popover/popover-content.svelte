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
  class={cn('z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden', className)}
>
  {@render children()}
</PopoverPrimitive.Content>
