from flask import Blueprint , render_template , request , jsonify , redirect , url_for
from modules.search_and_edit import search , search_ajax
import json

search_customer_ = Blueprint("search_customer" , __name__)


@search_customer_.route("/search_customer" , methods=["GET","POST"])
def search_customer():
    if request.method=="POST":
        try: #for ajax requests
            api = request.get_json()
            if api["case"]=="query_projects":
                return search_ajax(request.get_json).read_projects()
        except Exception as e: # for form requests
            print (e)
            try:
                api=json.loads(request.form.get("other_api"))
                print (api)
                if api["case"]== "add_new_projects":
                    return redirect(url_for("search_customer.add_new_projects"))
                elif api["case"] == "add_new_transactions":
                    return redirect(url_for("search_customer.add_new_transactions"))
            except Exception as e :
                print (e)
                res = search(request.form.get).search()
                return render_template("search_customer/search_customer.html" ,res=res["query"] , count=res["count"] )
    return render_template("/search_customer/search_customer.html")

@search_customer_.route("/search_customer/add_new_projects")
def add_new_projects():
    return render_template("/add_new_projects/add_new_projects.html")

@search_customer_.route("/search_customer/add_new_transactions")
def add_new_transactions():
    return render_template("/add_new_transactions/add_new_transactions.html")
