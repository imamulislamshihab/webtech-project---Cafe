// Kitchen staff functions
function renderKitchen() {
    renderKitchenOrders();
    renderKitchenMenu();
}

function renderKitchenOrders() {
    const orders = getOrders().filter(function (order) {
        return order.status === "New" || order.status === "Preparing" || order.status === "Ready";
    });
    if (orders.length === 0) {
        document.getElementById("kitchenOrders").innerHTML = "<p>There are no active orders.</p>";
        return;
    }
    document.getElementById("kitchenOrders").innerHTML = '<div class="table-wrap"><table><tr><th>Order</th><th>Type / Table</th><th>Items</th><th>Status</th><th>Prep. Minutes</th><th>Action</th></tr>' +
        orders.map(function (order) {
            let next = order.status === "New" ? "Preparing" : order.status === "Preparing" ? "Ready" : "";
            const items = order.items.map(function (item) { return item.name + " x " + item.qty; }).join(", ");
            return '<tr><td>' + order.id + '</td><td>' + escapeText(order.type) + (order.table ? " / Table " + escapeText(order.table) : "") + '</td><td>' + escapeText(items) + '</td><td>' + order.status + '</td>' +
                '<td><input class="small-input" type="number" min="1" id="prep-' + order.id + '" value="' + order.prepTime + '"></td><td>' +
                '<button type="button" data-action="save-prep" data-id="' + order.id + '">Save Time</button>' +
                (next ? '<button type="button" data-action="kitchen-status" data-id="' + order.id + '" data-status="' + next + '">Mark ' + next + '</button>' : 'Waiting for pickup / rider') +
                '</td></tr>';
        }).join("") + '</table></div>';
}

function renderKitchenMenu() {
    const items = getItems();
    document.getElementById("kitchenMenu").innerHTML = '<div class="table-wrap"><table><tr><th>Item</th><th>Category</th><th>Availability</th><th>Action</th></tr>' +
        items.map(function (item) {
            return '<tr><td>' + escapeText(item.name) + '</td><td>' + escapeText(item.category) + '</td><td>' + (item.available ? "Available" : "Sold Out") + '</td><td>' +
                '<button type="button" data-action="toggle-availability" data-id="' + item.id + '">' + (item.available ? "Mark Sold Out" : "Mark Available") + '</button></td></tr>';
        }).join("") + '</table></div>';
}

// Shared table builder used by the dashboards.
function makeTable(headers, rows, allowHtml) {
    if (!rows.length) return "<p>No information available.</p>";
    return '<div class="table-wrap"><table><tr>' + headers.map(function (heading) { return '<th>' + escapeText(heading) + '</th>'; }).join("") + '</tr>' +
        rows.map(function (row) {
            return '<tr>' + row.map(function (cell, index) {
                return '<td>' + (allowHtml && index === row.length - 1 ? cell : escapeText(cell)) + '</td>';
            }).join("") + '</tr>';
        }).join("") + '</table></div>';}