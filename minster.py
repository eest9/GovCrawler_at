#!/usr/bin/env python3

# pip install beautifulsoup4 requests


import requests
import re
import errno
import os
from bs4 import BeautifulSoup
import json

HOST = 'https://www.bundeskanzleramt.gv.at'
ROOT_URL = HOST + '/bundeskanzleramt/die-bundesregierung/ministerratsprotokolle/ministerratsprotokolle-der-regierungsperiode-xxvii-2020-regierung-kurz.html'

DESINATION_DIR = 'data/protokolle/Kurz-2'

MAX_FILENAME_LEN = 64


def get(url):
    if not url.startswith('http'):
        url = HOST + url
    text = requests.get(url).text
    return BeautifulSoup(text, features="html.parser")


def fetch_protokoll_text(url):
    main_text_raw = get(url).select('main > p')
    main_text = []
    for par in main_text_raw:
        par_regex = re.search(r"^([0-9]+(\.[0-9]+)?)\.?(.+)", par.get_text())
        if par_regex:
            par_obj = {"top":par_regex.group(1),"title":par_regex.group(3).lstrip(),"annexes":[]}
        else:
            par_obj = {"undefined":par.get_text()}
        main_text.append(par_obj)
    return main_text


def strip_non_ascii(s):
    s = s.replace('–', '-')
    s = re.sub(r'[^\x00-\x7füäöÜÄÖß]', ' ', s)
    return s


def get_top_from_pdf_text(text):
    return re.findall(r"([0-9]+/[0-9]+(\.[0-9]+)?)", text)[-1][0]


def parse_pdf(p):
    text = p.get_text().strip()
    try:
        top_nummer = get_top_from_pdf_text(text)
    except IndexError:
        if p.parent.parent.parent.name == 'li':
            parent_text = p.parent.parent.parent.get_text().strip()
            try:
                top_nummer = get_top_from_pdf_text(parent_text)
            except IndexError:
                top_nummer = 'none'
        else:
            top_nummer = 'none'
    url = p['href']
    if not url.startswith('http'):
        url = HOST + url
    return (
        url,
        strip_non_ascii(text),
        top_nummer,
    )


def fetch_protokoll_pdfs(link):
    link = get(link).select('main > p:last-of-type > a')[0]['href']
    div = get(link).select('main')[0]
    pdfs = [a for a in div.select('a') if 'pdf' in a['href']]
    return [
        parse_pdf(p)
        for p in pdfs
    ]


def download_file(url, path):
    r = requests.get(url)
    with open(path, 'wb') as f:
        f.write(r.content)


def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def main():
    html = get(ROOT_URL)

    protokolle = html.select('.overview-item a')

    #mkdir_p(DESINATION_DIR)

    for proto in protokolle:
        mkdir_p(DESINATION_DIR) #temp
        titel = strip_non_ascii(proto.get_text().strip())
        link = proto['href']
        text = fetch_protokoll_text(link)
        pdfs = fetch_protokoll_pdfs(link)

        print(titel)

        protokoll_dir = os.path.join(DESINATION_DIR, titel)
        mkdir_p(protokoll_dir)

        pdfs_dir = os.path.join(protokoll_dir, 'pdfs')
        mkdir_p(pdfs_dir)

        for pdf_link, pdf_title, pdf_top in pdfs:
            #import pdb; pdb.set_trace()
            print(pdf_top + ' => ' + pdf_title)

            pdf_name = pdf_title

            if pdf_top != "none":
                pdf_name = pdf_top + ' ' + pdf_name
                print(re.search(r"[0-9]+/([0-9\.]+)", pdf_top)[1])

            pdf_name = pdf_name[:MAX_FILENAME_LEN - 4] + '.pdf'

            pdf_name = pdf_name.replace('/', '_')
            pdf_path = os.path.join(pdfs_dir, pdf_top.replace('/', '_'), pdf_name)
            print(f'pdf_top {pdf_top}')
            print(f'pdf_title {pdf_title}')
            print(f'pdf_path {pdf_path}')
            print(f'pdf_link {pdf_link}')
            if pdf_top != "none":
                for top in text:
                    try:
                        if top['top'] == re.search(r"[0-9]+/([0-9\.]+)", pdf_top)[1]:
                            print(f'pdf_top {pdf_top} gefunden')
                            top['annexes'].append({"bka_url":pdf_link,"local_path":pdf_path,"pdf_title":pdf_title})
                            break
                    except:
                        print(f"{top['undefined']} has no top nr")
            else:
                text.append({"bka_url":pdf_link,"local_path":pdf_path,"pdf_title":pdf_title})

            mkdir_p(os.path.dirname(pdf_path))
            download_file(pdf_link, pdf_path)

        text_file = os.path.join(protokoll_dir, 'text.json')
        with open(text_file, 'w') as f:
            f.write(json.dumps(text, indent=4))
            #return #for debuging

        return


if __name__ == '__main__':
    main()
