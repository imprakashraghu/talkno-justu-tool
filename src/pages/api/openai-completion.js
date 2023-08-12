const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
    try {
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
    } catch (err) {
        console.log(err);
        let mock = {
            type: 'mock',
           data: {
                choices: [
                    {
                        text: '{"quote":"You know Open Ai key is not working for me at the moment because of too may requests! Even still I am responding too you!","character":"Naruto"}'
                    }
                ]
            }
        }
        res.json(mock)
    }
}