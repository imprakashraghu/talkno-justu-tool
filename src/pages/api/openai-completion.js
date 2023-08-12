const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
    if (req.method === 'POST') {
          const openai = new OpenAIApi(configuration)
          const result = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: req.body.prompt,
                temperature: 0.7,
                max_tokens: 300,
            })
            res.json({ result: result })
    } else {
        res.json({ message: 'Method Not Allowed!' })
    }
}