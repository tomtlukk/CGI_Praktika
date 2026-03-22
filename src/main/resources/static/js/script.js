let selectedTableId = null;
let reservations = null;
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
function doesTableOverlap(tableA, tableB) {
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

        if (doesTableOverlap(newTable, table)) return true;
    }
    return false;
}

function selectTable(event) {
    console.log(`Table with ID ${event.currentTarget.id} clicked!`);
    event.currentTarget.classList.add("table-selected");

    if (selectedTableId) {
        unselectTable(selectedTableId)
    }

    // Table already gets unselected, setting last table ID to null to prevent stuff
    if (selectedTableId === event.currentTarget.id) {
        selectedTableId = null;
        return;
    }

    selectedTableId = event.currentTarget.id;
}

function getReservationData() {

    // todo
    const dateElement = document.getElementById("date-selection");
    const timeElement = document.getElementById("time-selection");
    const clientCountElement = document.getElementById("client-count");
    const seatingLocationElement = document.getElementById("seating-location");
    const clientPreferencesElement = document.getElementById("client-preferences")
    
    //combine datetime into date object
    let [year, month, day] = dateElement.value.split("-");
    let [hour, minute] = timeElement.value.split(":");

    const date = new Date(year, month, day, hour, minute)
    console.log(date);
    console.log(seatingLocationElement.value)
    console.log(clientCountElement.value)

    return {selectedDateTime: date, clientCount: clientCountElement.value, seatingLocation: seatingLocationElement.value, clientPreferences: clientPreferencesElement.value}
}

function suggestTable() {
    getReservationData();
    // todo filter all tables for criteria, then filter for reservations on leftover tables
}

// generic method to check if a table is reserved at current selected time
function isTableReserved(tableId, reservationData) {

    const userReservationData = getReservationData();

    const newFrom = userReservationData.selectedDateTime;
    const newUntil = new Date(newFrom.getTime() + 2 * 60 * 60 * 1000);

    const hasConflict = reservationData.some(reservation => {
        if (reservation.tableId !== tableId) return false;

        return (
            newFrom < reservation.reservationUntil &&
            newUntil > reservation.reservationFrom
        );

    });
    // todo add reserved class to all reserved tables, make sure the other tables don't have the class if unreserved
}

function populateTimeSelection() {
    const el = document.getElementById("time-selection");
    for (let hour = 10; hour < 22; hour++) {
        for (let minute = 0; minute < 60; minute+=30) {
            const option = document.createElement("option");
            let cleanedMinutes = minute;
            if (minute === 0) {
                cleanedMinutes += "0";
            }

            let timeString = `${hour}:${cleanedMinutes}`
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

function doesTimeOverlap() {

}
function unselectTable() {
    const el = document.querySelector(`.table[id="${selectedTableId}"]`)
    if (el != null) {
        el.classList.remove("table-selected")
    }
    // todo disable the reserve button
}

function reserveTable() {
    if (selectedTableId === null) {
        console.warn("User tried reserving a table without selecting one.")
        return;
    }
    const data = getReservationData();
    const from = new Date(data.selectedDateTime.getTime() + 3 * 60 * 60 * 1000); // +3 hours to sync timezone todo reasonable fix
    const until = new Date(from.getTime() + 2 * 60 * 59 * 1000); // slightly under 2 hours so it is freed up for the next time slot
    fetch("http://localhost:8080/api/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tableId: selectedTableId,
            reservationFrom: from,
            reservationUntil: until
        })
    });

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
        // todo add check for round table
        const tableDiv = document.createElement("div");
        tableDiv.classList.add("table")
        tableDiv.addEventListener("click", selectTable)
        tableDiv.id = table.tableId;
        if (table.tablePreferences === "round") {
            tableDiv.classList.add("round");
        }

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

fetch("http://localhost:8080/api/reservations")
    .then(res => res.json())
    .then(data => console.log(data))

fetch("http://localhost:8080/api/tables")
    .then(res => res.json())
    .then(data => loadTables(data));

populateDateSelection();
populateTimeSelection();
getReservationData();