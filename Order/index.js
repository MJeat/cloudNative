import express from "express"

const app = express()
const PORT = 3002

app.get("/addorder", async (req, res) => {
    try {
        // Call Payment Service
        const paymentResponse = await fetch(
            "http://localhost:3001/paymentprocess"
        )

        const paymentResult = await paymentResponse.text()

        // Check payment result
        if (paymentResult === "Payment Success") {

            // Call Notification Service for successful payment
            await fetch(
                "http://localhost:3003/sendnotification"
            )

            res.send("Order Added - Payment Success - Success Notification Sent")

        } else {

            // Call Notification Service for failed payment
            await fetch(
                "http://localhost:3003/sendnotification"
            )

            res.send("Order Added - Payment Failed - Failure Notification Sent")
        }

    } catch (error) {
        console.error(error)
        res.status(500).send("Order Processing Failed")
    }
})

app.get("/vieworder", (req, res) => {
        res.send("Viewing Order")
    })

app.get("/cancelorder", (req, res) => {
        res.send("Cancelling Order")
    })


app.listen(PORT, () =>
    console.log("[SERVER] The Order server has started on port 3002"))






