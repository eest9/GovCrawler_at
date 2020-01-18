import os
import json
from mastodon import Mastodon

protocol_dir = "data/protokolle/Kurz-2/"
last_protocol = "Beschlussprotokoll des 2. Ministerrates vom 15. Jänner 2020"
protocol_text_json = "/text.json"

text_file = os.path.join(protocol_dir + last_protocol + protocol_text_json)

with open(text_file, 'r') as f:
    data=f.read()

protocol = json.loads(data)

mastodon = Mastodon(
    access_token = 'pytooter_usercred.secret',
    api_base_url = 'https://botsin.space'
)

#create a thread with the latest protocol
toot = toot = mastodon.status_post(last_protocol + " #test", visibility="unlisted", spoiler_text="test, Hackathon 0x11")
for i in protocol:
    print("Top " + protocol[protocol.index(i)]['top'] + ": " + protocol[protocol.index(i)]['title'])
    toot = mastodon.status_reply(toot,"Top " + protocol[protocol.index(i)]['top'] + ": " + protocol[protocol.index(i)]['title'] + " #test")
