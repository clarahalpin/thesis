import tweepy
import csv
import json

config = json.load(open('config2.json', 'r'))

consumer_key= config.get('consumer_key', None)
consumer_secret= config.get('consumer_secret', None)

access_token=config.get('access_token', None)
access_token_secret=config.get('access_token_secret', None)

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

user_ids = [767165447351463937, 767165475151306752, 832986425788289025, 767153591421370368, 767149776362151936]

def get_tweets():
    try:
        allTweets = []

        for u_id in user_ids:
            tweets = tweepy.Cursor(api.user_timeline, user_id = u_id).items()
            allTweets.extend(tweets)

    
            outtweets = [[tweet.id_str, tweet.created_at, tweet.user.id] for tweet in allTweets]

            with open('user_tweets.csv', 'w') as f:
                writer = csv.writer(f)
                writer.writerow(["id","created_at","user_id"])
                writer.writerows(outtweets)

                f.close()
    except Exception as e:
        print ("Error", e )



if __name__ == '__main__':
    
        get_tweets()
    
