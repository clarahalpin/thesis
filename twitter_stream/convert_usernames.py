import csv
import tweepy

config = json.load(open('config.json', 'r'))

consumer_key= config.get('consumer_key', None)
consumer_secret= config.get('consumer_secret', None)

access_token=config.get('access_token', None)
access_token_secret=config.get('access_token_secret', None)

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

readFile = open("usernames.csv", "r")
reader = csv.reader(readFile)
writeFile = open("user_ids.csv", "w")
writer = csv.writer(writeFile)

rows = []

for row in reader:
    processedRow = ', '.join(row)
    user = api.get_user(screen_name = processedRow)
    rows.append(user.id)

    for row in rows:
        writer.writerow(row)

        print("User IDs written to file")
        readFile.close()
        writeFile.close()
