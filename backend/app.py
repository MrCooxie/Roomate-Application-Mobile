from app import create_app

app = create_app('dev')
with app.app_context():
    print(app.airtable.get_user("recv2VWadElVEHuFI", user="recIUKSm6s6FdCawO"))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
