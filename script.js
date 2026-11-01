
// Your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycby6QqQtcwwfgs9yleXhKUgqTFPxQodHnzPthO1Xl2ikI6VC0PCsjSfxZInvxmAm0bcihQ/exec";
//const API_URL = "https://invalid-example-url.test";
// Fetch products from Google Sheets
async function loadProducts() {
    const catalogue = document.getElementById("catalogue");

    catalogue.textContent = "Loading cracker catalogue...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to connect to API");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        displayProducts(data.products);

    } catch (error) {
        console.error("Error:", error);

        catalogue.innerHTML = `
            <div class="error-message">
                <h3>Unable to load catalogue</h3>
                <p>Please check your internet connection and refresh the page.</p>
                <button onclick="loadProducts()">TRY AGAIN</button>
            </div>
        `;
    }
}


// Display products as category tables
function displayProducts(products) {

    const catalogue = document.getElementById("catalogue");
    
    // Clear the loading message
    catalogue.innerHTML = "";

    // Group products by category
    const categories = new Map();

    products.forEach(product => {

        if (!categories.has(product.category)) {
            categories.set(product.category, []);
        }

        categories.get(product.category).push(product);

    });


    // Create a table for each category
    categories.forEach((items, categoryName) => {

        const categorySection = document.createElement("section");
        categorySection.className = "category-card";

        // Category heading
        const heading = document.createElement("h3");
        heading.textContent = categoryName;

        categorySection.appendChild(heading);


        // Create table
        const table = document.createElement("table");

        // Table heading
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const columns = [
            "No.",
            "Product Name",
            "Price",
            "Availability"
        ];

        columns.forEach(column => {

            const th = document.createElement("th");
            th.textContent = column;

            headerRow.appendChild(th);

        });

        thead.appendChild(headerRow);
        table.appendChild(thead);


        // Table body
        const tbody = document.createElement("tbody");

        items.forEach(product => {

            const row = document.createElement("tr");

            const numberCell = document.createElement("td");
            numberCell.textContent = product.number;

            const nameCell = document.createElement("td");
            nameCell.textContent = product.product;

            const priceCell = document.createElement("td");

            priceCell.textContent =
                product.price === "" || product.price === null
                    ? "--"
                    : "₹" + product.price;

            const availabilityCell = document.createElement("td");

            if (product.available) {
                availabilityCell.textContent = "AVAILABLE";
                availabilityCell.className = "available";
            } else {
                availabilityCell.textContent = "OUT OF STOCK";
                availabilityCell.className = "unavailable";
            }
            
            row.appendChild(numberCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(availabilityCell);

            tbody.appendChild(row);

        });

        table.appendChild(tbody);

        categorySection.appendChild(table);

        catalogue.appendChild(categorySection);

    });

}


// Start loading products
loadProducts();
