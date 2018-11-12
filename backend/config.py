class Config:
    START_CREATE_CLEAR_DB = False
    START_IMPORT_DATA = False
    START_RUN_SERVER = True

    IMPORT_URL_TEMPLATE = "http://data.fixer.io/api/{0}?access_key={1}"
    IMPORT_ACCESS_KEY = ""
    IMPORT_DATE_FROM = "2017-01-01"
    IMPORT_DATE_TO = "2017-12-31"

    DB_NAME = "backend/exchange.db"

    SERVER_IP = "127.0.0.1"
    SERVER_PORT = 8081
