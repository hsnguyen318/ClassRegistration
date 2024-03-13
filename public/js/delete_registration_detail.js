/*!-- Largedly adopted from CS340 starter_code --*/
function deleteRegistrationDetails(registrationDetailsID) {
    let link = '/delete-registration_detail-ajax/';
    let data = {
      registration_details_id: registrationDetailsID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(registrationDetailsID);
      }
    })
  };
  
  function deleteRow(registrationDetailsID){
      let table = document.getElementById("registration_details-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == registrationDetailsID) {
              table.deleteRow(i);
              deleteDropDownMenu(registrationDetailsID)
              break;
         }
      }
  };

  function deleteDropDownMenu(registrationDetailsID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(registrationDetailsID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  };
  
  
  