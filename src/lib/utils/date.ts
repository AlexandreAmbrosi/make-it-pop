import { format } from 'date-fns'

export const getDate = (dateObject: Date | string) => {
  const date = typeof dateObject === 'string' ? new Date(dateObject) : dateObject
  return format(date, 'MMMM d, yyyy')
}
