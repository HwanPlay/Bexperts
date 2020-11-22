import requests
import json

def send(exception, text, path):
    requests.post('https://meeting.ssafy.com/hooks/8y53jbea7fr5uqowmiin15junr', 
        data=json.dumps({"attachments": [{
            "color": "#FF8000",
            "text": str(exception) + text,
            "author_name": "django",
            "author_icon": "http://www.mattermost.org/wp-content/uploads/2016/04/icon_WS.png",
            "title": path,
        }]}),
        headers={'Content-Type': 'application/json'}
    )
