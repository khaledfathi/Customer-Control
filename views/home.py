from flask import Blueprint , render_template


home_=Blueprint('home', __name__  )


@home_.route("/")
def home():
    return render_template("home/home.html")
