// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  interface Window {
    // copy to clipboard utility
    copyTextToClipboard: any
    // crisp global selector
    $crisp: any
    // google analytics data layer
    dataLayer: any
    // Lemon Squeezy window object
    LemonSqueezy: any
    // crisp enabled flag
    enabled_crisp: any
    // posthog enabled flag
    enabled_posthog: any
    // Lemon Squeezy flag
    hasLemonSqueezy: any
    // crsip ID
    CRISP_WEBSITE_ID: any
    // Lemon Squeezy instance
    createLemonSqueezy: any
  }
}


export { }

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType
    }
  }
}
