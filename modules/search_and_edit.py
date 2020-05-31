from modules.database import db

class search :
    'class for all actions in search_customer page'
    def __init__(self,request_form):
        "initialization"
        self.request_form = request_form

    def read_form(self):
        'return dictionary of all form data'
        fields = ["query","search_by","pattern","sort","order"]
        data = {}
        for i in fields :
            data[i]=self.request_form(i).strip()
        return data

    def criteria (self):
        'return dic {data : tuple of all criteria and query itself , pattern: pattern selected} '
        form = self.read_form()
        data = []
        pattern=""
        #search_by cases
        data.append(form["query"])

        if form["search_by"] == "1":
            data.append("id")
        elif form["search_by"] == "2":
            data.append("name")
        elif form["search_by"] == "3":
            data.append("phone")
        elif form["search_by"] == "4":
            data.append("address")
        elif form["search_by"] == "5":
            data.append("details")
        #pattern cases
        if form["pattern"] == "1":
            pattern="contain"
        elif form["pattern"] == "2":
            pattern = "start_with"
        elif form["pattern"] == "3":
            pattern="end_with"
        #sort cases
        if form["sort"] == "1":
            data.append("id")
        elif form["sort"] == "2":
            data.append("name")
        elif form["sort"] == "3":
            data.append("phone")
        elif form["sort"] == "4":
            data.append("address")
        elif form["sort"] == "4":
            data.append("details")
        #order case
        if form["order"] == "asc":
            data.append("asc")
        elif form["order"] == "desc":
            data.append("desc")
        return {"data":data, "pattern": pattern}

    def search (self):
        'do every thing for searching , return list of results or false'
        res={} #all data result will return from this dict
        read_data = self.criteria()
        #read_data for query ["data"] [0] = query [1]="search_by" [2]="sort" [3]="order"
        data = {\
        "query":read_data["data"][0] ,\
        "search_by":read_data["data"][1],\
        "sort":read_data["data"][2],\
        "order":read_data["data"][3],\
        }
        print(data)

        if read_data["data"][0] :#to prevent result in empty entry
            #search depend on pattern
            if read_data["pattern"] == "contain":

                res["count"] = db("databases/main.db").query_statment("""
                SELECT count(*) FROM customers WHERE {} LIKE ? ORDER BY {} {}
                """.format(data["search_by"],data["sort"], data["order"]) , (f'%{data["query"]}%',)  , True )[0][0]

                res["query"] = db("databases/main.db").query_statment("""
                SELECT * FROM customers WHERE {} LIKE ? ORDER BY {} {}
                """.format(data["search_by"],data["sort"], data["order"]) , (f'%{data["query"]}%',)  , True )
                return res

            elif read_data["pattern"] == "start_with":
                res["count"] = db("databases/main.db").query_statment("""
                SELECT count(*) FROM customers WHERE {} LIKE ? ORDER BY {} {}
                """.format(data["search_by"],data["sort"], data["order"]) , (f'{data["query"]}%',)  , True )[0][0]

                res["query"] = db("databases/main.db").query_statment("""
                SELECT * FROM customers WHERE {} LIKE ? ORDER BY {} {}
                """.format(data["search_by"],data["sort"], data["order"]) , (f'{data["query"]}%',)  , True )
                return res

            elif read_data["pattern"] == "end_with":
                res["count"] = db("databases/main.db").query_statment("""
                SELECT count(*) FROM customers WHERE {} LIKE ? ORDER BY {} {}
                """.format(data["search_by"],data["sort"], data["order"]) , (f'%{data["query"]}',)  , True )[0][0]


                res["query"] = db("databases/main.db").query_statment("""
                SELECT * FROM customers WHERE {} LIKE ? ORDER BY {} {}
                """.format(data["search_by"],data["sort"], data["order"]) , (f'%{data["query"]}',)  , True )
                return res
        else :
            res["count"]=""
            res["query"]=""
            return res

########## SEARCH AJAX
class search_ajax :
    def __init__(self,get_json) :
        self.get_json = get_json

    def read_projects(self):
        res={"project":"" , "transaction":"" , "remaining":""}
        api = self.get_json()
        data =  db("databases/main.db").query_statment("""
        SELECT id ,deal_date , paied  , deal_end , description, status , details  FROM projects Where customer_id = ?
        """ ,(api["id_selected"],), fetch=True)
        if not data :
            html="""
            <tr id="project_table" class="table_head">
                <td>رقم المشروع</td>
                <td>تاريخ الاتفاق</td>
                <td>المبلغ المتفق علية</td>
                <td>تاريخ التسليم</td>
                <td>وصف المشروع</td>
                <td>حالة المشروع</td>
                <td>تفاصيل اخرى</td>
            </tr><tr>
            """
        else :
            html="""
            <tr class="table_head">
                <td>رقم المشروع</td>
                <td>تاريخ الاتفاق</td>
                <td>المبلغ المتفق علية</td>
                <td>تاريخ التسليم</td>
                <td>وصف المشروع</td>
                <td>حالة المشروع</td>
                <td>تفاصيل اخرى</td>
            </tr>"""
            for row in data :
                html+="<tr>"
                for cell in row :
                    html+= "<td>"+str(cell)+ "</td>"
                html+= "</tr>"
        res["project"] = html
        res["transaction"]=""

        try: #query all transaction for specific project id
            #calculate remaining
            deal =  db("databases/main.db").query_statment("""
            SELECT paied FROM  projects WHERE id = ?
            """ ,(api["project_id"],), fetch=True)[0][0]

            try :
                paied =  db("databases/main.db").query_statment("""
                SELECT sum(paied) FROM transactions where project_id = ?
                """ ,(api["project_id"],), fetch=True)[0][0]

                res["remaining"]= int(deal)-int(paied)
            except Exception as e :
                print (e)

            data =  db("databases/main.db").query_statment("""
            SELECT id , transaction_date , paied , details FROM transactions where project_id = ?
            """ ,(api["project_id"],), fetch=True)

            if not data :
                html="""
                <tr id="project_table" class="table_head">
                    <td>رقم المعاملة</td>
                    <td>تاريخ المعاملة</td>
                    <td>المبلغ المدفوع</td>
                    <td>ملاحظات</td>
                </tr>
                """
            else :
                html= """
                <tr id="project_table" class="table_head">
                    <td>رقم المعاملة</td>
                    <td>تاريخ المعاملة</td>
                    <td>المبلغ المدفوع</td>
                    <td>ملاحظات</td>
                </tr>"""
                for row in data :
                    html+="<tr>"
                    for cell in row :
                        html+= "<td>"+str(cell)+ "</td>"
                    html+= "</tr>"

            res["transaction"] =html
        except Exception as e :
            print (e)
        return res

    def read_transactions (self):
        return "res"
