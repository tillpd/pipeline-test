const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const sql = require('./db')

const dbTest = async() => {
  const results = await sql`SELECT 1;`
  console.log(results)
}

console.log(process.env.HEROKU_POSTGRESQL_MAROON_URL);

(async () => {
try {
  dbTest()
} catch (e) {
  console.log(e)
}
})()

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
