// import library into our application
const express = require('express')
const app = express() // Instance of express
const port = 3000 // Port number

// Routing path based on file
// app.get('/sample.txt', (req, res) => {
//   res.send('Bharath\n2410030313\nA5\nCSE!')
// })

// Routing path based on string patterns(?,+,*,())

// 1. ? - Makes the preceding character optional (0 or 1 occurrence)
// Matches: /acd OR /abcd
app.get(/\/ab?cd/, (req, res) => {
    res.send('Pattern ?')
})

// 2. + - One or more occurrences of the preceding character
// Matches: /abcd, /abbcd, /abbbcd, etc.
app.get(/\/ab+cd/, (req, res) => {
    res.send('Pattern +')
})

// 3. * - Zero or more occurrences of the preceding character
// Matches: /acd, /abcd, /abbcd, /abbbcd, etc.
app.get(/\/ab*cd/, (req, res) => {
    res.send('Pattern *')
})

// 4. () - Grouping, makes the entire group optional with ?
// Matches: /abe OR /abcde
app.get(/\/ab(cd)?e/, (req, res) => {
    res.send('Pattern ()')
})

// Match any path starting with /k (using regex)
app.get(/^\/k.*/, (req, res) => {
    res.send('Any word starting with k')
})

app.get(/.*fly$/, (req, res) => {
  res.send('Any word ending with fly')
})

app.get(/.*ia$/, (req, res) => {
  res.send('Any word ending with ia')
})


// Starting the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})