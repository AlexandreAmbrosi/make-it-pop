<script lang="ts">
  interface Props {
    /*
    A component that can be used anywhere in your app

    <Divider />
  */
    className: string
  }

  let { className }: Props = $props()
</script>

<div class={['h-[1px] w-full border', className].join(' ')}></div>
