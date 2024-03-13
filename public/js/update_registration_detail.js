/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateRegistrationDetailForm = document.getElementById('update-registration_detail-form-ajax');

// Modify the objects we need
updateRegistrationDetailForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRegistrationDetailId = document.getElementById("mySelect");
    let inputRegistrationId = document.getElementById("input-registration_id-update");
    let inputClassId = document.getElementById("input-class_id-update");
    

    // Get the values from the form fields
    let registrationDetailIdValue = inputRegistrationDetailId.value;
    let registrationIdValue = inputRegistrationId.value;
    let classIdValue = inputClassId.value;    

    // Put our data we want to send in a javascript object
    let data = {
        registration_details_id: registrationDetailIdValue,
        registration_id: registrationIdValue,
        class_id: classIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-registration_detail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, registrationDetailIdValue);
            location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, RegistrationDetailID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("registration_details-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == RegistrationDetailID) {

            // Get the location of the row where we found the matching Registrationdetail ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of year value (2nd column in registration_details table)
            let registrationIdtd = updateRowIndex.getElementsByTagName("td")[1];
            registrationIdtd.innerHTML = parsedData[0].registration_id;

            // Get td of quarter value (3rd column in registration_details table)
            let classIdtd = updateRowIndex.getElementsByTagName("td")[2];
            classIdtd.innerHTML = parsedData[0].class_id;

            
            
       }
    }
}




