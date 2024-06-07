<script lang="ts">
  export let title: string
  export let url: string

  import TwitterIcon from '~icons/devicon/twitter'
  import LinkedInIcon from '~icons/mdi/linkedin'
  import ClipboardIcon from '~icons/mdi/clipboard-outline'
</script>

<div class="flex flex-row items-center space-x-3">
  <a target="_blank" rel="noopener noreferrer" {title} aria-label={title} href={`https://twitter.com/intent/tweet?text=${url}`}>
    <TwitterIcon />
  </a>
  <a target="_blank" rel="noopener noreferrer" {title} aria-label={title} href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}>
    <LinkedInIcon color="#0a66c2" width="24" height="24" />
  </a>
  <button
    on:click={() => {
      // @ts-ignore
      window.copyTextToClipboard(url)
    }}
    id="share-link"
  >
    <ClipboardIcon width="24" height="24" />
  </button>
</div>
