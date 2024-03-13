/*!-- Largedly adopted from CS340 starter_code --*/
// Get the objects we need to modify
let updateClassForm = document.getElementById('update-class-form-ajax');

// Modify the objects we need
updateClassForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClassDetails = document.getElementById("mySelect");
    let inputClassCode = document.getElementById("input-class_code-update");
    let inputInstructor = document.getElementById("input-instructor-update");
    let inputClassName = document.getElementById("input-class_name-update")
    let inputDepartmentId = document.getElementById("input-department_id-update")
    let inputCapacityId = document.getElementById("input-capacity-update")
    let inputSection = document.getElementById("input-section-update")
    let inputYear = document.getElementById("input-year-update")
    let inputQuarter = document.getElementById("input-quarter-update")

    // Get the values from the form fields
    let classDetailsValue = inputClassDetails.value;
    let classCodeValue = inputClassCode.value;
    let instructorValue = inputInstructor.value;
    let classNameValue = inputClassName.value;
    let departmentIdValue = inputDepartmentId.value;
    let capacityValue = inputCapacityId.value;
    let sectionValue = inputSection.value;
    let yearValue = inputYear.value;
    let quarterValue = inputQuarter.value
    
    // Put our data we want to send in a javascript object
    let data = {
        class_details: classDetailsValue,
        class_code: classCodeValue,
        instructor_id: instructorValue,
        class_name: classNameValue,
        department_id: departmentIdValue,
        capacity: capacityValue,
        section: sectionValue,
        year: yearValue,
        quarter: quarterValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, classDetailsValue);
            // this is needed when the table has dynamically displayed data
            location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, ClassID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("classes-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == ClassID) {

            // Get the location of the row where we found the matching Class ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of class_name value (3th column in classes table)
            let classCodetd = updateRowIndex.getElementsByTagName("td")[1];
            classCodetd.innerHTML = parsedData[0].class_code;

            // Get td of class_name value (3th column in classes table)
            let classNametd = updateRowIndex.getElementsByTagName("td")[2];
            classNametd.innerHTML = parsedData[0].class_name;

            // Get td of class_name value (3th column in classes table)
            let departmentIdtd = updateRowIndex.getElementsByTagName("td")[3];
            departmentIdtd.innerHTML = parsedData[0].department_id;
            
            // Get td of class_name value (3th column in classes table)
            let capacitytd = updateRowIndex.getElementsByTagName("td")[4];
            capacitytd.innerHTML = parsedData[0].capacity;
            
            // Get td of instructor_id value (6th column in classes table)
            let instructorIdtd = updateRowIndex.getElementsByTagName("td")[5];
            // Reassign instructor_id to our value we updated to
            instructorIdtd.innerHTML = parsedData[0].instructor_id;

            // Get td of class_name value (3th column in classes table)
            let sectiontd = updateRowIndex.getElementsByTagName("td")[6];
            sectiontd.innerHTML = parsedData[0].section;

            // Get td of class_name value (3th column in classes table)
            let yeartd = updateRowIndex.getElementsByTagName("td")[7];
            yeartd.innerHTML = parsedData[0].year;

            // Get td of class_name value (3th column in classes table)
            let quartertd = updateRowIndex.getElementsByTagName("td")[8];
            quartertd.innerHTML = parsedData[0].quarter;
            
       }
    }
}


