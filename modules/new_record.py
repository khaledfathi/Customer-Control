from modules.database import db
import json

class record :
    'class for all actions in new_customer page'
    def __init__ (self,request_form):
        'initialization'
        self.request_form=request_form
        pass

    def read_form (self):
        'read date from form | return dictionary has [all form fields data]'
        form_list=[
        "ac_name",
        "ac_phone",
        "ac_address",
        "ac_details",
        "ap_name",
        "ap_deal_date",
        "ap_price",
        "ap_end_date",
        "ap_description",
        "ap_status",
        "ap_details",
        "at_trans_date",
        "at_paied",
        "at_notes",
        "other_api"]
        form_dict={}
        for i in form_list :
            form_dict[i]=self.request_form(i)
        #replace ap_status number to its text value [html 'selecte element']
        if form_dict["ap_status"] =="1" : form_dict["ap_status"]="قيد التنفيذ"
        elif form_dict["ap_status"]=="2" : form_dict["ap_status"]="انتهى ولم يتم التسليم"
        elif form_dict["ap_status"]=="3" : form_dict["ap_status"]="تم التسليم"
        elif form_dict["ap_status"]=="4" : form_dict["ap_status"]="تم الالغاء"

        return form_dict

    def check_duplicate(self):
        'check duplicated phone number in table ,return "boolean and phone value"'
        res={"status":False ,"phone":False}
        data = self.read_form()
        database = db("databases/main.db")
        check_phone = (data["ac_phone"],)
        if database.query_statment("SELECT * FROM customers WHERE phone = ?", check_phone , True) :
            res["phone"]=data["ac_phone"]
            res["status"]=True
        return res

    def add_record(self):
        "main function [add record to database] return boolean and message for flashed"
        res={"status":False , "msg":""}
        msg=""
        duplicated = self.check_duplicate()
        if duplicated["status"]:
            res["msg"]=" رقم التليفون مسجل مسبقاً | "+ duplicated["phone"]
            res["status"]=True
        else :#do record
            api = json.loads(self.read_form()['other_api'])
            print (api)
            def add_customer():
                'take data from customer form block and put it into database'
                data_for_customer = self.read_form()
                data = (data_for_customer["ac_name"].strip(),\
                data_for_customer["ac_phone"].strip(),\
                data_for_customer["ac_address"].strip(),\
                 data_for_customer["ac_details"].strip())
                db("databases/main.db").query_statment("""INSERT INTO customers
                (name , phone ,address , details) VALUES (? , ? , ? , ?)""",
                data )
            def add_customer_project ():
                'take data from customer and project form blocks and put it into database'
                add_customer()
                id = db("databases/main.db").query_statment("SELECT id FROM customers WHERE phone = ?" ,(self.read_form()["ac_phone"],) , True)[0][0]
                data_for_project = self.read_form()
                data = (id,\
                data_for_project["ap_description"].strip(),\
                data_for_project["ap_price"].strip(),\
                data_for_project["ap_deal_date"].strip(),\
                data_for_project["ap_end_date"].strip(),\
                data_for_project["ap_status"].strip(),\
                data_for_project["ap_details"].strip())
                db("databases/main.db").query_statment("""INSERT INTO projects
                (customer_id , description , paied , deal_date, deal_end , status ,details)
                VALUES (?,?,?,?,?,?,?)""" , data )
            def add_customer_project_transaction ():
                'take data from customer , project and transaction form blocks and put it into database'
                add_customer_project()
                customer_id = db("databases/main.db").query_statment("SELECT id FROM customers WHERE phone = ?" ,(self.read_form()["ac_phone"],) , True)[0][0]
                project_id = db("databases/main.db").query_statment("SELECT id FROM projects WHERE customer_id = ?" , (customer_id,) , True)[0][0]
                print(project_id)
                data_for_transaction = self.read_form()
                data = (project_id,\
                data_for_transaction["at_trans_date"],\
                data_for_transaction["at_paied"],\
                data_for_transaction["at_notes"])
                db("databases/main.db").query_statment("""INSERT INTO transactions
                (project_id , transaction_date ,paied ,details)
                VALUES (?,?,?,?)""" , data )
            #record only customer block
            if not api["case"]["add_project"] and  not api["case"]["add_project"]:
                add_customer()
                res["msg"]="تم الحفظ بنجاح"
            #record with project blocks
            elif api["case"]["add_project"] and not api["case"]["add_transaction"]:
                add_customer_project()
                res["msg"]="تم الحفظ بنجاح"
            #record only transaction block
            elif api["case"]["add_project"] and api["case"]["add_transaction"]:
                add_customer_project_transaction ()
                print ("transaction")
                res["msg"]="تم الحفظ بنجاح"
        return res
    
