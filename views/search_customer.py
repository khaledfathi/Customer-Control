from flask import Blueprint , render_template , request
from modules.search_and_edit import search

search_customer_ = Blueprint("search_customer" , __name__)


@search_customer_.route("/search_customer" , methods=["GET","POST"])
def search_customer():
    if request.method=="POST":
        res = search(request.form.get).search()
        return render_template("search_customer/search_customer.html" ,res=res["query"] , count=res["count"] )
    return render_template("search_customer/search_customer.html")
