/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateInstructorForm = document.getElementById('update-instructor-form-ajax');

// Modify the objects we need
updateInstructorForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputInstructorDetails = document.getElementById("mySelect");
    let inputFirstName = document.getElementById("input-first_name-update");
    let inputLastName = document.getElementById("input-last_name-update");
    let inputEmail = document.getElementById("input-email-update");

    // Get the values from the form fields
    let instructorDetailsValue = inputInstructorDetails.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    
    // currently the database table for instructors does not allow updating values to NULL
    // so we must abort if being bassed NULL for instructor_id

    // Put our data we want to send in a javascript object
    let data = {
        instructor_details: instructorDetailsValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-instructor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, instructorDetailsValue);
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, InstructorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("instructors-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == InstructorID) {

            // Get the location of the row where we found the matching Instructor ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of first_name value (2nd column in instructors table)
            let firstNametd = updateRowIndex.getElementsByTagName("td")[1];
            firstNametd.innerHTML = parsedData[0].first_name;

            // Get td of last_name value (3rd column in instructors table)
            let lastNametd = updateRowIndex.getElementsByTagName("td")[2];
            lastNametd.innerHTML = parsedData[0].last_name;

            // Get td of email value (4th column in instructors table)
            let emailtd = updateRowIndex.getElementsByTagName("td")[3];
            emailtd.innerHTML = parsedData[0].email;
            
       }
    }
}



