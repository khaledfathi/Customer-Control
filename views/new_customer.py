from flask import Blueprint , render_template , request , redirect , url_for , flash
import modules.new_record as record

new_customer_ = Blueprint("new_customer" , __name__)

@new_customer_.route("/new_customer",methods=["GET","POST"])
def new_customer ():
    if request.method =="POST" :
        data = record.record(request.form.get).add_record()
        flash(data["msg"])
        return redirect(url_for("new_customer.new_customer"))

        #return redirect(url_for("new_customer.new_customer"))
    return render_template("new_customer/new_customer.html" )
