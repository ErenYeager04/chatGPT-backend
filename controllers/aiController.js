const { Configuration, OpenAIApi} = require('openai')

const getImage = async (req, res) => {
  const { prompt } = req.body
  
  const configuration = new Configuration({
    apiKey: process.env.API_KEY,
  })
  
  const openai = new OpenAIApi(configuration)
  

  try{
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    image_url = response.data.data[0].url;
    return res.status(200).json({response: image_url})
  } catch(error) {
    if (error.response) {
      console.log(error.response.data);
      const errorMsg = error.response.data.error.message
      res.status(error.response.status).json({errorMsg})
    } else {
      console.log(error.message);
    }
  }

}

module.exports = { getImage }