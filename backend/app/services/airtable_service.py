from pyairtable import Api
import random

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
        userInterests = []
        newInterests = []
        for interest in data.pop("interests"):
            interest = interest.lower()
            inInterests = False
            for record in self.get_table_records("Interests"):
                if interest in record["fields"]["label"]:
                    userInterests.append(record["id"])
                    inInterests = True
                    break
            if not inInterests:
                new_record = self.create_table_records("Interests", {"label": interest})
                userInterests.append(new_record["id"])
                newInterests.append(new_record["id"])
        data["userInterests"] = userInterests
        new_user = self.create_table_records("Users", data)
        for id in newInterests:
            self.update_interest_record({"Users": new_user["id"]}, id)
        return new_user

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

    def get_interest(self, id):
        record = self.get_table_records("Interests", id)
        record["fields"]["id"] = id
        return record["fields"]

    def get_user(self, id, user=None):
        from .compatibility import Algoritm
        info = self.get_table_records("Users", id)
        fields = info["fields"]

        fields["name"] = str(fields["firstName"])+" "+str(fields["lastName"])
        fields["university"] = fields.pop("school")
        fields["image"] = fields.pop("profile picture")
        fields["interests"] = []
        for id in fields["userInterests"]:
            fields["interests"].append(self.get_interest(id).pop("Users"))

        # siin peaks võrdlema kasutava kasutajaga *algoritm*
        if user:
            userinfo = self.get_table_records("Users", user)
            userint = userinfo["fields"]["userInterests"]
            fields["compatibility"] = Algoritm(self, userint, fields["userInterests"])
        else:
            fields["compatibility"] = 0

        #fields["compatibility"] = random.randint(0,100) #if have actual *algoritm* remove this

        info["fields"] = fields
        return info

    def get_owner(self, id):
        return self.get_table_records("Owners", id)

    def get_room(self, id):
        info = self.get_table_records("Housing", id)
        fields = info["fields"]
        fields["priceLabel"] = str(fields["priceValue"])+" / per month"
        fields["OwnerName"] = self.get_owner(fields["Owners"][0])["fields"]["Name"]
        fields["ownerAvatar"] = self.get_owner(fields["Owners"][0])["fields"]["Profile Picture (from Owners)"]

        info["fields"] = fields
        return info

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

    def update_interest_record(self, updates, record_id, replace=False, typecast=True):
        return self.update_table_records("Interests", updates, record_id, replace, typecast)

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
