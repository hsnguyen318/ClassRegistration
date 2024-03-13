/*!-- Largedly adopted from CS340 starter_code --*/
function deleteSection(section) {
    let link = '/delete-section-ajax/';
    let data = {
      section: section
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(section);
      }
    });
  }

  function deleteRow(section){
    let table = document.getElementById("sections-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == section) {
            table.deleteRow(i);
            deleteDropDownMenu(section)
            break;
       }
    }
};

function deleteDropDownMenu(section){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(section)){
      selectMenu[i].remove();
      break;
    } 

  }
}
