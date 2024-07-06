const { mainBNB } = require("../../scripts/InteractiveBnc");
const { main } = require("../../scripts/InteractiveWithoutHardhat");

exports.addProduct = async (req, res) => {
  try {
    const { productName, productID, productExpiryDate } = req.body;
    if (!productName || !productID || !productExpiryDate) {
      return res
        .status(400)
        .json({ error: "Missing required product details" });
    }

    const result = await main(productName, productID, productExpiryDate);
    res.json({
      message: "Product added successfully",
      transactionDetails: result,
    });
  } catch (err) {
    console.error("Error in /addProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addProductIdsToBNC = async (req, res) => {
  try {
    const { productID } = req.body;
    if (!productID) {
      return res
        .status(400)
        .json({ error: "Missing required product details" });
    }

    const result = await mainBNB(productID);
    res.json({
      message: "Product added successfully",
      transactionDetails: result,
    });
  } catch (err) {
    console.error("Error in /addProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
