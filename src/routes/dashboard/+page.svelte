<script lang="ts">
  import { toast } from 'svelte-sonner'
  import { userProfile } from '@/stores'

  const invokeFile = () => {
    document.getElementById('change_picture')?.click()
  }

  const updateUsername = () => {
    toast('Requesting username update...')
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: (document.getElementById('username_value') as HTMLInputElement).value }),
    })
      .then((res) => {
        if (res.headers.get('Content-Type')?.includes('json')) return res.json()
        return { set: false }
      })
      .then((res) => {
        if (res?.set) {
          toast('Username updated succesfully.')
          fetch('/auth/session')
            .then((res) => res.json())
            .then((res) => {
              if (res?.user) userProfile.set(res.user)
            })
        } else {
          toast('Failed to update your username.')
        }
      })
  }

  const deleteAccount = () => {
    toast('Requesting account deletion...')
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deleteAccount: true,
        name: (document.getElementById('name_verification') as HTMLInputElement).value,
        message: (document.getElementById('verification_message') as HTMLInputElement).value,
      }),
    })
      .then((res) => {
        if (res.headers.get('Content-Type')?.includes('json')) return res.json()
        return { redirect: false }
      })
      .then((res) => {
        if (res?.redirect) {
          toast('Account deleted succesfully.')
          setTimeout(() => {
            window.location.href = res.redirect
          }, 1000)
        } else {
          toast('Please enter matching entries.')
        }
      })
  }

  const uploadFile = (e) => {
    const formData = new FormData()
    const fileList = e.target.files
    if (!fileList?.length) {
      toast('No new file attached.')
      return
    }
    formData.append('file', fileList[0])
    const reader = new FileReader()
    reader.onload = async () => {
      toast('Uploading your avatar...')
      const storageEndpoint = new URL('/api/storage', window.location.origin)
      fetch(storageEndpoint.toString(), {
        method: 'POST',
        body: formData,
      })
        .then((res) => {
          if (!res.ok) return
          return res.json()
        })
        .then((res) => {
          if (res?.fileURL) {
            toast('Avatar uploaded succesfully!')
            storageEndpoint.searchParams.set('file', res.fileURL)
            fetch(storageEndpoint.toString())
              .then((res_) => res_.json())
              .then((res_) => {
                if (res_?.filePublicURL) {
                  toast('Registering avatar update...')
                  const imageElement = document.getElementById('picture_value') as HTMLImageElement
                  imageElement.src = res_.filePublicURL
                  fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_ref: res.fileURL }),
                  })
                    .then((res) => {
                      if (res.headers.get('Content-Type')?.includes('json')) return res.json()
                      return { set: false }
                    })
                    .then((res) => {
                      if (res?.set) {
                        toast('Avatar registration succesful!')
                        fetch('/auth/session')
                          .then((res) => res.json())
                          .then((res) => {
                            if (res?.user) userProfile.set(res.user)
                          })
                      } else {
                        toast('Failed to register your avatar.')
                      }
                    })
                }
              })
          } else {
            toast('Failed to upload your avatar.')
          }
        })
    }
    reader.readAsArrayBuffer(fileList[0])
  }
</script>

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  <h1 class="pb-6 text-3xl font-medium text-launchfast">Settings</h1>
  <div class="mt-12 grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
    <nav class="grid gap-4 text-sm text-muted-foreground"><a class="-mx-4 rounded px-4 py-2 font-semibold text-primary hover:bg-muted/25" href="/dashboard">General</a></nav>
    {#if $userProfile?.name}
      <div class="grid gap-6">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-row flex-wrap justify-between gap-4 space-y-1.5 p-6 md:gap-0">
            <div class="flex flex-col">
              <h3 class="text-2xl font-semibold leading-none tracking-tight">Your Avatar</h3>
              <p class="mt-3 text-sm text-muted-foreground">
                This is your avatar accessible within LaunchFast.
                <br />
                Click on the avatar to upload a custom one from your files.
              </p>
            </div>
            <input onchange={(e) => uploadFile(e)} id="change_picture" type="file" class="hidden" />
            <button
              id="picture_value"
              onclick={() => invokeFile()}
              class="inline-flex h-auto w-[90px] items-center justify-center whitespace-nowrap rounded-full bg-secondary text-sm font-medium text-secondary-foreground outline-none !ring-0 ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <img alt={$userProfile.name} class="aspect-square cursor-pointer rounded-full" src={$userProfile.image} />
            </button>
          </div>
          <div class="flex items-center p-6 pt-0">
            <p class="text-sm text-muted-foreground">An avatar is optional but strongly recommended.</p>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">Your Email</h3>
            <p class="text-sm text-muted-foreground">This is your email accessible within LaunchFast.</p>
          </div>
          <div class="p-6 pt-0">
            <input
              disabled
              value={$userProfile.email}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">Your Name</h3>
            <p class="text-sm text-muted-foreground">This is your name visible within LaunchFast.</p>
          </div>
          <div class="p-6 pt-0">
            <input
              id="username_value"
              value={$userProfile.name}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div class="flex items-center border-t p-6 px-6 py-4">
            <button
              id="change_username"
              onclick={() => updateUsername()}
              class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">Delete Account</h3>
            <p class="text-sm text-muted-foreground">
              Permanently remove your account and all of its contents from the LaunchFast platform. This action is not reversible — please continue with caution.
            </p>
          </div>
          <div class="flex items-center border-t p-6 px-6 py-4">
            <label
              for="modal-1"
              class="inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Delete Account
            </label>
            <input class="modal-state" id="modal-1" type="checkbox" />
            <div class="modal">
              <label class="modal-overlay" for="modal-1"></label>
              <div class="modal-content flex flex-col bg-white">
                <label for="modal-1" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </label>
                <h2 class="text-lg font-semibold leading-none tracking-tight">Delete Account</h2>
                <p class="mt-2 text-sm text-muted-foreground">LaunchFast will delete all of your projects.</p>
                <div class="grid gap-4 py-4">
                  <div class="grid gap-4">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="name_verification">
                      To verify, type your account name below:
                    </label>
                    <input
                      id="name_verification"
                      placeholder={$userProfile.name}
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div class="grid gap-4">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="verification_message">
                      To verify, type delete my account below:
                    </label>
                    <input
                      id="verification_message"
                      placeholder="delete my account"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <button
                    class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    type="submit"
                    id="continue_delete_button"
                    onclick={() => deleteAccount()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="grid gap-6">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-2xl font-semibold leading-none tracking-tight">You are not signed in.</h3>
            <p class="flex flex-col text-sm text-muted-foreground">
              <span class="mt-1">Sign in to start editing your profile.</span>
              <a
                href="/signin"
                class="mt-3 inline-flex h-10 max-w-max items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Sign In →
              </a>
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
