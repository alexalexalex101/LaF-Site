from flask import Flask, request, jsonify
from flask_cors import CORS
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import base64
import os
from dotenv import load_dotenv
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow frontend to call (dev only; restrict in prod)


# SendGrid API Key (generate at https://sendgrid.com)
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

# Verified sender email (must be verified in SendGrid dashboard)
EMAIL_SENDER = os.getenv('SENDGRID_SENDER')

@app.route('/send-inquiry', methods=['POST'])
def send_inquiry():
    try:
        data = request.get_json()
        receiver = data.get('email_receiver')
        item_location = data.get('item_location', 'Not specified')
        date_found_str = data.get('date_found', 'Not specified')
        created_at_str = data.get('created_at', 'Not specified')
        description = data.get('description', 'No description')
        filename = data.get('filename')  # server-side path to attachment
        pdf_filename = data.get('pdf_filename')        # e.g. "maps/Main Building Lost & Found.pdf"

        if not receiver:
            return jsonify({"error": "Missing email receiver"}), 400

        # Format dates (safe handling)
        date_found_formatted = 'Not specified'
        if date_found_str != 'Not specified':
            try:
                date_found_formatted = datetime.strptime(date_found_str, '%Y-%m-%d').strftime('%m/%d/%Y')
            except ValueError:
                date_found_formatted = date_found_str

        created_at_formatted = 'Not specified'
        if created_at_str != 'Not specified':
            try:
                dt = datetime.strptime(created_at_str, '%Y-%m-%d %H:%M:%S')
                created_at_formatted = dt.strftime('%m/%d/%Y %I:%M %p')
            except ValueError:
                created_at_formatted = created_at_str

        # Build thank you body
        body = f"""Thank you for submitting an information inquiry!

Item Details:
- Current Location: {item_location}
- Date Found: {date_found_formatted}
- Report Created: {created_at_formatted}
- Item Description: {description or 'No description provided'}

If you think this is your item, come to the following location to retrieve it: {item_location}

{'A location map/guide has been attached for your reference.' if pdf_filename else ''}
"""

        # Create SendGrid mail object
        message = Mail(
            from_email=EMAIL_SENDER,
            to_emails=receiver,
            subject="Thank you for your Lost Item Inquiry",
            plain_text_content=body
        )

        # Attach file if provided and exists
        if filename and os.path.exists(filename):
            with open(filename, 'rb') as f:
                data = f.read()
                encoded_file = base64.b64encode(data).decode()
                attachment = Attachment(
                    FileContent(encoded_file),
                    FileName(os.path.basename(filename)),
                    FileType('application/octet-stream'),
                    Disposition('attachment')
                )
                message.attachment = attachment

        # Attach PDF if provided and exists
        if pdf_filename and os.path.exists(pdf_filename):
            with open(pdf_filename, 'rb') as f:
                encoded_pdf = base64.b64encode(f.read()).decode()
                attachment_pdf = Attachment(
                    FileContent(encoded_pdf),
                    FileName(os.path.basename(pdf_filename)),
                    FileType('application/pdf'),
                    Disposition('attachment')
                )
                # Append to existing attachments (image + pdf)
                if hasattr(message, 'attachment') and message.attachment:
                    if not isinstance(message.attachment, list):
                        message.attachment = [message.attachment]
                    message.attachment.append(attachment_pdf)
                else:
                    message.attachment = attachment_pdf
                    
        # Send via SendGrid
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        return jsonify({"message": "Inquiry confirmation sent!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')