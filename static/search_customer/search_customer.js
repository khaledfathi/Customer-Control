//HTML ELEMENTS
var
    //search bar
    query=document.getElementById("query"),
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
    update_customer_block = document.getElementById("update_customer_block"),
    uc_id_value = document.getElementById("uc_id_value"),
    uc_name_value = document.getElementById("uc_name_value"),
    uc_phone_value = document.getElementById("uc_phone_value"),
    uc_address_value = document.getElementById("uc_address_value"),
    uc_details_value = document.getElementById("uc_details_value"),
    //project section
    project_section=document.getElementById("project_section"),
    project_table = document.getElementById("project_table"),
    update_project =document.getElementById("update_project"),
    up_id_value = document.getElementById("up_id_value"),
    up_deal_date_value = document.getElementById("up_deal_date_value"),
    up_price_value = document.getElementById("up_price_value"),
    up_end_date_value = document.getElementById("up_end_date_value")
    up_description_value = document.getElementById("up_description_value"),
    up_status_value = document.getElementById("up_status_value"),
    up_details_value = document.getElementById("up_details_value"),
    p_update_button = document.getElementById("p_update_button"),
    p_mark_button = document.getElementById("p_mark_button"),
    p_delete_button  = document.getElementById("p_delete_button"),
    //transaction section
    transaction_block = document.getElementById("transaction_block"),
    transaction_table = document.getElementById("transaction_table"),
    ut_id =document.getElementById("ut_id"),
    ut_transaction_date =document.getElementById("ut_transaction_date"),
    ut_paied = document.getElementById("ut_paied"),
    ut_remaining = document.getElementById("ut_remaining"),
    ut_notes = document.getElementById("ut_notes"),
    update_transaction = document.getElementById("update_transaction"),
    t_update_button = document.getElementById("t_update_button"),
    t_mark_button = document.getElementById("t_mark_button"),
    t_delete_button = document.getElementById("t_delete_button"),
    //other buttons
    new_project_button = document.getElementById("new_project_button"),
    ut_new_transaction_button = document.getElementById("ut_new_transaction_button"),
    update_submit_button = document.getElementById("update_submit_button"),
    //API
    other_api = document.getElementById("other_api"),
    //api object for ajax
    api = {
      case:"",
      ids_selected:[],
      ids_selected_project:[],
      ids_selected_transaction:[]
    };

/*#####SEARCH CUSTOMER BLOCK ######*/
/*** Search Bar and advanced search***/

//search_by event - change input type depend on selection
search_by.addEventListener('change',function(){
  var selected_value = search_by.options[search_by.selectedIndex].value
  if (selected_value == "1"|| selected_value == "3"){
    query.setAttribute("type","number")
  }else{
    query.setAttribute("type","text")
  }
})
//NESTED EVENTS ##############################
function event_1 (event_1){ //event for projects rows
  update_transaction.setAttribute("hidden","")
  update_project.removeAttribute("hidden")
  //set value in ptoject update field
  up_id_value.value = event_1.target.parentNode.childNodes[0].innerText
  var project_id = up_id_value.value;
  up_deal_date_value.value = event_1.target.parentNode.childNodes[1].innerText
  up_price_value.value = event_1.target.parentNode.childNodes[2].innerText
  up_end_date_value.value = event_1.target.parentNode.childNodes[3].innerText
  up_description_value.value = event_1.target.parentNode.childNodes[4].innerText ///////
  up_details_value.value = event_1.target.parentNode.childNodes[6].innerText
  for (i in up_status_value.innerText) {
    if ( up_status_value.options[i].innerText == event_1.target.parentNode.childNodes[5].innerText ){
      up_status_value.options[i].setAttribute("selected","")
      break
    }
  }
  //nested action [transaction bock]
  transaction_block.removeAttribute("hidden")
  var req_trans = new XMLHttpRequest();
  req_trans.onreadystatechange = function (){
    if (this.readyState == 4 && this.status == 200){
      resp= JSON.parse(this.responseText)
      console.log(resp)
      data= resp.transaction
      transaction_table.innerHTML = data
      //set event for transaction rows
      var tr = transaction_table.getElementsByTagName("tr")
      for (var i=0;i<tr.length;i++){
        if (i>0){
          tr[i].addEventListener('click' , event_2)
        }
      }
    }
  }
  api.case="query_projects"
  api.project_id = project_id
  req_trans.open("POST" , "search_customer" , true)
  req_trans.setRequestHeader("content-type","application/json")
  req_trans.send(JSON.stringify(api))
}

