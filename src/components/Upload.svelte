<script lang="ts">
  /*
    A component that can be used anywhere in your app

    <Upload />
  */

  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import PinIcon from '~icons/material-symbols-light/attach-file'

  let file: any = null

  async function uploadFile() {
    if (!file) {
      toast('No file attached.')
      return
    }
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.onload = async () => {
        toast(`Uploading ${file.name}...`)
        try {
          const response = await fetch(`/api/storage?type=${file.type}&name=${file.name}`, {
            method: 'POST',
          })
          const res = await response.json()
          if (res?.publicUploadUrl) {
            const response2 = await fetch(res.publicUploadUrl, {
              method: 'PUT',
              body: file,
            })
            if (response2.ok) {
              toast(`Uploaded ${file.name} successfully.`)
              resolve(response2)
            } else throw new Error()
          } else throw new Error()
        } catch {
          toast(`Failed to upload ${file.name}.`)
          resolve(null)
        }
      }
      reader.readAsArrayBuffer(file)
    })
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

<input class="hidden" type="file" id="fileInput" onchange={handleFileChange} />
