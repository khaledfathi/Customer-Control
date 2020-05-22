from flask import  Blueprint , render_template , request

search_project_ = Blueprint("search_project" , __name__)


@search_project_.route("/search_project" , methods=["GET","POST"])
def search_project():
    if request.method=="POST" :
        return render_template("search_project/search_project.html" , res=1)
    return render_template("search_project/search_project.html" )
