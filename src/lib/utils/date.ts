export const getDate = (dateObject: Date) => {
  const month = dateObject.toLocaleString('en-us', { month: 'long' })
  const date = dateObject.getDate()
  const year = dateObject.getFullYear()
  return `${month} ${date}, ${year}`
}
