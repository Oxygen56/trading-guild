/**
 * Casper Testnet — Real On-Chain Transfer Transaction (Condor / api v2.0.0)
 *
 * Usage:
 *   cd trading-guild && node scripts/casper-tx.cjs
 *
 * First run: generates + saves an Ed25519 keypair, prints the public key,
 *            and tells you to claim faucet tokens at the CSPR.Live faucet.
 * Second run (after faucet): loads the saved key and sends a real transfer
 *            on Casper Testnet.
 */
const sdk = require("casper-js-sdk");
const fs   = require("fs");
const path = require("path");

const RPC_URL   = "https://node.testnet.casper.network/rpc";
const CHAIN_NAME = sdk.CasperNetworkName.Testnet;

const KEY_FILE   = path.join(__dirname, "..", ".casper-testnet-key.json");
const FAUCET_URL = "https://testnet.cspr.live/tools/faucet";

const TRANSFER_AMOUNT_MOTES = 2_500_000_000; // 2.5 CSPR

// ── helpers ─────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Write a JSON keyfile compatible with the casper-client tool. */
function saveKey(keyPath, privateKey) {
  const pubKey  = privateKey.publicKey;
  const data = {
    privateKey: Buffer.from(privateKey.toBytes()).toString("hex"),
    publicKey:  pubKey.toHex(),
    accountHash: pubKey.accountHash().toHex(),
    algorithm:  "ed25519",
  };
  fs.writeFileSync(keyPath, JSON.stringify(data, null, 2), "utf8");
  return data;
}

/** Load a saved keypair.  Returns null when the file is missing. */
function loadKey(keyPath) {
  if (!fs.existsSync(keyPath)) return null;
  const raw = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  // Reconstruct the SDK objects
  const privateKey = sdk.PrivateKey.fromHex(raw.privateKey, 1); // 1 = ED25519
  const publicKey  = privateKey.publicKey;
  return { privateKey, publicKey, data: raw };
}

