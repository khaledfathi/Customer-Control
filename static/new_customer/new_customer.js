//HTML ELEMENTS
  //add customer field
var ac_name = document.getElementById("ac_name"),
    ac_phone = document.getElementById("ac_phone"),
    ac_address = document.getElementById("ac_address"),
    ac_details = document.getElementById("ac_details"),
    ac_new_project = document.getElementById("ac_new_project"),
    //add project field
    ap_name = document.getElementById("ap_name"),
    ap_deal_date = document.getElementById("ap_deal_date"),
    ap_price = document.getElementById("ap_price"),
    ap_end_date = document.getElementById("ap_end_date"),
    ap_description = document.getElementById("ap_description"),
    ap_status = document.getElementById("ap_status"),
    ap_details = document.getElementById("ap_details"),
    ap_new_transaction = document.getElementById("ap_new_transaction"),
    //add transaction field
    at_trans_date = document.getElementById("at_trans_date"),
    at_paied = document.getElementById("at_paied"),
    at_remaining = document.getElementById("at_remaining"),
    at_notes = document.getElementById("at_notes"),
    //divs
    add_project = document.getElementById("add_project"),
    add_transaction  = document.getElementById("add_transaction"),
    //buttons
    save_button = document.getElementById("save_button");
    //core
    api = {
      case:{
        add_project:0,
        add_transaction:0
      }
    };

//control attribute [required] for blocks [add project , add transaction] , and clear field
function field_control(required , block){
  if (required==1 && block=="project"){
    ap_name.setAttribute("required","")
    ap_deal_date.setAttribute("required","")
    ap_price.setAttribute("required","")
  }else if (required==0 && block=="project"){
    ap_name.removeAttribute("required")
    ap_deal_date.removeAttribute("required")
    ap_price.removeAttribute("required")
    at_trans_date.removeAttribute("required")
    at_paied.removeAttribute("required")
  }
  if (required==1 && block=="transaction"){
    at_trans_date.setAttribute("required", "")
    at_paied.setAttribute("required", "")
  }else if (required==0 && block=="transaction"){
    at_trans_date.removeAttribute("required")
    at_paied.removeAttribute("required")
  }
}

// use it to clear fields in specific event
function clear_project_field(){
  ap_deal_date.value=""
  ap_price.value=""
  ap_end_date.value=""
  ap_description.value=""
  ap_status.options.selectedIndex=0
  ap_details.value = ""
}
// use it to clear fields in specific event
function clear_transaction_field(){
  at_trans_date.value = ""
  at_paied.value = ""
  at_remaining.value = ""
  at_notes.value = ""
}

//hide or dehide add_project block
ac_new_project.addEventListener('change' ,function (event) {
  if (ac_new_project.checked ){
    api.case.add_project=1
    field_control(1,"project")
    add_project.removeAttribute("hidden","");
    api.case.add_project=1
    console.log(api)
  }
  else {
    api.case.add_project=0
    api.case.add_transaction=0
    field_control(0,"project")
    add_project.setAttribute("hidden","");
    add_transaction.setAttribute("hidden","");
    ap_new_transaction.checked=false
    clear_project_field()
    clear_transaction_field()
    console.log(api)
  }
})
//hide or dehide transactions  block
ap_new_transaction.addEventListener('change' ,function (event) {
  if (ap_new_transaction.checked ){
    api.case.add_transaction=1
    field_control(1,"transaction")
    add_transaction.removeAttribute("hidden","");
    at_remaining.value = ap_price.value
    api.case.add_transaction=1
    console.log(api)
  }
  else {
    api.case.add_transaction=0
    field_control(0,"transaction")
    add_transaction.setAttribute("hidden","");
    clear_transaction_field()
    console.log(api)
  }
})

//connection between fields
ac_name.addEventListener('input',function(event){
  ap_name.value = ac_name.value
})
ap_price.addEventListener('input',function(event){
  at_remaining.value = (ap_price.value)-Number(at_paied.value)
})
at_paied.addEventListener('input',function(event){
  at_remaining.value = (ap_price.value)-Number(at_paied.value)
})

//submit form
save_button.addEventListener('click',function(event){
  other_api.value = JSON.stringify(api)
})


//auto load
var flash = document.getElementById("flash");
window.onload = function (){
  x = setTimeout(function (){
    flash.setAttribute("hidden","")
    clearTimeout(x)
  },5000)
}
