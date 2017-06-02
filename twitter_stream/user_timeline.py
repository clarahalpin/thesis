import time
import tweepy
import csv
import sys
import time
import traceback
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

api = tweepy.API(auth)
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

def main():
        tweets = tweepy.Cursor(api.user_timeline, user_id = (user_ids)).pages()
        try:
                json_data = status._json
                #print json_data['text']
                es.index(index="idx_user_past_tweets_test",
                         doc_type="tweet",
                         body=json_data)
        except Exception as e:
                print(e)
                print('type', type(json_data), len(json_data.keys()))
                print('data:', json_data)
                pass
        return

if __name__ == '__main__':
        print(es)
        index="idx_user_past_tweets_test"
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
