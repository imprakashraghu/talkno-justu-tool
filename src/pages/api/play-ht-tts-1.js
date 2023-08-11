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
            "voice": process.env.PLAY_HT_VOICE_2_ID
        }, {
      headers: {
          "AUTHORIZATION": "Bearer "+process.env.PLAY_HT_2,
          "X-USER-ID": process.env.PLAY_HT_2_UID
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

    // const _result = await fetch("https://play.ht/api/v2/tts", {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         "quality": "low",
    //         "output_format": "mp3",
    //         "speed": 1,
    //         "sample_rate": 24000,
    //         "text": req.body.content,
    //         "voice": 's3://voice-cloning-zero-shot/60826049-56a2-49c4-86d2-b4d660270dcc/naruto/manifest.json'
    //     }),
    //     headers: {
    //       "content-type": "text/event-stream",
    //       "AUTHORIZATION": "Bearer 8d0dcb88d2f344d1a4afdc0a6fd40b6a",
    //       "X-USER-ID": "JZO6SmaG58cDlyc2RE4noy5nYME2"
    //   }})

  // res.json({id: "done"})
  } else {
    res.jsons({message:'method not allowed'})
  }
}
