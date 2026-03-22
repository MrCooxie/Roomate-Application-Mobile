class AuthService:
    def __init__(self, airtable_service):
        self.airtable_service = airtable_service

    def authenticate_user(self, username, password):
        """
        Verify credentials against Airtable records.
        Returns the user record if valid, otherwise None.
        """
        users = self.airtable_service.get_users()
        
        if not users:
            return None

        # Look for a user matching the username and password
        # Note: In a real app, passwords should be hashed!
        for user in users:
            fields = user.get('fields', {})
            if fields.get('Username') == username and fields.get('Password') == password:
                return {
                    "id": user.get('id'),
                    "username": fields.get('Username'),
                    "email": fields.get('Email')
                }
        
        return None
