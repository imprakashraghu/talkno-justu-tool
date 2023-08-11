// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let final_event = null
    const response = await axios.post("https://play.ht/api/v2/tts", 
    {
            "quality": "draft",
            "output_format": "mp3",
            "speed": 1,
            "sample_rate": 24000,
            "text": req.body.content,
            "voice": process.env.PLAY_HT_VOICE_1_ID
        }, {
      headers: {
          // "content-type": "text/event-stream",
          "AUTHORIZATION": "Bearer "+process.env.PLAY_HT_1,
          "X-USER-ID": process.env.PLAY_HT_1_UID
      },
      responseType: 'stream',
    })

    const stream = response.data;

    stream.on('data', data => {
        let resss = data.toString()
        // console.log(resss?.split('\n'), 'split-n');
        let arrRes = resss?.split('\n')
        for (let i=0;i<arrRes.length; i++) {
          if (arrRes[i]==='event: completed\r') {
            return res.send(arrRes[i+1]?.split('data:')[1].replace(/\n/g,"").replace(/ /g,"").replace(/\r/g,"")||null)
          }
        }
    });

    stream.on('end', () => {
        console.log("stream done");
    });

  } else {
    res.json({message:'method not allowed'})
  }
}
