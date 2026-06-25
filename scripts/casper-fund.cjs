/**
 * casper-fund.cjs — Fund a demo key from your existing CSPR.live account.
 *
 * Usage:
 *   1. Export your CSPR.live private key and save it to a temp file:
 *      echo "YOUR_PRIVATE_KEY_HEX" > /tmp/my-cspr-key.hex
 *
 *   2. Run this script:
 *      node scripts/casper-fund.cjs /tmp/my-cspr-key.hex
 *
 *   3. Delete the temp key file:
 *      rm /tmp/my-cspr-key.hex
 *
 *   4. Run the demo transfer:
 *      node scripts/casper-tx.cjs
 */
const sdk = require("casper-js-sdk");
const fs   = require("fs");
const path = require("path");

const RPC_URL         = "https://node.testnet.casper.network/rpc";
const CHAIN_NAME      = sdk.CasperNetworkName.Testnet;
const DEMO_KEY_FILE   = path.join(__dirname, "..", ".casper-testnet-key.json");
const FUND_AMOUNT     = 10_000_000_000; // 10 CSPR

async function main() {
  const keyFilePath = process.argv[2];
  if (!keyFilePath) {
    console.error("Usage: node scripts/casper-fund.cjs <private-key-hex-file>");
    console.error("  First export your CSPR.live private key to a file, then run this.");
    process.exit(1);
  }

  // ── Load funding source private key ─────────────────────────
  console.log("=== Casper Testnet — Fund Demo Key ===\n");

  let privateKeyHex;
  try {
    privateKeyHex = fs.readFileSync(keyFilePath, "utf8").trim();
    // Remove 0x prefix if present
    if (privateKeyHex.startsWith("0x")) privateKeyHex = privateKeyHex.slice(2);
  } catch (e) {
    console.error("❌ Cannot read key file: " + keyFilePath);
    console.error("   " + e.message);
    process.exit(1);
  }

  console.log("[1/4] Loading funding source key …");

  // Try Ed25519 first (alg=1), then Secp256k1 (alg=2)
  let funderKey;
  let keyAlg;
  try {
    funderKey = sdk.PrivateKey.fromHex(privateKeyHex, 1);
    keyAlg = "Ed25519";
  } catch (_) {
    try {
      funderKey = sdk.PrivateKey.fromHex(privateKeyHex, 2);
      keyAlg = "Secp256k1";
    } catch (e2) {
      console.error("❌ Failed to parse private key.  Must be a 64-char hex string.");
      console.error("   Ed25519: " + e2.message);
      process.exit(1);
    }
  }

  const funderPubHex = funderKey.publicKey.toHex();
  console.log("  Key type:    " + keyAlg);
  console.log("  Public Key:  " + funderPubHex);

  // ── Load demo key (destination) ─────────────────────────────
  console.log("\n[2/4] Loading demo key …");
  if (!fs.existsSync(DEMO_KEY_FILE)) {
    console.error("❌ Demo key not found: " + DEMO_KEY_FILE);
    console.error("   Run 'node scripts/casper-tx.cjs' first to generate it.");
    process.exit(1);
  }
  const demoKeyData = JSON.parse(fs.readFileSync(DEMO_KEY_FILE, "utf8"));
  const demoPubHex  = demoKeyData.publicKey;
  console.log("  Demo Public Key: " + demoPubHex);

  // ── RPC handshake ───────────────────────────────────────────
  console.log("\n[3/4] Connecting to Casper Testnet …");
  const rpcClient = new sdk.RpcClient(
    new sdk.HttpHandler(RPC_URL, "fetch")
  );
  const status = await rpcClient.getStatus();
  console.log("  Network:      " + status.chainspecName);
  console.log("  Block height: " + status.lastAddedBlockInfo.height);

  // ── Build, sign & broadcast ─────────────────────────────────
  console.log("\n[4/4] Sending " + (FUND_AMOUNT / 1_000_000_000) + " CSPR → demo key …");

  const txn = sdk.makeCsprTransferTransaction({
    senderPublicKeyHex:      funderPubHex,
    recipientPublicKeyHex:   demoPubHex,
    transferAmount:          FUND_AMOUNT,
    chainName:               CHAIN_NAME,
    gasPrice:                1,
    paymentAmount:           "100000000",
    casperNetworkApiVersion: "2.0.0",
  });

  txn.sign(funderKey);
  const localHash = txn.hash.toHex();
  console.log("  ✅ Signed — local hash: " + localHash);

  try {
    const result = await rpcClient.putTransaction(txn);
    const txHash = result.transactionHash?.Version1 || result.transactionHash;
    console.log("  ✅ FUNDING TRANSACTION SENT!");
    console.log("  Tx Hash:  " + txHash);
    console.log("  Explorer: https://testnet.cspr.live/deploy/" + txHash);
    console.log("");
    console.log("  ⏳ Wait ~30s for block inclusion, then run:");
    console.log("    node scripts/casper-tx.cjs");
  } catch (err) {
    console.log("  ❌ " + err.message);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
