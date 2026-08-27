import express from "express"

const app = express()
const PORT = 3003

app.get("/sendnotification", (req, res) => {
        res.send("Notification Sent")
    })

app.listen(PORT, ()=>
        console.log("[SERVER] The Notification server has started on port 3003"));






