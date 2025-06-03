import express from "express";
import { createTransaction } from "../controller/midtransController.js";

const router = express.Router();

router.post("/pay/:timestamp", createTransaction);
router.post("/midtrans-webhook", async (req, res) => {
  const { order_id, transaction_status } = req.body;
  let statusDb;

  switch (transaction_status) {
    case "settlement":
      statusDb = "success";
      break;
    case "deny":
    case "cancel":
    case "expire":
      statusDb = "failed";
      break;
    case "pending":
    default:
      statusDb = "pending";
  }

  await prisma.transactions.update({
    where: { order_id },
    data: { status: statusDb },
  });

  res.status(200).send("OK");
});


export default router;