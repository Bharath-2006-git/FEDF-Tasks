// import library into our application
const express = require('express')
const app = express() // Instance of express
const port = 3000 // Port number
// HTTP GET Method 
app.get('/users', (req, res) => {
  res.send('Bharath 2410030313!')
})
// Starting the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
