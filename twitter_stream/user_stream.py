import tweepy
import sys
import csv
import json
from textwrap import TextWrapper
from datetime import datetime
from elasticsearch import Elasticsearch
import time
import traceback
config = json.load(open('config.json', 'r'))

consumer_key= config.get('consumer_key', None)
consumer_secret= config.get('consumer_secret', None)

access_token=config.get('access_token', None)
access_token_secret=config.get('access_token_secret', None)

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

es = Elasticsearch(['localhost:9212'])

user_ids = []
with open("user_ids.csv", 'r') as f:
        reader = csv.reader(f)
        #user_ids = list(reader)
        for line in reader:
                #print('line', line)
                user_ids.append(line[0].strip())
f.close()

def create_index(es, index=None, mapping=None, settings=None):
    print('creating index', index)
    if mapping is None:
        mapping = {"mappings": {
            index: {
                "_all": {"enabled": False},
                "_source": {"enabled": True}
            }
        }
        }

    settings =  {"settings": {
         #   "index.mapping.total_fields.limit": 2000
    }}
    if settings is not None:
        mapping['settings'] = settings


    for i in es.indices.get('*'):
            print('index:', i)
    es.indices.delete(index=index, ignore=[400, 404])
    es.indices.create(index=index,
                      #ignore=[400, 404],
                      body=mapping)
    for i in es.indices.get('*'):
            print('after index:', i)
    return
                 
class StreamListener(tweepy.StreamListener):
    def on_status(self, status):
        try:
            json_data = status._json
            #print json_data['text']
            print('tweet', json_data['text'])
            es.index(index="idx_user_live_tweets_test",
                     doc_type="tweet",
                     body=json_data)
            
        except Exception as e:
            print(e)
            print ('type', type(json_data), len(json_data.keys()))
            print ('data:', json_data)
            pass

def main():    
    try:
        streamer = tweepy.Stream(auth=auth, listener=StreamListener(), timeout=3000000000)
        #print('userids', user_ids)
        #streamer.filter(follow=(', '.join('"' + str(u_id) + '"' for u_id in user_ids)))
        streamer.filter(follow=user_ids)
    except Exception as e:
        print (e)
        pass
    return

if __name__ == '__main__':
#    try:
     print(es)
     index="idx_user_live_tweets_test"
     if es.indices.exists(index):
             print('index already exists', index)
     else:
             create_index(es, index=index)

     while True:
             try:
                     main()
             except:
                     print(traceback.format_exc())
                     time.sleep(10)
                     
  #    print (b)
