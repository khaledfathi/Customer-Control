from flask import  Blueprint , render_template

about_ = Blueprint('about' , __name__ )

@about_.route("/about")
def home ():
    return render_template("about/about.html")
