/*!-- Largedly adopted from CS340 starter_code --*/
function deleteInstructor(instructorID) {
    let link = '/delete-instructor-ajax/';
    let data = {
      instructor_id: instructorID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(instructorID);
      }
    })
  };
  
  function deleteRow(instructorID){
      let table = document.getElementById("instructors-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == instructorID) {
              table.deleteRow(i);
              deleteDropDownMenu(instructorID);
              break;
         }
      }
  };




function deleteDropDownMenu(instructorID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(instructorID)){
      selectMenu[i].remove();
      break;
    } 

  }
}

