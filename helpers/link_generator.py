import random
import string
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
load_dotenv()
import datetime
import urllib.parse
from flask import Flask, request, jsonify,app

# Generate a random verification code for the user
def generate_verification_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=15))
    return code

# Generate a unique verification link for the user
def generate_verification_link(user_id):
    code = generate_verification_code()

    #Fetching the Expiration Time from Environment Variables
    expiration_period = int(os.environ.get('GMAIL_VERIFICATION_EXPIRATION'))
    
    now = datetime.datetime.now()
    # expiration_time
    expiratiration_time = int(now.timestamp() + expiration_period)
    print(expiratiration_time)

    params = urllib.parse.urlencode({"id": user_id, "code": code, "expiration_time": expiratiration_time })
    base_url = "https://placementportalpdeu.com/verify"
    verification_link = f"{base_url}?{params}"

    return verification_link

#Defining the App Route for Genrating the Verification Link
@app.route('http://localhost:3000/api/v1/users/${user_id}/verify-email/generate_link', methods = ['POST'])
def generate_link():
    data = request.get_json()
    user_id = data.get("user_id")

    if user_id:
        link = generate_verification_link(user_id)
        return jsonify({"link": link})
    else:
        return jsonify({"error": "user_id not provided"}), 400

if __name__ == "__main__":
    app.run()


print(generate_verification_link(3453453453))


# # Replace "example.com" with your own domain name
# base_url = "https://www.pdeuplacementportal.com/verify_email"

# # Replace "user@example.com" with the user's email address
# email = "user@example.com"

# # Generate a random token for the verification link
# token = 

# # Combine the email and token into a query string
# params = urllib.parse.urlencode({"email": email, "token": token})

# # Combine the base URL and query string to create the verification link
# verification_link = f"{base_url}?{params}"

# print(verification_link)
