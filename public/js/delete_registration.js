/*!-- Largedly adopted from CS340 starter_code --*/
function deleteRegistration(registrationID) {
  let link = '/delete-registration-ajax/';
  let data = {
    registration_id: registrationID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(registrationID);
    }
  })
};

function deleteRow(registrationID){
    let table = document.getElementById("registrations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == registrationID) {
            table.deleteRow(i);
            deleteDropDownMenu(registrationID)
            break;
       }
    }
};

function deleteDropDownMenu(registrationID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(registrationID)){
      selectMenu[i].remove();
      break;
    } 

  }
};