// ── main ────────────────────────────────────────────────────────
async function main() {
  console.log("=== Casper Testnet — Real On-Chain Transaction (Condor) ===\n");

  // ════════════════════════════════════════════════════════════
  // 1.  Key management  (persist to .casper-testnet-key.json)
  // ════════════════════════════════════════════════════════════
  console.log("[1/4] Key management …");

  let keyData;
  const existing = loadKey(KEY_FILE);

  if (existing) {
    console.log("  ✅ Loaded saved key from .casper-testnet-key.json");
    keyData = existing.data;
  } else {
    console.log("  🔑 No saved key — generating new Ed25519 keypair …");
    const pk  = sdk.PrivateKey.generate(1);              // 1 = ED25519
    keyData   = saveKey(KEY_FILE, pk);
    console.log("  ✅ Key saved to .casper-testnet-key.json");
    console.log("");
    console.log("  ┌───────────────────────────────────────────────────────────────┐");
    console.log("  │  ⚠️  FIRST-TIME SETUP — this key has NO funds yet            │");
    console.log("  │                                                               │");
    console.log("  │  Public Key (copy this):                                     │");
    console.log("  │  " + keyData.publicKey + "            │");
    console.log("  │                                                               │");
    console.log("  │  Fund this key via ONE of these methods:                     │");
    console.log("  │                                                               │");
    console.log("  │  A) CSPR.Live wallet transfer (if you have funded account):  │");
    console.log("  │     https://testnet.cspr.live → Wallet → Send                │");
    console.log("  │     Send any amount (e.g. 10 CSPR) to the Public Key above   │");
    console.log("  │                                                               │");
    console.log("  │  B) Faucet (if you haven't used it yet):                     │");
    console.log("  │     " + FAUCET_URL + "                   │");
    console.log("  │                                                               │");
    console.log("  │  After funding, re-run:                                      │");
    console.log("  │    node scripts/casper-tx.cjs                                 │");
    console.log("  └───────────────────────────────────────────────────────────────┘");
    console.log("");
    process.exit(0);
  }

  const senderPrivateKey = sdk.PrivateKey.fromHex(keyData.privateKey, 1);
  const senderPubKey     = senderPrivateKey.publicKey;
  const senderPubHex     = keyData.publicKey;
  const senderAcctHash   = keyData.accountHash;

  console.log("  Public Key:   " + senderPubHex);
  console.log("  Account Hash: " + senderAcctHash);

  // Generate a one-off destination key (doesn't need funds)
  const destKey = sdk.PrivateKey.generate(1);
  const destPubHex = destKey.publicKey.toHex();

  // ════════════════════════════════════════════════════════════
  // 2.  RPC handshake
  // ════════════════════════════════════════════════════════════
  console.log("\n[2/4] Connecting to Casper Testnet …");
  const rpcClient = new sdk.RpcClient(
    new sdk.HttpHandler(RPC_URL, "fetch")
  );

  const status = await rpcClient.getStatus();
  console.log("  Network:      " + (status.chainspec_name || status.chainspecName));
  console.log("  API version:  " + status.apiVersion);
  console.log("  Block height: " + status.lastAddedBlockInfo.height);
  console.log("  ✅ RPC connected");

  // ════════════════════════════════════════════════════════════
  // 3.  Build + sign the transfer transaction
  // ════════════════════════════════════════════════════════════
  console.log("\n[3/4] Building transfer transaction …");
  console.log("  From:    " + senderPubHex);
  console.log("  To:      " + destPubHex);
  console.log("  Amount:  2.5 CSPR (" + TRANSFER_AMOUNT_MOTES + " motes)");

  const txn = sdk.makeCsprTransferTransaction({
    senderPublicKeyHex:    senderPubHex,
    recipientPublicKeyHex: destPubHex,
    transferAmount:        TRANSFER_AMOUNT_MOTES,
    chainName:             CHAIN_NAME,
    gasPrice:              1,
    paymentAmount:         "100000000",         // 0.1 CSPR gas
    casperNetworkApiVersion: "2.0.0",           // Condor Transaction V1
  });

  // Sign the transaction
  txn.sign(senderPrivateKey);
  const localHash = txn.hash.toHex();
  console.log("  ✅ Signed — local hash: " + localHash);

  // ════════════════════════════════════════════════════════════
  // 4.  Broadcast
  // ════════════════════════════════════════════════════════════
  console.log("\n[4/4] Broadcasting to Casper Testnet …");
  try {
    const result = await rpcClient.putTransaction(txn);
    // TransactionHash is an SDK object with .toHex(); also try raw JSON fallback
    const txHash =
      (result.transactionHash?.toHex && result.transactionHash.toHex()) ||
      result.rawJSON?.transaction_hash?.Version1 ||
      result.rawJSON?.transaction_hash?.version1 ||
      result.deployHash ||
      "";
    console.log("  ✅ TRANSACTION SENT!");
    console.log("  Transaction Hash: " + txHash);

    // ── Summary ────────────────────────────────────────────────
    console.log("\n" + "=".repeat(62));
    console.log("📋  ON-CHAIN TRANSACTION — COMPLETE");
    console.log("=".repeat(62));
    console.log("Network:           Casper Testnet (casper-test)");
    console.log("Transaction Hash:  " + txHash);
    console.log("From Public Key:   " + senderPubHex);
    console.log("From Account Hash: " + senderAcctHash);
    console.log("To Public Key:     " + destPubHex);
    console.log("Amount:            2.5 CSPR");
    console.log("Explorer:          https://testnet.cspr.live/deploy/" + txHash);
    console.log("=".repeat(62));

    // Persist the tx hash alongside the key
    try {
      const keyData = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
      keyData.lastTxHash = txHash;
      keyData.lastTxExplorer = "https://testnet.cspr.live/deploy/" + txHash;
      fs.writeFileSync(KEY_FILE, JSON.stringify(keyData, null, 2), "utf8");
    } catch (_) { /* best-effort */ }

    // Poll for execution
    console.log("\n  ⏳ Waiting for block inclusion (30 s) …");
    await sleep(30000);
    try {
      const info = await rpcClient.getTransaction(txHash);
      console.log("  Execution info: " + JSON.stringify(info).substring(0, 400));
    } catch (_) {
      console.log("  (chain may still be finalising — check explorer)");
    }

    return { txHash, senderPubHex, senderAcctHash };
  } catch (err) {
    console.log("  ❌ Broadcast failed: " + err.message);

    if (
      err.message.toLowerCase().includes("insufficient") ||
      err.message.toLowerCase().includes("balance")       ||
      err.message.includes("-32016")
    ) {
      console.log("");
      console.log("  💡 This account has no funds.  Fund it via:");
      console.log("     A) CSPR.Live wallet → Send to this Public Key");
      console.log("     B) Faucet: " + FAUCET_URL);
      console.log("     Public Key: " + senderPubHex);
    }
    throw err;
  }
}

main()
  .then((r) => {
    if (r) console.log("\n✅ Done! Tx hash: " + r.txHash);
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ " + err.message);
    process.exit(1);
  });
