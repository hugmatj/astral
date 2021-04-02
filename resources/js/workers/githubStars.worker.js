import { fetchStarsQuery } from '@/queries'

self.addEventListener('message', async ({ data }) => {
  const result = await (
    await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${data.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: fetchStarsQuery(),
      }),
    })
  ).json()

  self.postMessage(result.data)
})

export default self
