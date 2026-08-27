import express from "express"

const app = express()
const PORT = 3000

app.get("/viewallrestaurant", (req, res) => {
        res.send("Viewing All Restaurant")
    })

app.get("/searchrestaurant", (req, res) => {
        res.send("Searching Restaurant")
    })

app.listen(PORT, ()=>
        console.log("[SERVER] The Restaurant server has started on port 3000"));