//############
function event_2(event_2){
  update_transaction.removeAttribute("hidden","")
  cell = event_2.target.parentNode.childNodes
  ut_id.value = cell[0].innerText
  ut_transaction_date.value = cell[1].innerText
  ut_paied.value = cell[2].innerText
  ut_remaining.value = resp.remaining
  ut_notes.value=cell[3].innerText

  //event for paied field (will calculate the remaining when paied field changed )
  var current_paied = ut_paied.value,
      currnet_remaining = ut_remaining.value;
  ut_paied.addEventListener('input' , function(){
    /*ut_remaining.value =*/
    if (ut_paied.value != current_paied && ut_paied.value){
      ut_remaining.value= (parseInt(currnet_remaining) + parseInt(current_paied) ) - parseInt(ut_paied.value)
    }else {
      if (ut_paied.value ==  current_paied ){
        ut_remaining.value = currnet_remaining
      }else if(isNaN(ut_paied)){
        ut_remaining.value= parseInt (currnet_remaining) + parseInt(current_paied)
        console.log(ut_remaining.value)
      }
    }
  })
}
/*** event for update_button / mark_button ***/
//edit_event function
function edit_event (event){
  //general
  transaction_block.setAttribute("hidden","")
  update_customer_block.removeAttribute("hidden")
  update_project.setAttribute("hidden","")
  update_submit_button.style.display="block"
  project_section.removeAttribute("hidden")
  p_update_button.setAttribute("style","box-shadow 5px 5px 10px red")
  p_mark_button.removeAttribute("style")
  p_delete_button.style.display = "none"

  var customer_id = event.target.parentNode.getElementsByTagName("td")[0].innerText
  api.id_selected= customer_id
  //change in show/hide element

  var td = event.target.parentNode.getElementsByTagName("td"),
      id = td[0].innerText;
  uc_id_value.value = td[0].innerText
  uc_name_value.value = td[1].innerText
  uc_phone_value.value = td[2].innerText
  uc_address_value.value = td[3].innerText
  uc_details_value.value = td[4].innerText

  //get project table
  var req = new XMLHttpRequest();
  api.case="query_projects"
  api.id_selected = id
  req.onreadystatechange= function(){
    if (this.readyState == 4 && this.status == 200){
      resp = JSON.parse(this.responseText)
      data = resp["project"]
      project_table.innerHTML= data
      //select row event [NESTED]
      var tr = project_table.getElementsByTagName("tr")
      for (var i=0;i<tr.length;i++){
        if ( i>0 ) {
          api.ids_selected_project =[]
          //event_1
          tr[i].addEventListener('click' , event_1)
        }
      }//
    }
  }
  req.open("POST", "search_customer" ,true)
  req.setRequestHeader("content-type","application/json")
  req.send(JSON.stringify(api))

  console.log("from edit_event function : " , api.id_selected) //for TESTING , WILL BE REMOVED
}

