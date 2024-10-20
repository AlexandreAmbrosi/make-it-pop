<script lang="ts">
  interface Props {
    display?: string
    name?: string
    weights?: any
  }

  let { display = 'swap', name = 'Archivo', weights = [100, 200, 300, 400, 500, 600, 700, 800] }: Props = $props()

  const fontURL = new URL('/css2', 'https://fonts.googleapis.com')
  fontURL.searchParams.set('display', display)
  fontURL.searchParams.set('family', `${name}:wght@${weights.join(';')}`)
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link href={fontURL.toString()} rel="stylesheet" />
