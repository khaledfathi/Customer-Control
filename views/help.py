from flask import Blueprint , render_template

help_ = Blueprint("help" , __name__)

@help_.route("/help")
def help () :
    return render_template("help/help.html")
