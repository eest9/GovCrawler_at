import os
import json
from mastodon import Mastodon

protocol_dir = "data/protokolle/Kurz-2/Beschlussprotokoll des 2. Ministerrates vom 15. Jänner 2020/text.json"

text_file = os.path.join(protocol_dir)

with open(text_file, 'r') as f:
    data=f.read()

protocol = json.loads(data)

mastodon = Mastodon(
    access_token = 'pytooter_usercred.secret',
    api_base_url = 'https://botsin.space'
)

#print(protocol[0]['title'])
mastodon.status_post("Top " + protocol[0]['top'] + ": " + protocol[0]['title'], visibility="unlisted", spoiler_text="test, Hackathon 0x11")
