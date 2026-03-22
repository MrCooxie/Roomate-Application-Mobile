from pyairtable import Api

class AirtableService:
    def __init__(self, token, base_id):
        self.api = Api(token)
        self.base_id = base_id

    def get_table_records(self, table_name):
        """Fetch all records from a specific table."""
        try:
            table = self.api.table(self.base_id, table_name)
            return table.all()
        except Exception as e:
            # In a real app, you'd use a logger here
            print(f"Error fetching Airtable records: {e}")
            return None

    def get_users(self):
        return self.get_table_records("Users")

    def get_housing(self):
        return self.get_table_records("Housing")
