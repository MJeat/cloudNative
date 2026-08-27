import express from "express"

const app = express()
const PORT = 3001

app.get("/paymentprocess", (req, res) => {
        res.send("Payment Success")
    })

app.listen(PORT, ()=>
        console.log("[SERVER] The Payment server has started on port 3001"));






