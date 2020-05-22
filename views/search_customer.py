from flask import Blueprint , render_template , request


search_customer_ = Blueprint("search_customer" , __name__)


@search_customer_.route("/search_customer" , methods=["GET","POST"])
def search_customer():
    if request.method=="POST":
        return render_template("search_customer/search_customer.html" , res=1)
    return render_template("search_customer/search_customer.html")
