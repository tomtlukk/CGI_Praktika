let selectedTableId = null;
let reservations = null;
let tables = null;

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

    // don't let user select table if it's reserved or doesn't match preferences
    if (event.currentTarget.classList.contains("table-reserved")) return;
    if (event.currentTarget.classList.contains("table-ineligible")) return;

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
    const dateElement = document.getElementById("date-selection");
    const timeElement = document.getElementById("time-selection");
    const clientCountElement = document.getElementById("client-count");
    const seatingLocationElement = document.getElementById("seating-location");
    const clientPreferencesElement = document.getElementById("client-preferences")
    
    //combine datetime into date object
    let [year, month, day] = dateElement.value.split("-");
    let [hour, minute] = timeElement.value.split(":");

    const date = new Date(year, month-1, day, hour, minute)

    return {selectedDateTime: date, clientCount: clientCountElement.value, seatingLocation: seatingLocationElement.value, clientPreferences: clientPreferencesElement.value}
}


// generic method to check if a table is reserved at current selected time
function isTableReserved(tableId) {

    const userReservationData = getReservationData();
    const newFrom = new Date(userReservationData.selectedDateTime.getTime());
    const newUntil = new Date(newFrom.getTime() + 2 * 60 * 60 * 1000);

    const hasConflict = reservations.some(reservation => {
        if (reservation.tableId !== tableId) return false;
        const resFrom = new Date(reservation.reservationFrom);
        const resUntil = new Date(reservation.reservationUntil);
        return (
            newFrom < resUntil &&
            newUntil > resFrom
        );

    });
    return hasConflict;
}

// All tables that fit criteria
function eligibleTables() {
    const optionData = getReservationData();

    tables.forEach(table => {

        let flag = false;
        // table already reserved, doesn't matter if it counts
        if (isTableReserved(table.tableId)) return;
        // reset the table eligibility
        const tableElement = document.getElementById(table.tableId);
        tableElement.classList.remove("table-ineligible");

        if (!(table.tableZone === optionData.seatingLocation) && optionData.seatingLocation !== "none") flag = true;
        if (!(table.tablePreferences === optionData.clientPreferences) && optionData.clientPreferences !== "none") flag = true;
        if ((table.tableCapacity < optionData.clientCount)) flag = true;
        if (flag) tableElement.classList.add("table-ineligible");
        flag = false;
    })
}

function refreshTables() {
    tables.forEach(table => {
        const tableElement = document.getElementById(table.tableId)
        tableElement.classList.remove("table-reserved")
        if (isTableReserved(table.tableId, reservations)) {
            tableElement.classList.add("table-reserved")
        }
    })
    eligibleTables();
}

function populateTimeSelection() {
    // todo add logic for skipping times that are past present time on first day
    const el = document.getElementById("time-selection");
    for (let hour = 10; hour <= 22; hour++) {

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
    // populate edge case of 22:00
    const option = document.createElement("option");
    let timeString = `22:00`
    option.value = timeString;
    option.text = timeString;

    el.appendChild(option);
    hidePastTimes();
}

function hidePastTimes() {
    // check if selected day is today

    const el = document.getElementById("time-selection");
    // Code snippet generated by Copilot
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();


    const data = getReservationData()
    if (data.selectedDateTime.getDate() === now.getDate()) {
        // Code snippet generated by Copilot
        for (let option of el.options) {
            const [hours, minutes] = option.value.split(":").map(Number);

            // Hide options earlier than current time
            if (hours < currentHour || (hours === currentHour && minutes <= currentMinute)) {
                option.hidden = true;  // hide past times
            } else {
                option.hidden = false; // show future times
            }
        }
        const nextOption = Array.from(el.options).find(option => !option.hidden);
        if (nextOption) nextOption.selected = true;
    } else {
        // if date is not today, force unhide all time options
        for (let option of el.options) {
            option.hidden = false;
        }
        const nextOption = Array.from(el.options).find(option => !option.hidden);
        if (nextOption) nextOption.selected = true;

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
    const from = new Date(data.selectedDateTime.getTime() + 2 * 60 * 60 * 1000); // +3 hours to sync timezone todo reasonable fix
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
    // todo fix table not turning into reserved-table clientside after being reserved until page is refreshed
}

// populate grid with tables
function loadTables(data) {

    const grid = document.getElementById("grid-container");
    tables = data;

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

async function init() {
    const resReservations = await fetch("http://localhost:8080/api/reservations");
    reservations = await resReservations.json();

    const resTables = await fetch("http://localhost:8080/api/tables");
    tables = await resTables.json();

    loadTables(tables);

    populateDateSelection();
    populateTimeSelection();

    // todo run reserved table logic once here

    tables.forEach(table => {
            if (isTableReserved(table.tableId)) {
                console.log(table.tableId);
                const tableElement = document.getElementById(table.tableId);
                tableElement.classList.add("table-reserved");
            }

        }

    )

}

const clientCountOption = document.getElementById("client-count")
const locationOption = document.getElementById("seating-location");
const preferenceOption = document.getElementById("client-preferences");
const dateOption = document.getElementById("date-selection");
const timeOption = document.getElementById("time-selection");

clientCountOption.addEventListener("change", function() {
    refreshTables()
})

locationOption.addEventListener("change", function() {
    refreshTables()
})

preferenceOption.addEventListener("change", function() {
    refreshTables()
})

// Rerun reserved table logic every time one of the options is changed
dateOption.addEventListener("change", function() {
    hidePastTimes();
    refreshTables();
})

timeOption.addEventListener("change", function() {
    refreshTables()
})

init();
