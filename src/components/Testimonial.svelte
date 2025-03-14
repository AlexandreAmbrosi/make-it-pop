<script lang="ts">
  /*
    A component that can be used anywhere in your app

    <Testimonial
      platform="twitter"
      photo="https://..."
      verified_type={false}
      name="Rishi Raj Jain"
      handle="@rishi_raj_jain_"
      message_url="https://twitter.com/rishi/1233..."
      message="Hey, @rishi_raj_jain_ wow this is great."
    />
  */

  import VerifiedIcon from '~icons/ic/sharp-verified'
  import GmailIcon from '~icons/logos/google-gmail'
  import GitHubIcon from '~icons/mdi/github'
  import RedditIcon from '~icons/mdi/reddit'
  import TwitterIcon from '~icons/mdi/twitter'
  import ProductHuntIcon from '~icons/logos/producthunt'
  import PeerlistIcon from '~icons/simple-icons/peerlist'

  interface Props {
    name: string
    photo: string
    handle: string
    message: string
    message_url: string
    platform?: string
    verified_type?: boolean
  }

  let { name, photo, handle, message, message_url, platform = 'twitter', verified_type = false }: Props = $props()

  let formattedText = $state(message.replace(/&amp;/g, '&'))
  let tempText = '' + formattedText

  try {
    tempText = tempText
      // format all # hashtags
      .replace(/(#+[a-zA-Z0-9(_)]{1,})/g, (match) => {
        return `<a class="text-[#1da0f2] font-normal" href="https://twitter.com/hashtag/${match.replace('#', '')}" target="_blank">${match}</a>`
      })
      // format all @ mentions
      .replace(/\B\@([\w\-]+)/gim, (match) => {
        return `<a class="text-[#1da0f2] font-normal" href="https://twitter.com/${match.replace('@', '')}" target="_blank">${match}</a>`
      })
    const shortLinks = formattedText.match(/https:\/\/t\.co\/[a-zA-Z0-9]{0,10}/g)
    shortLinks?.forEach((i, _) => {
      if (_ !== shortLinks.length - 1) tempText = tempText.replace(i, `<a href="${i}" class="text-[#1d9bf0]">${i}</a>`)
      else tempText = tempText.replace(i, ``)
    })
    formattedText = '' + tempText
  } catch (e) {
    console.log(e.message || e.toString())
  }
</script>

<div class="relative mt-4 flex break-inside-avoid flex-col rounded border border-white/25 p-[0.1rem] shadow-sm">
  <div class="flex w-full flex-col px-6 py-4">
    <div class="flex flex-row items-center">
      <img loading="lazy" decoding="async" width="48" height="48" alt={name} class="h-[48px] w-[48px] rounded-full" src={photo} />
      <div class="author ml-4 flex flex-col no-underline!">
        <span class="text-launchfast flex items-center leading-5 font-bold" title={name}>
          {name}
          {#if verified_type}
            <div class="ml-1">
              <VerifiedIcon color="#1d9bf0" />
            </div>
          {/if}
        </span>
        <span class="text-gray-500!" title={`@${handle}`}>
          @{handle}
        </span>
      </div>
      {#if platform === 'peerlist'}
        <a aria-label={message_url} class="ml-auto" href={message_url} target="_blank" rel="noopener noreferrer">
          <PeerlistIcon color="#219653" width="24" height="24" />
        </a>
      {/if}
      {#if platform === 'reddit'}
        <a aria-label={message_url} class="ml-auto" href={message_url} target="_blank" rel="noopener noreferrer">
          <RedditIcon color="#FF4500" width="40" height="40" />
        </a>
      {/if}
      {#if platform === 'ph'}
        <a aria-label={message_url} class="ml-auto" href={message_url} target="_blank" rel="noopener noreferrer">
          <ProductHuntIcon width="40" height="40" color="#FF6154" />
        </a>
      {/if}
      {#if platform === 'twitter'}
        <a aria-label={message_url} class="ml-auto" href={message_url} target="_blank" rel="noopener noreferrer">
          <TwitterIcon height="24" width="24" color="#3BA9EE" />
        </a>
      {/if}
      {#if platform === 'github'}
        <a aria-label={message_url} class="ml-auto" href={message_url} target="_blank" rel="noopener noreferrer">
          <GitHubIcon height="24" width="24" />
        </a>
      {/if}
      {#if platform === 'gmail'}
        <div class="ml-auto">
          <GmailIcon width="24" height="24" />
        </div>
      {/if}
    </div>
    <div contenteditable="false" bind:innerHTML={formattedText} class="text-launchfast mt-4 mb-1 whitespace-pre-wrap"></div>
  </div>
</div>
