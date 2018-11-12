import json
from sqlite3 import connect


class DbManager:
    def __init__(self, db_file):
        self.db_file = db_file

    class _DbManagerExecutor:
        def __init__(self, db_file):
            self._connection = connect(db_file)
            self._cursor = self._connection.cursor()
            self.create_function = self._connection.create_function

        def execute(self, *args):
            e = self._cursor.execute(*args)
            self._connection.commit()
            return e

        def executemany(self, *args):
            e = self._cursor.executemany(*args)
            self._connection.commit()
            return e

        def __del__(self):
            self._connection.close()

    def _get_executor(self):
        return self._DbManagerExecutor(self.db_file)

    def create_clear(self):
        e = self._get_executor()

        e.execute("DROP  TABLE IF EXISTS rates")
        e.execute("CREATE TABLE rates (date TEXT, data JSON)")

    def insert_data(self, data):
        e = self._get_executor()
        e.executemany("INSERT INTO rates VALUES (?, ?)", data)

    def get_data(self, base, target, date_from, date_to):
        e = self._get_executor()
        e.create_function("json_select", 3, self._json_select)

        res = []

        sql = "SELECT date, json_select(data, ?, ?) FROM rates WHERE date BETWEEN ? AND ?"
        for row in e.execute(sql, (base, target, date_from, date_to)):
            try:
                date = row[0]
                curs = json.loads(row[1])
                bc = curs[0]
                tc = curs[1]
            except Exception:
                continue
            res.append({
                "date": date,
                "base": bc,
                "target": tc
            })

        return res

    @staticmethod
    def _json_select(json_data, *keys):
        if json_data is None:
            return None

        res = []
        for key in keys:
            res.append(json.loads(json_data).get(key))
        return json.dumps(res)
