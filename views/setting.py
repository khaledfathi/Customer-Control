from flask import Blueprint , render_template , request , redirect , url_for, session

setting_ = Blueprint('setting' , __name__)

@setting_.route("/setting" ,methods=["GET" , "POST"])
def setting ():
    if "admin" in session :
        if session["admin"] == 1:
            return redirect(url_for("setting.admin"))
    if request.method == "POST":
        if request.form.get("pw") == "admin":
            session["admin"]=1
            return redirect(url_for("setting.admin"))
        else:
            return render_template("setting/setting.html" , error=1)
    return render_template("setting/setting.html")

@setting_.route("/setting/admin")
def admin ():
    if "admin" in session:
        if session["admin"] == 1 :
            return render_template("admin/admin.html")
    return "<h2>انتهت الجلسة - ليس لديك صلاحية لدخول هذه الصفحة</h2>"
