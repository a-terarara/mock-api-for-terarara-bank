const { https } = require("firebase-functions");
const cors = require("cors")({ origin: true });

exports.accounts = https.onRequest((req, res) => {
  cors(req, res, () => {});
  if (!verifyAccessToken(req.headers.authorization))
    res.status(403).send("Unauthorized");

  fetchAccounts(res);
});
exports.transactions = https.onRequest((req, res) => {
  cors(req, res, () => {});
  if (!verifyAccessToken(req.headers.authorization))
    res.status(403).send("Unauthorized");

  fetchTransactions(req.query.account_number, res);
});
exports.transfer = https.onRequest((req, res) => {
  cors(req, res, () => {});
  if (!verifyAccessToken(req.headers.authorization))
    res.status(403).send("Unauthorized");
  if (req.method === "POST") createTransfer(req.body, res);
  if (req.method === "PUT") confirmTransfer(req.body, res);

  res.status(405).send("Method Not Allowed");
});

verifyAccessToken = authz => {
  if (!authz || !authz.startsWith("Bearer ")) return false;
  const idToken = authz.split("Bearer ")[1];
  return true;
};

fetchAccounts = res => {
  return res.send({
    account_number: 12345,
    name: "山田太郎",
    address: "東京都",
    phone_number: "010-1234-5678",
    is_available: true
  });
};
fetchTransactions = (account_number, res) => {
  if (!account_number) return res.status(400).send("Invalid value");
  if (account_number !== 12345)
    return res.status(404).send("Account Not found");

  return res.send([
    {
      id: 1,
      summary: "口座開設",
      amount: "0",
      is_available: true
    },
    {
      id: 2,
      summary: "入金",
      amount: "1000",
      is_available: true
    },
    {
      id: 3,
      summary: "振込",
      amount: "10",
      is_available: true
    }
  ]);
};
createTransfer = (body, res) => {
  const {
    from_account_number,
    to_bank_code,
    to_branch_code,
    to_account_number,
    amount,
    memo
  } = body;
  if (
    !(
      from_account_number &&
      to_bank_code &&
      to_branch_code &&
      to_account_number &&
      amount
    )
  )
    return res.status(400).send("Invalid value");

  return res.send({ transfer_id: "12345" });
};
confirmTransfer = (body, res) => {
  const { transfer_id } = body;
  if (!transfer_id) return res.status(400).send("Invalid value");
  if (transfer_id !== "12345")
    return res.status(404).send("Transfer not found");

  return res.send({ transfer_id: "12345" });
};
