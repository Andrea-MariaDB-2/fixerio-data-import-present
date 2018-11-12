from backend.config import Config
from backend.db_manager import DbManager
from backend.importer import Importer
from backend.server import Server

db_man = DbManager(Config.DB_NAME)

if Config.START_CREATE_CLEAR_DB:
    db_man.create_clear()

if Config.START_IMPORT_DATA:
    im = Importer(Config.IMPORT_URL_TEMPLATE, Config.IMPORT_ACCESS_KEY,
                  Config.IMPORT_DATE_FROM, Config.IMPORT_DATE_TO, db_man)
    im.import_data()

if Config.START_RUN_SERVER:
    Server(Config.SERVER_IP, Config.SERVER_PORT, db_man).run()
