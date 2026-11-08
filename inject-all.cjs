const fs = require("fs");
const path = require("path");

const htmlFiles = fs.readdirSync(".").filter(f => f.endsWith(".html"));

// SEO Mapping (simplified)
const seoMap = {
  "index.html": {
    title: "Moodydesigns | Emerging Meta-Civilizations & 3D Web3 Metaverse Studio",
    description: "Explore emerging new Meta-Civilizations throughout history, present, and future in immersive 3D-web3 metaverse experiences created by Moodydesigns Studio.",
    canonical: "https://moodydesigns.net/"
  }
  // Add other pages as needed or use a generic template
};

htmlFiles.forEach(hf => {
  let content = fs.readFileSync(hf, "utf8");

  // Inject CSS
  if (!content.includes("metaverse-enhancements.css")) {
    content = content.replace("</head>", `  <link rel="stylesheet" href="css/metaverse-enhancements.css">\n</head>`);
  }

  // Inject JS
  if (!content.includes("metaverse-enhancements.js")) {
    content = content.replace("</body>", `  <script src="js/metaverse-enhancements.js" defer></script>\n</body>`);
  }

  // Basic SEO Injection (simplified example for index)
  if (hf === "index.html") {
    const seo = seoMap["index.html"];
    const seoBlock = `\n    <title>${seo.title}</title>\n    <meta name="description" content="${seo.description}">\n    <link rel="canonical" href="${seo.canonical}">`;
    content = content.replace(/<head>/i, `<head>${seoBlock}`);
  }

  fs.writeFileSync(hf, content, "utf8");
  console.log(`Updated ${hf}`);
});
console.log("Completed enhancements and SEO injection.");
