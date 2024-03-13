/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateStudentForm = document.getElementById('update-student-form-ajax');

// Modify the objects we need
updateStudentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStudentDetails = document.getElementById("mySelect");
    let inputFirstName = document.getElementById("input-first_name-update");
    let inputLastName = document.getElementById("input-last_name-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPin = document.getElementById("input-pin-update");

    // Get the values from the form fields
    let studentDetailsValue = inputStudentDetails.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let pinValue = inputPin.value;
    
    // currently the database table for students does not allow updating values to NULL
    // so we must abort if being bassed NULL for student_id

    // Put our data we want to send in a javascript object
    let data = {
        student_details: studentDetailsValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        email: emailValue,
        pin: pinValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, studentDetailsValue);
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, StudentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("students-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == StudentID) {

            // Get the location of the row where we found the matching Student ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of first_name value (2nd column in students table)
            let firstNametd = updateRowIndex.getElementsByTagName("td")[1];
            firstNametd.innerHTML = parsedData[0].first_name;

            // Get td of last_name value (3rd column in students table)
            let lastNametd = updateRowIndex.getElementsByTagName("td")[2];
            lastNametd.innerHTML = parsedData[0].last_name;

            // Get td of email value (4th column in students table)
            let emailtd = updateRowIndex.getElementsByTagName("td")[3];
            emailtd.innerHTML = parsedData[0].email;

            // Get td of pin value (5th column in students table)
            let pintd = updateRowIndex.getElementsByTagName("td")[4];
            pintd.innerHTML = parsedData[0].pin;
            
       }
    }
}




