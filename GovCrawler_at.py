import os
import json
from mastodon import Mastodon
import re
import textwrap

protocol_dir = "data/protokolle/"
#last_protocol = "Kurz-2/Beschlussprotokoll des 2. Ministerrates vom 15. Jänner 2020"
protocol_text_json = "/text.json"
annexes = ""

hashtag = "#MRat"
timer =  900
#hashtag = "#test"
#timer = 60

with open(f"{protocol_dir}toc.txt", 'r') as f:
    last_protocol=f.readlines()[-1].strip()
print(f"read protocol {last_protocol}")

with open(f"{protocol_dir}tooted.txt", 'r') as f:
    last_tooted_protocol=f.readlines()[-1].strip()
print(f"last tooted protocol {last_tooted_protocol}")

if last_tooted_protocol == last_protocol:
    print(f"already tooted {last_protocol}")
else:
    text_file = os.path.join(protocol_dir + last_protocol + protocol_text_json)
    with open(text_file, 'r') as f:
        data=f.read()

    protocol = json.loads(data)

    mastodon = Mastodon(
        access_token = 'pytooter_usercred.secret',
        api_base_url = 'https://botsin.space'
    )

    #create a thread with the latest protocol
    protocol_title = re.search(r"(.+)/(.+)", last_protocol)[2]
    protocol_title = protocol_title.replace("Ministerrat", "#Ministerrat\u200b")
    toot = mastodon.status_post(f"{protocol_title} {hashtag}", visibility="public")
    for top in protocol:
        try:
            for annex in top['annexes']:
                annexes += f" {annex['bka_url']}"
            toot_text = f"Top {top['top']}: {top['title']} {hashtag}\n{annexes}"
            toot_text = re.sub(r"(?i)Zahl.+, betreffend", "betreffend", toot_text)
            toot_text = textwrap.wrap(toot_text, width=480)
            for toot_text_part in toot_text:
                print(toot_text_part)
                toot = mastodon.status_reply(toot, toot_text_part)
            annexes = ""
        except:
            try:
                print(top[f"{top['undefined']}"])
                toot = mastodon.status_reply(toot, f"{top['undefined']} {hashtag}")
            except:
                try:
                    print(f"{top['pdf_title']} {top['bka_url']}")
                    toot = mastodon.status_reply(toot, f"{top['pdf_title']} {hashtag}\n{top['bka_url']}")
                except:
                    print("ERROR: There is no known Element in the protokoll JSON")
        time.sleep(timer)
    with open(f"{protocol_dir}tooted.txt", 'a') as f:
        f.write(f"{last_protocol}\n")
