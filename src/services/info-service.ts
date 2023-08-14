import axios from 'axios'

export async function getCatFact(): Promise<string> {
  const response = await axios.get('https://cat-fact.herokuapp.com/facts/random')
  return JSON.stringify(response.data.text)
}
