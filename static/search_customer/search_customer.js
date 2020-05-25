//HTML ELEMENTS

  //search bar
var query,
    //advanced search
    search_by = document.getElementById("search_by"),
    pattern = document.getElementById("pattern"),
    sort = document.getElementById("sort"),
    order = document.getElementById("order"),
    c_update_button = document.getElementById("c_update_button"),
    c_mark_button = document.getElementById("c_mark_button"),
    c_delete_button = document.getElementById("c_delete_button"),
    c_res_table = document.getElementById("c_res_table"),
    //customer section
    //project section
    //transaction section
    //submit button div
    //API
    other_api = document.getElementById("other_api"),
    //api object for ajax
    api = {
      ids_selected:[],
    };

/*#####SEARCH CUSTOMER BLOCK ######*/

/*** event for update_button / mark_button ***/
//edit_event function
function edit_event (event){
  var customer_id = event.target.parentNode.getElementsByTagName("td")[0].innerText
  api.id_selected= customer_id
  console.log("from edit_event function : " , api.id_selected)
}
//mark_event function
function mark_event(event){
  var customer_id = event.target.parentNode.getElementsByTagName("td")[0].innerText
  if (event.target.parentNode.style.backgroundColor=="red"){ //unselect row
      event.target.parentNode.setAttribute("style","background-color:white")
      api.ids_selected.pop(customer_id)
  }else{//select row
      event.target.parentNode.setAttribute("style","background-color:red")
      api.ids_selected.push(customer_id)
  }
  if (api.ids_selected.length){//show or hide delete button if user select row/s
    c_delete_button.removeAttribute("hidden")
  }else{
    c_delete_button.setAttribute("hidden","")
  }
  console.log("from mark function : " , api.ids_selected)
}

c_update_button.addEventListener('click',function (){
  //general actions
  c_delete_button.setAttribute("hidden","")
  var tr = c_res_table.getElementsByTagName("tr");//reset rows color
  for (i=0;i<tr.length;i++){
    if (i>0) {
        tr[i].setAttribute("style","backgroundColor:white")
    }
  }
  c_update_button.setAttribute("style","style.boxShadow: 0px 0px 15px red")
  c_mark_button.setAttribute("style","boxShadow:none")
  //remove other event
  var tr = c_res_table.getElementsByTagName("tr");
  for (i=0;i<tr.length;i++){
    tr[i].removeEventListener('click', mark_event)
  }
  //set new event
  var tr = c_res_table.getElementsByTagName("tr");
  for (i=0;i<tr.length;i++){
    if (i>0){
      tr[i].addEventListener('click', edit_event)
    }
  }
  console.log("from c_update_button event")
})
/*** event for mark_button ***/
c_mark_button.addEventListener('click',function (){
  //general actions
  c_update_button.style.boxShadow="none"
  c_mark_button.style.boxShadow="0px 0px 15px red"
  //remove other event
  var tr = c_res_table.getElementsByTagName("tr");
  for (i=0;i<tr.length;i++){
    tr[i].removeEventListener('click', edit_event)
  }
  //set new event
  var tr = c_res_table.getElementsByTagName("tr");
  for (i=0;i<tr.length;i++){
    if (i>0){//prevent select table header
        tr[i].addEventListener('click', mark_event)
    }
  }
  console.log("from c_mark_button event")
})

/*get_id_event load first*/
var tr = c_res_table.getElementsByTagName("tr");
for (i=0;i<tr.length;i++){
  if (i>0){//prevent select table header
      tr[i].addEventListener('click', edit_event)
  }
}
/*** -- END -- event for update_button / mark_button ***/

/*##### -- END -- SEARCH CUSTOMER BLOCK ######*/

/*TESTING */
