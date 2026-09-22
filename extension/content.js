function getMetaContent(name) {
    const element =
        document.querySelector(`meta[property="${name}"]`) ||
        document.querySelector(`meta[name="${name}"]`);

    return element ? element.content : "";
}


// Get product name
function getProductName() {

    // Try Open Graph title
    const ogTitle = getMetaContent("og:title");

    if (ogTitle) {
        return ogTitle;
    }

    // Try structured Product data
    const productElement =
        document.querySelector('[itemtype*="Product"]');

    if (productElement) {

        const nameElement =
            productElement.querySelector('[itemprop="name"]');

        if (nameElement) {

            return (
                nameElement.content ||
                nameElement.textContent ||
                ""
            ).trim();
        }
    }

    // Try common product title selectors
    const selectors = [
        "#productTitle",
        ".product-title",
        ".product-name",
        "h1.product-title",
        "h1.product-name",
        "[data-testid='product-title']",
        "h1"
    ];

    for (const selector of selectors) {

        const element =
            document.querySelector(selector);

        if (element) {

            const text =
                element.innerText.trim();

            if (text.length > 3) {
                return text;
            }
        }
    }

    // Last option
    return document.title;
}


// Get product price
function getProductPrice() {

    const priceSelectors = [
        '[itemprop="price"]',
        "#priceblock_ourprice",
        "#priceblock_dealprice",
        ".a-price-whole",
        ".price",
        ".product-price",
        ".selling-price",
        "[data-testid='price']"
    ];

    for (const selector of priceSelectors) {

        const element =
            document.querySelector(selector);

        if (element) {

            const price =
                element.getAttribute("content") ||
                element.innerText;

            if (price) {
                return price.trim();
            }
        }
    }

    return "";
}


// Get product image
function getProductImage() {

    return getMetaContent("og:image") || "";
}


// Listen for request from popup
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.action === "getProduct") {

            const product = {

                name: getProductName(),

                price: getProductPrice(),

                image: getProductImage(),

                url: window.location.href,

                domain: window.location.hostname
            };

            sendResponse(product);
        }

        return true;
    }
);