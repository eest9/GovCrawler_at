# About

# Abstract
Is a tool to download the latest reports of the weekly sittings from the austrian federal government/council of ministers. It also toots it and shows it with the latest consultation bills on a web page.

# Main Project
+ Mastodon Account: [@GovCrawler_at@botsin.space](https://botsin.space/@GovCrawler_at)
+ Twitter Account: [@GovCrawler_at@twitter.com](https://twitter.com/GovCrawler_at)
+ Webside: coming soon

# Usage

## Requirements
+ Python3
+ A Webserver (like Apache2 or try `python3 -m http.server` for testing)

## Tools included
+ [minster.py](minster.py) saves the last report in a json file and downloads the annexes.
+ [GovCrawler_at.py](GovCrawler_at.py) toots the newest report in a thread on mastodon if the report wasn't tooted already.
+ [data/index.html](../data/index.html) shows the latest report and the latest consultation bills on a web page.

## Advanced Usage
+ [table_of_contents.py](table_of_contents.py) is used to scan all reports to generate an index of all saved reports. Don't use it in production.
