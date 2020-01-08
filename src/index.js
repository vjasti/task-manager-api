const app = require('app')
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Task manager App is started on port ${port}`)
})