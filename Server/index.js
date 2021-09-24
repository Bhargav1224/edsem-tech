const app = require("./server");

const connect = require("./src/config/db");

app.listen(8000,async()=>{
    await connect();
    console.log("Listening on port 8000")
})