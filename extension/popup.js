const BACKEND_URL = "http://localhost:3000";

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const error =
    document.getElementById("error");

const refreshButton =
    document.getElementById("refreshButton");


// Prevent unsafe HTML
function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// Format Indian currency
function formatPrice(price) {

    if (
        price === null ||
        price === undefined
    ) {
        return "Price unavailable";
    }

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);
}


// Show error
function showError(message) {

    loading.classList.add("hidden");

    result.classList.add("hidden");

    error.classList.remove("hidden");

    error.textContent = message;
}


// Show loading
function showLoading() {

    loading.classList.remove("hidden");

    result.classList.add("hidden");

    error.classList.add("hidden");
}


// Get product from current webpage
async function getCurrentProduct() {

    return new Promise(
        (resolve, reject) => {

            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },

                (tabs) => {

                    const tab = tabs[0];

                    if (!tab || !tab.id) {

                        reject(
                            new Error(
                                "Cannot access current tab."
                            )
                        );

                        return;
                    }


                    chrome.tabs.sendMessage(
                        tab.id,

                        {
                            action: "getProduct"
                        },

                        (response) => {

                            if (
                                chrome.runtime.lastError
                            ) {

                                reject(
                                    new Error(
                                        "Please refresh the product page and try again."
                                    )
                                );

                                return;
                            }


                            if (!response) {

                                reject(
                                    new Error(
                                        "Could not detect the product."
                                    )
                                );

                                return;
                            }


                            resolve(response);

                        }
                    );

                }
            );

        }
    );
}


// Compare prices
async function comparePrices() {

    try {

        showLoading();


        // Get product from webpage
        const product =
            await getCurrentProduct();


        if (
            !product.name ||
            product.name.length < 3
        ) {

            throw new Error(
                "Product name could not be detected."
            );

        }


        // Display product name
        document.getElementById(
            "productName"
        ).textContent = product.name;


        // Display current price
        document.getElementById(
            "currentPrice"
        ).textContent =
            product.price || "Unavailable";


        // Product image
        const image =
            document.getElementById(
                "productImage"
            );


        if (product.image) {

            image.src = product.image;

        } else {

            image.style.display = "none";

        }


        // Create backend URL
        const url =
            `${BACKEND_URL}/api/compare?product=${encodeURIComponent(
                product.name
            )}`;


        // Send request to backend
        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Price comparison server error."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to compare prices."
            );

        }


        // Display results
        displayComparison(data);

    }

    catch (err) {

        console.error(err);

        showError(
            err.message ||
            "Something went wrong."
        );

    }
}


// Display comparison results
function displayComparison(data) {

    loading.classList.add("hidden");

    error.classList.add("hidden");

    result.classList.remove("hidden");


    if (
        !data.comparisons ||
        data.comparisons.length === 0
    ) {

        showError(
            "No comparable prices were found."
        );

        return;
    }


    // Cheapest product
    const best =
        data.comparisons[0];


    document.getElementById(
        "bestPrice"
    ).textContent =
        formatPrice(best.price);


    document.getElementById(
        "bestStore"
    ).textContent =
        best.store;


    document.getElementById(
        "savings"
    ).textContent =
        `You could save ${formatPrice(
            data.savings
        )}`;


    // Comparison list
    const list =
        document.getElementById(
            "comparisonList"
        );


    list.innerHTML = "";


    data.comparisons.forEach(
        (item, index) => {

            const row =
                document.createElement("div");


            row.className =
                "store-row" +
                (index === 0
                    ? " best-row"
                    : "");


            row.innerHTML = `

                <div>

                    <div class="store-name">
                        ${escapeHTML(item.store)}
                    </div>

                    <div class="store-price">
                        ${formatPrice(item.price)}
                    </div>

                </div>

                <a
                    class="buy-button"
                    href="${escapeHTML(item.link)}"
                    target="_blank"
                >
                    View
                </a>

            `;


            list.appendChild(row);

        }
    );
}


// Check Again button
refreshButton.addEventListener(
    "click",
    comparePrices
);


// Start automatically
comparePrices();