
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const result = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=${req.body.q}&limit=5&offset=0&rating=g&lang=en&bundle=messaging_non_clips`,{method:'GET', headers: {'content-Type':'application/json'}}).then(res => res.json())
        let gif_url = result?.data[Math.floor(Math.random() * result?.data?.length)]?.images?.original?.webp
        return res.json({ url: gif_url||null })
    } else {
        res.json({ message: 'Method Not Allowed!' })
    }
}