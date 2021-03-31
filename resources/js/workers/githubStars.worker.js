import axios from 'axios'
import { fetchStarsQuery } from '@/queries'

self.addEventListener('message', async ({ data }) => {
  const result = await axios.post(
    'https://api.github.com/graphql',
    {
      query: fetchStarsQuery(),
    },
    {
      headers: {
        Authorization: `bearer ${data.token}`,
      },
    }
  )
  self.postMessage(result.data.data)
})

export default self
