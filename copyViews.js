const fs = require("fs-extra");

async function copyViews() {
  try {
    // Source and destination paths
    const src = "./views";
    const dest = "./dist/views";

    // Copy the views folder
    await fs.copy(src, dest);
    console.log("Views folder moved successfully!");
  } catch (err) {
    console.error("Error moving views folder:", err);
  }
}

copyViews();
