import json
from datetime import timedelta, date

import requests


class Importer:
    def __init__(self, url_template, access_key, date_from, date_to, db_manager):
        self._url_template = url_template
        self._access_key = access_key
        self._date_range = self._create_date_range(date_from, date_to)
        self._db_insert_data = db_manager.insert_data

    def import_data(self):
        print("Loading data for import... (This could take few minutes)")
        data = self._get_db_import_data_all()
        print("Inserting data to database...")
        self._db_insert_data(data)
        print("Data imported")

    def _get_db_import_data_all(self):
        res = []
        for d in self._date_range:
            res.append(self._get_db_import_data_one_day(d))
        return res

    # Free fixer.io API allows request data from only one day at the time
    def _get_db_import_data_one_day(self, iso_date):
        url = self._url_template.format(iso_date, self._access_key)
        r_data = requests.get(url).content
        data = json.loads(r_data)
        res = (iso_date, json.dumps(data.get("rates")))
        return res

    @staticmethod
    def _create_date_range(date_from, date_to):
        date_from = date.fromisoformat(date_from)
        date_to = date.fromisoformat(date_to)
        delta = date_to - date_from
        for i in range(delta.days + 1):
            res = date_from + timedelta(i)
            yield date.isoformat(res)
