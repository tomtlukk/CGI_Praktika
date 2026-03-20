const data = [
    { tableId: "5", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 1, startingPosY: 1, tableWidth: 1, tableLength: 1 },
    { tableId: "6", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 7, startingPosY: 6, tableWidth: 1, tableLength: 2 },
    { tableId: "7", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 8, startingPosY: 4, tableWidth: 1, tableLength: 1 },
    { tableId: "8", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 2, startingPosY: 4, tableWidth: 1, tableLength: 3 },
    { tableId: "9", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 9, startingPosY: 9, tableWidth: 1, tableLength: 1 },
    { tableId: "10", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 5, startingPosY: 2, tableWidth: 2, tableLength: 1 },
    { tableId: "11", tableCapacity: 4, tableZone: "outside", tablePreferences: "window", startingPosX: 2, startingPosY: 1, tableWidth: 1, tableLength: 3 }
];

const grid = document.getElementById("grid-container");

data.forEach(table => {
    const el = document.createElement("div");
    el.classList.add("grid-square");

    // Position + size
    el.style.gridColumn = `${table.startingPosX} / span ${table.tableWidth}`;
    el.style.gridRow = `${table.startingPosY} / span ${table.tableLength}`; // todo add tableLength to Table record, db schema and repository (simplifies logic)

    el.textContent = table.tableId;

    grid.appendChild(el);
});