//mark_event function
function mark_event(event){
  var customer_id = event.target.parentNode.getElementsByTagName("td")[0].innerText;

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

/*** event for update_button ***/
c_update_button.addEventListener('click',function (){
  //general actions
  c_delete_button.setAttribute("hidden","")
  update_project.removeAttribute("hidden")
  var tr = c_res_table.getElementsByTagName("tr");//reset rows color
  for (i=0;i<tr.length;i++){
    if (i>0) {
        tr[i].setAttribute("style","backgroundColor:transparent")
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
  //change in show/hide element
  update_customer_block.setAttribute("hidden","")
  update_submit_button.style.display="none"
  project_section.setAttribute("hidden","")
  transaction_block.setAttribute("hidden","")

  api.ids_selected=[]
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

//###############################
//project edit_mark events
function project_mark_event(event){
  var project_id = event.target.parentNode.getElementsByTagName("td")[0].innerText;
   //for select rows to delete
   if (event.target.parentNode.style.backgroundColor=="red"){ //unselect row
       event.target.parentNode.setAttribute("style","background-color:transparent")
       api.ids_selected_project.pop(project_id)
   }else{//select row
       event.target.parentNode.setAttribute("style","background-color:red")
       api.ids_selected_project.push(project_id)
   }
   if (api.ids_selected_project.length){
      p_delete_button.style.display = "inline-block"
   }else{
     p_delete_button.style.display = "none"
   }

   console.log(api.ids_selected_project)
}

//mark events
function transaction_mark_event(event){
  var transaction_id = event.target.parentNode.getElementsByTagName("td")[0].innerText;
   //for select rows to delete
   if (event.target.parentNode.style.backgroundColor=="red"){ //unselect row
       event.target.parentNode.setAttribute("style","background-color:transparent")
       api.ids_selected_transaction.pop(transaction_id)
   }else{//select row
       event.target.parentNode.setAttribute("style","background-color:red")
       api.ids_selected_transaction.push(transaction_id)
   }
   if (api.ids_selected_transaction.length){
     t_delete_button.style.display = "inline-block"
   }else{
     t_delete_button.style.display = "none"
   }
   console.log(api.ids_selected_transaction)
}

p_update_button.addEventListener('click' , function(event){
  //general
  p_delete_button.style.display = "none"
  api.ids_selected_project =[]
  p_update_button.style.boxShadow = " 0px 0px 15px red"
  p_mark_button.style.boxShadow = "none"
  // ****
  var tr = project_table.getElementsByTagName("tr")
  for (var i=0;i<tr.length;i++){
    if ( i>0 ) {
      tr[i].removeEventListener('click', project_mark_event )
      tr[i].addEventListener('click' , event_1)
      tr[i].setAttribute("style","backgroundColor:transparent") //##wrong CSS make it work i dont know why!
    }
  }
})

p_mark_button.addEventListener('click' , function(event){
  //general
  update_project.setAttribute("hidden","")
  transaction_block.setAttribute("hidden","")
  p_mark_button.style.boxShadow = " 0px 0px 15px red"
  p_update_button.style.boxShadow = "none"
  //******
  var tr = project_table.getElementsByTagName("tr")
  for (var i=0;i<tr.length;i++){
    if ( i>0 ) {
      tr[i].removeEventListener('click' , event_1)
      tr[i].addEventListener('click', project_mark_event )
    }
  }
})

//transaction_block evet
t_update_button.addEventListener('click', function() {
  t_update_button.style.boxShadow = " 0px 0px 15px red"
  t_mark_button.style.boxShadow = " none"
  t_delete_button.setAttribute("style","display:none")
  //******
  var tr = transaction_table.getElementsByTagName("tr")
  for (var i=0;i<tr.length;i++){
    tr[i].removeEventListener('click' , transaction_mark_event)
    tr[i].addEventListener('click',event_2)
    tr[i].setAttribute("style","backgroundColor:transparent")
  }
})

t_mark_button.addEventListener('click',function (){
  t_mark_button.style.boxShadow = " 0px 0px 15px red"
  t_update_button.style.boxShadow = " none"
  update_transaction.setAttribute("hidden","")
  //******
  var tr = transaction_table.getElementsByTagName("tr")
  for (var i=0;i<tr.length;i++){
    if (i>0){
      tr[i].removeEventListener('click' , event_2)
      tr[i].addEventListener('click',transaction_mark_event)
    }
  }
})

/*TESTING */
function disable_required(){
  uc_id_value.removeAttribute("required")
  uc_name_value.removeAttribute("required")
  uc_phone_value.removeAttribute("required")
  up_id_value.removeAttribute("required")
  up_deal_date_value.removeAttribute("required")
  up_price_value.removeAttribute("required")
  ut_id.removeAttribute("required")
  ut_transaction_date.removeAttribute("required")
  ut_paied.removeAttribute("required")
}

// add new projects submit
new_project_button.addEventListener('click',function (){
  //disable all require fields
  disable_required()
  api.case="add_new_projects"
  other_api.value=JSON.stringify(api)
})

//add new trabsactions submit
ut_new_transaction_button.addEventListener('click',function(){
  //disable all require fields
  disable_required()
  api.case="add_new_transactions"
  other_api.value=JSON.stringify(api)
})
