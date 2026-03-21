const data = [
    { tableId: "5", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 1, startingPosY: 1, tableWidth: 1, tableLength: 1 },
    { tableId: "6", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 7, startingPosY: 6, tableWidth: 1, tableLength: 2 },
    { tableId: "7", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 8, startingPosY: 4, tableWidth: 1, tableLength: 1 },
    { tableId: "8", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 2, startingPosY: 4, tableWidth: 1, tableLength: 4},
    { tableId: "9", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 9, startingPosY: 9, tableWidth: 1, tableLength: 1 },
    { tableId: "10", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 5, startingPosY: 2, tableWidth: 2, tableLength: 1 },
    { tableId: "11", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 2, startingPosY: 1, tableWidth: 1, tableLength: 3 }
];

function isOutOfBounds(table) {
    if (table.startingPosY < 2 || table.startingPosY > 9 || table.startingPosX < 2 || table.startingPosX > 9) {
        console.error("Table starts out of bounds!");
        return true;
    }

    // -1 because table has a minimum width/length of 1
    if (table.startingPosX+table.tableWidth-1 > 9 || table.startingPosY+table.tableLength-1 > 9) {
        console.error("Table ends out of bounds!");
        return true;
    }
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

        if (isOverlap(newTable, table)) {

        }
    }
}


// populate grid with tables
const grid = document.getElementById("grid-container");

data.forEach(table => {
    // todo prevent invalid tables from being accepted by controller
    if (isOutOfBounds(table)) return;

    const el = document.createElement("div");
    el.classList.add("grid-square");

    // Position + size
    el.style.gridColumn = `${table.startingPosX} / span ${table.tableWidth}`;
    el.style.gridRow = `${table.startingPosY} / span ${table.tableLength}`; // todo add tableLength to Table record, db schema and repository (simplifies logic)

    el.textContent = table.tableId;

    grid.appendChild(el);
});