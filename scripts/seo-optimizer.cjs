const fs = require("fs");
const path = require("path");

const pagesSeo = {
  "index.html": {
    title: "DeepVoid Saga | Sovereign Transmedia Universe | 3D Web3 & Spatial Computing",
    description: "DeepVoid Saga is a sovereign transmedia universe by Moody Designs. Explore hyper-optimized 3D spatial simulations, zero-server meta-architectures, and philosophical hard sci-fi.",
    keywords: "metaverse studio, 3D metaverse design, web3 development, virtual reality architecture, spatial computing, unity metaverse projects, unreal engine 5 webgl, digital twins",
    canonical: "https://moodydesigns.net/",
    ogImage: "https://moodydesigns.net/images/moodydesigns-metaverse-studio-hero-background.jpg",
    type: "website",
    category: "Metaverse Studio Homepage"
  },
  "home.html": {
    title: "DeepVoid Saga | Sovereign Transmedia Universe | 3D Web3 & Spatial Computing",
    description: "DeepVoid Saga is a sovereign transmedia universe by Moody Designs. Explore hyper-optimized 3D spatial simulations, zero-server meta-architectures, and philosophical hard sci-fi.",
    keywords: "metaverse studio, 3D metaverse design, web3 development, virtual reality architecture, spatial computing, unity metaverse projects, unreal engine 5 webgl, digital twins",
    canonical: "https://moodydesigns.net/home.html",
    ogImage: "https://moodydesigns.net/images/moodydesigns-metaverse-studio-hero-background.jpg",
    type: "website",
    category: "Metaverse Studio Homepage"
  },
  "metaverse-portfolio.html": {
    title: "Metaverse Portfolio | Immersive 3D Worlds & Web3 Environments | DeepVoid Saga",
    description: "DeepVoid Saga is a sovereign transmedia universe by Moody Designs. Explore hyper-optimized 3D spatial simulations, zero-server meta-architectures, and philosophical hard sci-fi.",
    keywords: "metaverse portfolio, 3d design showcase, web3 environment examples, interactive 3d web, spatial computing projects",
    canonical: "https://moodydesigns.net/metaverse-portfolio.html",
    ogImage: "https://moodydesigns.net/images/moodydesigns-metaverse-studio-hero-background.jpg",
    type: "article",
    category: "Portfolio Showcase"
  },
  "metaverse-services.html": {
    title: "Metaverse Design Services | Professional Spatial & 3D Development | DeepVoid Saga",
    description: "DeepVoid Saga is a sovereign transmedia universe by Moody Designs. Explore hyper-optimized 3D spatial simulations, zero-server meta-architectures, and philosophical hard sci-fi.",
    keywords: "metaverse design services, professional 3d development, spatial computing agency, webgl development services, virtual world engineering",
    canonical: "https://moodydesigns.net/metaverse-services.html",
    ogImage: "https://moodydesigns.net/images/moodydesigns-metaverse-studio-hero-background.jpg",
    type: "article",
    category: "Professional Services"
  }
};

Object.entries(pagesSeo).forEach(([fileName, seo]) => {
  const filePath = fileName;
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://moodydesigns.net/#organization",
        "name": "DeepVoid Saga | Sovereign Transmedia Universe",
        "url": "https://moodydesigns.net/",
        "logo": "https://moodydesigns.net/images/moodydesigns-metaverse-studio-official-logo.png",
        "email": "moodydesigns.sales@gmail.com",
        "sameAs": [
          "https://x.com/Adel_Paalmee",
          "https://youtube.com/@Moodydesigns_Metaverse"
        ],
        "description": "DeepVoid Saga is a sovereign transmedia universe by Moody Designs. Explore hyper-optimized 3D spatial simulations, zero-server meta-architectures, and philosophical hard sci-fi."
      },
      {
        "@type": "WebSite",
        "@id": "https://moodydesigns.net/#website",
        "url": "https://moodydesigns.net/",
        "name": "DeepVoid Saga | Sovereign Transmedia Universe",
        "publisher": {
          "@id": "https://moodydesigns.net/#organization"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${seo.canonical}#webpage`,
        "url": seo.canonical,
        "name": seo.title,
        "description": seo.description,
        "isPartOf": {
          "@id": "https://moodydesigns.net/#website"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": seo.ogImage
        }
      }
    ]
  };

  const seoBlock = `
    <!-- Google Search Engine Optimization (SEO) & Metadata -->
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords}">
    <meta name="author" content="DeepVoid Saga | Sovereign Transmedia Universe">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="${seo.canonical}">

    <!-- Open Graph / Social Sharing -->
    <meta property="og:type" content="${seo.type}">
    <meta property="og:site_name" content="DeepVoid Saga | Sovereign Transmedia Universe">
    <meta property="og:url" content="${seo.canonical}">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:image" content="${seo.ogImage}">
    <meta property="og:image:alt" content="${seo.title}">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card Meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@Adel_Paalmee">
    <meta name="twitter:creator" content="@Adel_Paelmee">
    <meta name="twitter:title" content="${seo.title}">
    <meta name="twitter:description" content="${seo.description}">
    <meta name="twitter:image" content="${seo.ogImage}">
    <meta name="twitter:image:alt" content="${seo.title}">

    <!-- Schema.org JSON-LD Structured Data for Google Search Indexing -->
    <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
    </script>
`;

  // Remove duplicate/stale tags
  content = content.replace(/<title>[^<]*<\/title>/gi, "");
  content = content.replace(/<meta\s+name=["' ]description["' ]?[^>]*>/gi, "");
  content = content.replace(/<meta\s+name=["' ]keywords["' ]?[^>]*>/gi, "");
  content = content.replace(/<link\s+rel=["' ]canonical["' ]?[^>]*>/gi, "");
  content = content.replace(/<meta\s+property=["' ]og:[^>]*>/gi, "");
  content = content.replace(/<meta\s+name=["' ]twitter:[^>]*>/gi, "");
  content = content.replace(/<script\s+type=["' ]application\/ld\+json["' ]?[\s\S]*?<\/script>/gi, "");

  // Insert seoBlock right after <head>
  content = content.replace(/<head>/i, `<head>\n${seoBlock}`);

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Injected SEO metadata into ${fileName}`);
});
