class AuthService:
    def __init__(self, airtable_service):
        self.airtable_service = airtable_service

    def authenticate_user(self, email, password):
        """
        Verify credentials against Airtable records.
        Returns the user record if valid, otherwise None.
        """
        users = self.airtable_service.get_users()

        if not users:
            return None

        for user in users:
            fields = user.get('fields', {})
            if fields.get('email') == email and fields.get('password') == password:
                return {
                    "airtable_id": user.get('id'),
                    "user_id": fields.get('id'),
                    "email": fields.get('email'),
                    "firstName": fields.get('firstName', ''),
                    "lastName": fields.get('lastName', ''),
                }

        return None
