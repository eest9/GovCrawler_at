import os, sys
from natsort import natsorted

path = "./data/protokolle/"
list_of_govs = ["Kurz-1", "Bierlein-1", "Kurz-2"]
list_of_govs_protocols = []
list_of_all_protocols = []

for gov in list_of_govs:
    dirs = os.listdir(path + gov)
    for file in dirs:
       list_of_govs_protocols.append(f"{gov}/{file}")
    list_of_govs_protocols = natsorted(list_of_govs_protocols)
    list_of_all_protocols += list_of_govs_protocols
    list_of_govs_protocols = []

for protocol in list_of_all_protocols:
    print(protocol)

text_file = os.path.join(path, 'toc.txt')
with open(text_file, 'w') as f:
    f.write("\n".join(list_of_all_protocols) + "\n")
