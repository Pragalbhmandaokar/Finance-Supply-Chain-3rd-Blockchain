const providerSepolia = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, providerSepolia);
