const axios = require('axios')
function sendMail(to , subject , body){
  axios.post(process.env.MAIL_URL+`&email=${to}&subject=${subject}&msg=${body}`)
  .then(res => console.log(res.data))
  .catch(err => console.log(err))
}
module.exports = sendMail