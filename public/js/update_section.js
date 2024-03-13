/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateSectionForm = document.getElementById('update-section-form-ajax');

// Modify the objects we need
updateSectionForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSection = document.getElementById("mySelect");
    let inputMethod = document.getElementById("input-method-update");

    // Get the values from the form fields
    let sectionValue = inputSection.value;
    let methodValue = inputMethod.value;

    // Put our data we want to send in a javascript object
    let data = {
        section: sectionValue,
        method: methodValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-section-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, sectionValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, section){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("sections-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       if (table.rows[i].getAttribute("data-value") == section) {
            // Get the location of the row where we found the matching section number
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of section value (1st column in sections table)
            let sectiontd = updateRowIndex.getElementsByTagName("td")[0];
            sectiontd.innerHTML = parsedData[0].section;

            // Get td of method value (2nd column in sections table)
            let methodtd = updateRowIndex.getElementsByTagName("td")[1];
            methodtd.innerHTML = parsedData[0].method;
       }
    }
}
