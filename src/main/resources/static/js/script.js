let lastClickedTableId = null;

function isOutOfBounds(table) {
    if (table.startingPosY < 2 || table.startingPosY > 9 || table.startingPosX < 2 || table.startingPosX > 9) {
        console.error(`Table ${table.tableId} starts out of bounds!`);
        return true;
    }

    // -1 because table has a minimum width/length of 1
    if (table.startingPosX+table.tableWidth-1 > 9 || table.startingPosY+table.tableLength-1 > 9) {
        console.error(`Table ${table.tableId} ends out of bounds!`);
        return true;
    }
    return false;
}

// Function made by Copilot
function isOverlap(tableA, tableB) {
    const aLeft = tableA.startingPosX;
    const aRight = tableA.startingPosX + tableA.tableWidth - 1;
    const aTop = tableA.startingPosY;
    const aBottom = tableA.startingPosY + tableA.tableLength - 1;

    const bLeft = tableB.startingPosX;
    const bRight = tableB.startingPosX + tableB.tableWidth - 1;
    const bTop = tableB.startingPosY;
    const bBottom = tableB.startingPosY + tableB.tableLength - 1;

    return !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom);
}

function checkTableOverlap(newTable, tableArray) {
    for (const table of tableArray) {
        if (newTable.tableId === table.tableId) continue;

        if (isOverlap(newTable, table)) return true;
    }
    return false;
}

function selectTable(event) {
    console.log(`Table with ID ${event.currentTarget.id} clicked!`);
    event.currentTarget.classList.add("table-selected");

    if (lastClickedTableId) {
        unselectTable(lastClickedTableId)
    }

    // Table already gets unselected, setting last table ID to null to prevent stuff
    if (lastClickedTableId === event.currentTarget.id) {
        lastClickedTableId = null;
        return;
    }

    lastClickedTableId = event.currentTarget.id;
}

function isTableReserved() {

}

function populateTimeSelection() {
    const el = document.getElementById("time-selection");
    for (let hour = 10; hour < 22; hour++) {
        for (let minute = 0; minute < 60; minute+=30) {
            const option = document.createElement("option");

            let timeString = `${hour}:${minute}`
            option.value = timeString;
            option.text = timeString;

            el.appendChild(option);
        }
    }
}

function populateDateSelection() {
    const currentDate = new Date();
    const el = document.getElementById("date-selection");

    for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() + i);

        const option = document.createElement("option");

        let dateString = date.toISOString().split("T")[0];
        let [year, month, day] = dateString.split("-");
        let cleanedString = `${day}/${month}`;

        option.value = dateString;
        option.text = cleanedString;

        el.appendChild(option)
    }
}

function selectedDate() {
    const el = document.getElementById("date-selection");
    return el.value;
}

function selectedTime() {
    const el = document.getElementById("time-selection");
    return el.value;
}

function unselectTable() {
    const el = document.querySelector(`.table[id="${lastClickedTableId}"]`)
    if (el != null) {
        el.classList.remove("table-selected")
    }

}

function reserveTable() {
    if (lastClickedTableId == null) {
        console.warn("User tried reserving a table without selecting one.")
        return;
    }
    // todo POST request with selected time, +2hr and tableId
}

// populate grid with tables
function loadTables(data) {

    const grid = document.getElementById("grid-container");

    data.forEach(table => {
        // todo prevent invalid tables from being accepted by controller
        if (isOutOfBounds(table)) return;

        if (checkTableOverlap(table, data)) {
            console.error(`Table ${table.tableId} is overlapping another table.`)
        }

        const tablePositionElement = document.createElement("div");
        tablePositionElement.classList.add("grid-square");

        // Position + size
        tablePositionElement.style.gridColumn = `${table.startingPosX} / span ${table.tableWidth}`;
        tablePositionElement.style.gridRow = `${table.startingPosY} / span ${table.tableLength}`; // todo add tableLength to Table record, db schema and repository (simplifies logic)

        // Table div
        const tableDiv = document.createElement("div");
        tableDiv.classList.add("table")
        tableDiv.addEventListener("click", selectTable)
        tableDiv.id = table.tableId;


        // Table seat count div
        const maxOccupancyDiv = document.createElement("div");
        maxOccupancyDiv.classList.add("table-seat-count")
        maxOccupancyDiv.textContent = table.tableCapacity + " ";

        // Occupancy img
        const svgImg = document.createElement("img");
        svgImg.classList.add("occupancy-img")
        svgImg.src = "/img/total-users.svg";

        maxOccupancyDiv.appendChild(svgImg);
        tableDiv.appendChild(maxOccupancyDiv);
        tablePositionElement.appendChild(tableDiv)
        grid.appendChild(tablePositionElement);
    });
}

fetch("http://localhost:8080/api/tables")
    .then(res => res.json())
    .then(data => loadTables(data));

populateDateSelection();
populateTimeSelection();