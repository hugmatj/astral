import { fetchStarsQuery } from '@/queries'
import { FetchDirections } from '@/types'

self.addEventListener('message', async ({ data }) => {
  const cursor: string = data.cursor || null
  const direction: keyof FetchDirections = data.direction || 'DESC'

  const result = await (
    await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${data.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: fetchStarsQuery(cursor, direction),
      }),
    })
  ).json()

  self.postMessage(result.data)
})

export default self
