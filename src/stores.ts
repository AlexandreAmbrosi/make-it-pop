import { writable } from 'svelte/store'

export const userProfile = writable<{ name?: string; email?: string; picture?: string }>()
