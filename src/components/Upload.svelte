<script lang="ts">
  /*
    A component that can be used anywhere in your app

    <Upload />
  */

  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import PinIcon from '~icons/material-symbols-light/attach-file'

  let file: any = null
  let fileInput = $state()

  async function uploadFile() {
    const formData = new FormData()
    if (file) formData.append('file', file)
    else {
      toast('No file attached.')
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      toast(`Uploading ${file.name}...`)
      fetch('/api/storage', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(() => {
          toast(`Uploaded ${file.name} succesfully.`)
        })
        .catch(() => {
          toast(`Failed to upload ${file.name}.`)
        })
    }
    reader.readAsArrayBuffer(file)
  }

  function handleFileChange(event: any) {
    file = event.target.files[0]
    uploadFile()
  }

  const triggerUpload = () => document.getElementById('fileInput')?.click()

  onMount(() => (file = null))
</script>

<button
  onclick={() => triggerUpload()}
  class="flex max-w-max flex-row items-center gap-x-1 rounded border border-branding px-3 py-1 text-sm text-gray-900 transition duration-200 hover:bg-branding hover:text-white"
>
  <PinIcon />
  <span> Upload </span>
</button>

<input class="hidden" type="file" id="fileInput" onchange={handleFileChange} bind:this={fileInput} />
