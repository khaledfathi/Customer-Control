console.log("search_project.js work")
// FOR TESTING ONLY [IT WILL REMOVE]
var tr =  document.getElementsByTagName("table");

for (var i=0;i<tr.length;i++){
  tr[i].addEventListener('click' ,function (event){


    if (event.target.parentNode.getAttribute("mark")== "1"){
      event.target.parentNode.style.backgroundColor="white"
      event.target.parentNode.setAttribute("mark","0")
    }else{
      event.target.parentNode.style.backgroundColor="red"
      event.target.parentNode.setAttribute("mark","1")
    }

  })
}
