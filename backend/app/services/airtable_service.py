from pyairtable import Api

class AirtableService:
    def __init__(self, token, base_id):
        self.api = Api(token)
        self.base_id = base_id

    #CREATING
    def create_table_records(self, table_name, data):
        try:
            table = self.api.table(self.base_id, table_name)
            return table.create(data)
        except Exception as e:
            print(f"Error creating Airtable records: {e}")
            return None

    def create_user_records(self, data):
        return self.create_table_records("Users", data)

    def create_room_records(self, data):
        return self.create_table_records("Housing", data)

    # READING
    def get_table_records(self, table_name, id=None):
        """Fetch all records from a specific table."""
        try:
            table = self.api.table(self.base_id, table_name)
            if id:
                return table.get(id)
            else:
                return table.all()
        except Exception as e:
            # In a real app, you'd use a logger here
            print(f"Error fetching Airtable records: {e}")
            return None

    def get_user(self, id):
        return self.get_table_records("Users", id)

    def get_room(self, id):
        return self.get_table_records("Housing", id)

    def get_users(self):
        return self.get_table_records("Users")

    def get_housing(self):
        return self.get_table_records("Housing")

    #UPDATING

    ''' 
    "record_id" is the record’s id we want to update (we get it from Airtable).
    "updates" what we want to do provided as a dictionary.
    "replace" by default is False. If True the record is replaced in its entirety by provided fields; if a field is not included its value will bet set to null.
    "typecast" is the one we used before to let Airtable convert our text field into a proper table field – we will use it with True.
    
    copypasted instructions from codesters club course C0303 from 1# graded assignment
    '''

    def update_table_records(self, table_name, updates, record_id, replace, typecast):
        try:
            table = self.api.table(self.base_id, table_name)
            return table.update(record_id, updates, replace, typecast)
        except Exception as e:
            print(f"Error updating Airtable records: {e}")
            return None

    def update_user_record(self, updates, record_id, replace=False, typecast=True):
        return self.update_table_records("Users", updates, record_id, replace, typecast)

    def update_room_record(self, updates, record_id, replace=False, typecast=True):
        return self.update_table_records("Housing", updates, record_id, replace, typecast)

    #DELETING
    def delete_table_records(self, table_name, id):
        try:
            table = self.api.table(self.base_id, table_name)
            return table.delete(id)
        except Exception as e:
            print(f"Error deleting Airtable records: {e}")
            return None

    def delete_user_record(self, id):
        return self.delete_table_records("Users", id)

    def delete_room_record(self, id):
        return self.delete_table_records("Housing", id)
