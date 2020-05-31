import sqlite3

class db :
    'database object'
    def __init__(self , file_name):
        "initialization"
        self.file_name=file_name

    def create_control_db(self):
        'create control database file for table [password , history]'
        with sqlite3.connect(self.file_name) as conn :
            cur = conn.cursor()
            cur.execute("PRAGMA foreign_keys = ON")
            cur.execute("""
            CREATE TABLE IF NOT EXISTS password (
            name VARCHAR(30) PRIMARY KEY,
            password VARCHAR(20)
            )
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            action VARCHAR(30) ,
            date_time VARCHAR(30)
            )
            """)
            if not cur.execute("SELECT * FROM password WHERE name ='admin'").fetchall() :
                cur.execute("INSERT INTO password VALUES ('admin','admin')")
            conn.commit()

    def create_main_db(self):
        'create main database file for table [customers , projects , transactions]'
        with sqlite3.connect(self.file_name) as conn :
            cur = conn.cursor()
            cur.execute("PRAGMA foreign_keys = ON")
            cur.execute("""
            CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100),
            phone VARCHAR(20),
            address VARCHAR(255),
            details TEXT
            )
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            deal_date DATE,
            paied INTEGER,
            deal_end DATE,
            description TEXT,
            status VARCHAR(20),
            details TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
            )
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY,
            project_id INTEGER  NOT NULL,
            transaction_date DATE,
            paied INTEGER ,
            details VARCHAR(1000),
            FOREIGN KEY (project_id) REFERENCES projects(id)
            )
            """)
            conn.commit()


    def query_statment (self,statment,data=False,fetch=False):
        'do sql statment [statment=str , data=function , fetch=bool]'
        with sqlite3.connect(self.file_name) as conn :
            cur = conn.cursor()
            if data:
                cur.execute(statment,data)
            else :
                cur.execute(statment)
            if fetch :
                return cur.fetchall()
            return

    def query_all(self,statment):
        with sqlite3.connect(self.file_name) as conn :
            cur = conn.cursor()
            cur.execute(statment)
            return cur.fetchall()
