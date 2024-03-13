/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateRegistrationForm = document.getElementById('update-registration-form-ajax');

// Modify the objects we need
updateRegistrationForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRegistrationId = document.getElementById("mySelect");
    let inputYear = document.getElementById("input-year-update");
    let inputQuarter = document.getElementById("input-quarter-update");
    

    // Get the values from the form fields
    let registrationIdValue = inputRegistrationId.value;
    let yearValue = inputYear.value;
    let quarterValue = inputQuarter.value;    

    // Put our data we want to send in a javascript object
    let data = {
        registration_id: registrationIdValue,
        year: yearValue,
        quarter: quarterValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-registration-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, registrationIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, RegistrationID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("registrations-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == RegistrationID) {

            // Get the location of the row where we found the matching Registration ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of year value (3th column in registrations table)
            let yeartd = updateRowIndex.getElementsByTagName("td")[2];
            yeartd.innerHTML = parsedData[0].year;

            // Get td of quarter value (4th column in registrations table)
            let quartertd = updateRowIndex.getElementsByTagName("td")[3];
            quartertd.innerHTML = parsedData[0].quarter;

            
            
       }
    }
}



