import csv
import tweepy
import json

config = json.load(open('config.json', 'r'))

consumer_key= config.get('consumer_key', None)
consumer_secret= config.get('consumer_secret', None)

access_token=config.get('access_token', None)
access_token_secret=config.get('access_token_secret', None)

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

readFile = open("usernames.csv", "r")
lines = readFile.readlines()
readFile.close()

user_ids =[]
for line in lines:
    user = api.get_user(screen_name = line)
    user_ids.append(user.id)
    
writeFile = open("user_ids.csv", "w")
writer = csv.writer(writeFile)

#for row in reader:
 #   processedRow = ', '.join(row)
  #  print (processedRow, len(processedRow))
#user = api.get_user(screen_name = processedRow)
#user_ids.append(user.id)

writer.writerows([[u_id] for u_id in user_ids])

print("User IDs written to file")
writeFile.close()
