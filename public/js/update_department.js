/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateDepartmentForm = document.getElementById('update-department-form-ajax');

// Modify the objects we need
updateDepartmentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDepartmentDetails = document.getElementById("mySelect");
    let inputDepartmentName = document.getElementById("input-department_name-update");

    // Get the values from the form fields
    let departmentDetailsValue = inputDepartmentDetails.value;
    let departmentNameValue = inputDepartmentName.value;

    // Put our data we want to send in a javascript object
    let data = {
        department_id: departmentDetailsValue,
        department_name: departmentNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-department-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, departmentDetailsValue);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, DepartmentID) {
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("departments-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       // iterate through rows
       if (table.rows[i].getAttribute("data-value") == DepartmentID) {

            // Get the location of the row where we found the matching Department ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of department_id value (1st column in departments table)
            let departmentIdtd = updateRowIndex.getElementsByTagName("td")[0];
            departmentIdtd.innerHTML = parsedData[0].department_id;

            // Get td of department_name value (2nd column in departments table)
            let departmentNametd = updateRowIndex.getElementsByTagName("td")[1];
            departmentNametd.innerHTML = parsedData[0].department_name;
       }
    }
}
