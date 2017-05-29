import tweepy
import sys
import csv
import json
from textwrap import TextWrapper
from datetime import datetime
from elasticsearch import Elasticsearch

config = json.load(open('config.json', 'r'))

consumer_key= config.get('consumer_key', None)
consumer_secret= config.get('consumer_secret', None)

access_token=config.get('access_token', None)
access_token_secret=config.get('access_token_secret', None)

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

es = Elasticsearch(['localhost:9212'])

with open("user_ids.csv", 'r') as f:
        reader = csv.reader(f)
        user_ids = list(reader)
f.close()

def create_index(es, index=None, mapping=None, settings=None):
    if mapping is None:
        mapping = {"mappings": {
            index: {
                "_all": {"enabled": False},
                "_source": {"enabled": True}
            }
        }
        }

    settings =  {"settings": {
            "index.mapping.total_fields.limit": 2000
    }}
    if settings is not None:
        mapping['settings'] = settings
    es.indices.delete(index=index, ignore=[400, 404])
    es.indices.create(index=index, ignore=[400, 404], body=mapping)
    return
                 
class StreamListener(tweepy.StreamListener):
    def on_status(self, status):
        try:
            json_data = status._json
            #print json_data['text']
            es.index(index="idx_user_live_tweets_test",
                     doc_type="tweet",
                     body=json_data)
            
        except Exception as e:
            print(e)
            print ('type', type(json_data), len(json_data.keys()))
            print ('data:', json_data)
            pass

def main():
    streamer = tweepy.Stream(auth=auth, listener=StreamListener(), timeout=3000000000)    
    streamer.filter(follow= (','.join(str(u_id) for u_id in user_ids)))
    return

if __name__ == '__main__':
    print(es)
    create_index(es, index="idx_user_live_tweets_test")
    main()
