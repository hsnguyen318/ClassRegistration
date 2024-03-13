/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let addStudentForm = document.getElementById('add-student-form-ajax');

// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form input IDs
    let inputIds = [
        "input-student_id",
        "input-first_name",
        "input-last_name",
        "input-email",
        "input-pin"
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
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input inputs for another transaction
            inputIds.forEach(function (inputId) {
                document.getElementById(inputId).value = '';
            location.reload()
            });
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// students table
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("students-table");
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells
    let row = document.createElement("TR");

    let cellData = [
        newRow.student_id,
        newRow.first_name,
        newRow.last_name,
        newRow.email,
        newRow.pin
    ];

    cellData.forEach(function (cellValue) {
        let cell = document.createElement("TD");
        cell.innerText = cellValue;
        row.appendChild(cell);
    });

    let deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteStudent(newRow.student_id);
    };

    let deleteCellTd = document.createElement("TD");
    deleteCellTd.appendChild(deleteCell);
    row.appendChild(deleteCellTd);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.student_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop-down menu, create a new option, fill data in the option (details about the student)
    // then append the option to the drop-down menu so newly created rows via AJAX will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.student_id + ' ' + newRow.first_name + ' ' +  newRow.last_name;
    option.value = newRow.instructor_id;
    selectMenu.add(option);

}



