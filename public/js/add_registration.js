/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let addRegistrationForm = document.getElementById('add-registration-form-ajax');

// Modify the objects we need
addRegistrationForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form input IDs
    let inputIds = [
        "input-registration_id",
        "input-student_id",
        "input-year",
        "input-quarter"
    ];

    // Get the values from the form inputs
    let data = {};
    inputIds.forEach(function (inputId) {
        let inputValue = document.getElementById(inputId).value;
        let inputName = inputId.replace("input-", "");
        data[inputName] = inputValue;
    });

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-registration-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input inputs for another transaction
            inputIds.forEach(function (inputId) {
                document.getElementById(inputId).value = '';
                location.reload();
            });
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// registrations table
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("registrations-table");
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells
    let row = document.createElement("TR");

    let cellData = [
        newRow.registration_id,
        newRow.student_id,
        newRow.year,
        newRow.quarter
        
    ];

    cellData.forEach(function (cellValue) {
        let cell = document.createElement("TD");
        cell.innerText = cellValue;
        row.appendChild(cell);
    });

    let deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteRegistration(newRow.registration_id);
    };

    let deleteCellTd = document.createElement("TD");
    deleteCellTd.appendChild(deleteCell);
    row.appendChild(deleteCellTd);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.registration_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop-down menu, create a new option, fill data in the option (details about the registration)
    // then append the option to the drop-down menu so newly created rows via AJAX will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document

}


