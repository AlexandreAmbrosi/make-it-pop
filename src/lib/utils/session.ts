import { userProfile } from '@/stores'

export const getClientSession = () =>
  fetch('/auth/session')
    .then((res) => res.json())
    .then((res) => {
      if (res?.user) userProfile.set(res.user)
    })
