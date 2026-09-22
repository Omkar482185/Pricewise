# PriceWise 🛒💰

**PriceWise** is a Chrome extension that helps users compare product prices across online stores using Google Shopping data.

Instead of manually checking multiple websites, users can search for a product and quickly view available prices, stores, ratings, reviews, delivery information, and product links in one place.

---

## 🚀 Features

* 🔍 **Product Price Comparison**
  Search for a product and retrieve prices from multiple online stores.

* 💰 **Best Price Detection**
  Automatically identifies the lowest available price.

* 🏪 **Store-wise Comparison**
  Shows the cheapest result from each store to make comparison easier.

* 📊 **Price Savings**
  Calculates the difference between the lowest and highest available prices.

* ⭐ **Ratings & Reviews**
  Displays available product ratings and review counts.

* 🚚 **Delivery Information**
  Shows delivery details when provided by the shopping data source.

* 🔗 **Direct Product Links**
  Allows users to open the product listing directly.

* 🇮🇳 **India-focused Results**
  Shopping results are configured for India.

---

## 🧠 How It Works

PriceWise follows a simple workflow:

```text
User searches for a product
          ↓
Chrome Extension
          ↓
PriceWise Backend
          ↓
SerpAPI
          ↓
Google Shopping Data
          ↓
Price Processing & Comparison
          ↓
Lowest Price + Store-wise Results
          ↓
Displayed in Chrome Extension
```

The extension communicates with a local Node.js backend. The backend sends the product search request to SerpAPI, processes the returned Google Shopping results, and sends the relevant comparison data back to the extension.

---

## 🛠️ Technology Stack

### Frontend — Chrome Extension

* HTML
* CSS
* JavaScript
* Chrome Extension APIs

### Backend

* Node.js
* Express.js
* Axios
* CORS
* dotenv

### Data Source

* SerpAPI
* Google Shopping

---

## 📁 Project Structure

```text
Pricewise/
│
├── extension/
│   ├── content.js
│   ├── manifest.json
│   ├── popup.css
│   ├── popup.html
│   └── popup.js
│
├── server/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── .gitignore
├── LICENSE
└── README.md
```

> `server/.env` is intentionally excluded from the repository because it contains the SerpAPI API key.

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Omkar482185/Pricewise.git
```

Navigate into the project:

```bash
cd Pricewise
```

---

### 2. Install Backend Dependencies

Navigate to the server folder:

```bash
cd server
```

Install the required packages:

```bash
npm install
```

---

### 3. Configure the API Key

Create a `.env` file inside the `server` folder:

```text
server/.env
```

Add:

```env
SERPAPI_KEY=YOUR_SERPAPI_API_KEY
PORT=3000
```

Replace `YOUR_SERPAPI_API_KEY` with your own SerpAPI key.

**Never commit your `.env` file to GitHub.**

---

### 4. Start the Backend

From the `server` directory:

```bash
node server.js
```

The backend should start at:

```text
http://localhost:3000
```

You can verify that the server is running by opening:

```text
http://localhost:3000
```

You should receive:

```json
{
  "success": true,
  "message": "PriceWise backend is running"
}
```

---

## 🧩 Load the Chrome Extension

1. Open Chrome.
2. Go to:

```text
chrome://extensions/
```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project's:

```text
Pricewise/extension
```

folder.

6. The PriceWise extension should now appear in Chrome.

---

## 🔎 Example API Request

The backend provides a product comparison endpoint:

```text
GET /api/compare?product=boAt%20Airdopes%20800
```

Example:

```text
http://localhost:3000/api/compare?product=boAt%20Airdopes%20800
```

The API processes the shopping results and returns information such as:

* Product name
* Store
* Price
* Rating
* Reviews
* Delivery information
* Product link
* Best available price
* Potential savings

---

## 🔐 Security

The project uses environment variables for sensitive configuration.

The following are excluded using `.gitignore`:

```text
server/.env
server/node_modules/
```

The API key should **never** be hard-coded into the source code or uploaded to GitHub.

---

## 🎯 Project Objective

The objective of PriceWise is to simplify online shopping by providing users with a quick way to compare product prices across different online stores without manually searching each store individually.

---

## 🔮 Future Enhancements

Possible future improvements include:

* 📈 Price history tracking
* 🔔 Price-drop notifications
* 📉 Price trend graphs
* ❤️ Wishlist functionality
* 🔄 Automatic price refresh
* 🏷️ Better product matching across stores
* 📱 Improved extension UI
* ☁️ Deployment of the backend to a cloud server
* 🗄️ Database support for storing price history

---

## 👨‍💻 Author

**Omkar Salunkhe**

GitHub:
https://github.com/Omkar482185

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.
