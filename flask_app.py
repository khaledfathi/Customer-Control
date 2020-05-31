#start date :17/05/2020
#predict end : +1 month
#app : web database app
#ver 0.1 alpha
#author : khaledfathi@protonmail.com
#code : python 3.8 / flask
#github repository : !!

#days = ? / work days
#end time = ?? , avg/day = 4 min/max = 2/10

from flask import Flask
import os

#decoment next line in pythonanywhere | change mysite to flask directory name.
#os.chdir(os.getcwd()+"/mysite")

from modules.database import db
from views.home import home_
from views.about import about_
from views.new_customer import new_customer_
from views.setting import setting_
from views.search_customer import search_customer_
from views.search_project import search_project_
from views.help import help_

app = Flask(__name__ )
app.config.from_object ("config.development")

#check or creating database
db("databases/main.db").create_main_db()
db("databases/control.db").create_control_db()

app.register_blueprint(home_ )
app.register_blueprint(about_)
app.register_blueprint(new_customer_)
app.register_blueprint(setting_)
app.register_blueprint(search_customer_)
app.register_blueprint(search_project_)
app.register_blueprint(help_)


if __name__=="__main__" :
    app.run()
