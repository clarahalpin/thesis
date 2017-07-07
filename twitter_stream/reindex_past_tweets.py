import elasticsearch
import elasticsearch.helpers
es = elasticsearch.Elasticsearch([{"host": "localhost", "port": 9212}])

# Setup source and destinations connection to Elasticsearch. Could have been different clusters
# Delete index so we know it doesn't exist.
#elasticDestination.indices.delete(index="idx_past_user_tweets", ignore=[400, 404])
# Create index with nothing in it.

def create_index(es, index=None, mapping=None, settings=None):
    print('creating index', index)
    if mapping is None:
        mapping = {"mappings": {
            index: {
                "properties": {
                    "coordinates": {
                        "type": "geo_shape"
                    },
                    "created_at": {
                        "format": "EEE MMM dd HH:mm:ss Z YYYY",
                        "type": "date"
                    },
                    "entities": {
                        "properties": {
                            "hashtags": {
                                "properties": {
                                    "indices": {
                                        "type": "long"
                                    },
                                    "text": {
                                        "type": "string"
                                    }
                                }
                            },
                            "urls": {
                                "properties": {
                                    "display_url": {
                                        "type": "string"
                                    },
                                    "expanded_url": {
                                        "index": "not_analyzed",
                                        "type": "string"
                                    },
                                    "indices": {
                                        "type": "long"
                                    },
                                    "url": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    },
                    "favorite_count": {
                        "type": "long"
                    },
                    "favorited": {
                        "type": "boolean"
                    },
                    "filter_level": {
                        "type": "string"
                    },
                    "geo": {
                        "type": "geo_shape"
                    },
                    "id": {
                        "type": "long"
                    },
                    "id_str": {
                        "type": "string"
                    },
                    "lang": {
                        "type": "string"
                    },
                    "place": {
                        "properties": {
                            "attributes": {
                                "type": "object"
                            },
                            "bounding_box": {
                                "type": "geo_shape"
                            },
                            "country": {
                                "index": "not_analyzed",
                                "type": "string"
                            },
                            "country_code": {
                                "type": "string"
                            },
                            "full_name": {
                                "index": "not_analyzed",
                                "type": "string"
                            },
                            "id": {
                                "type": "string"
                            },
                            "name": {
                                "index": "not_analyzed",
                                "type": "string"
                            },
                            "place_type": {
                                "type": "string"
                            },
                            "url": {
                                "type": "string"
                            }
                        }
                    },
                    "possibly_sensitive": {
                        "type": "boolean"
                    },
                    "retweet_count": {
                        "type": "long"
                    },
                    "retweeted": {
                        "type": "boolean"
                    },
                    "source": {
                        "index": "not_analyzed",
                        "type": "string"
                    },
                    "text": {
                        "type": "string"
                    },
                    "timestamp_ms": {
                        "type": "date"
                    },
                    "truncated": {
                        "type": "boolean"
                    },
                    "user": {
                        "properties": {
                            "contributors_enabled": {
                                "type": "boolean"
                            },
                            "created_at": {
                                "format": "EEE MMM dd HH:mm:ss Z YYYY",
                                "type": "date"
                            },
                            "default_profile": {
                                "type": "boolean"
                            },
                            "default_profile_image": {
                                "type": "boolean"
                            },
                            "description": {
                                "type": "string"
                            },
                            "favourites_count": {
                                "type": "long"
                            },
                            "followers_count": {
                                "type": "long"
                            },
                            "friends_count": {
                                "type": "long"
                            },
                            "geo_enabled": {
                                "type": "boolean"
                            },
                            "id": {
                                "type": "long"
                            },
                            "id_str": {
                                "type": "string"
                            },
                            "is_translator": {
                                "type": "boolean"
                            },
                            "lang": {
                                "type": "string"
                            },
                            "listed_count": {
                                "type": "long"
                            },
                            "location": {
                                "index": "not_analyzed",
                                "type": "string"
                            },
                            "name": {
                                "index": "not_analyzed",
                                "type": "string"
                            },
                            "profile_background_color": {
                                "type": "string"
                            },
                            "profile_background_image_url": {
                                "type": "string"
                            },
                            "profile_background_image_url_https": {
                                "type": "string"
                            },
                            "profile_background_tile": {
                                "type": "boolean"
                            },
                            "profile_banner_url": {
                                "type": "string"
                            },
                            "profile_image_url": {
                                "type": "string"
                            },
                            "profile_image_url_https": {
                                "type": "string"
                            },
                            "profile_link_color": {
                                "type": "string"
                            },
                            "profile_sidebar_border_color": {
                                "type": "string"
                            },
                            "profile_sidebar_fill_color": {
                                "type": "string"
                            },
                            "profile_text_color": {
                                "type": "string"
                            },
                            "profile_use_background_image": {
                                "type": "boolean"
                            },
                            "protected": {
                                "type": "boolean"
                            },
                            "screen_name": {
                                "type": "string"
                            },
                            "statuses_count": {
                                "type": "long"
                            },
                            "time_zone": {
                                "type": "string"
                            },
                            "url": {
                                "type": "string"
                            },
                            "utc_offset": {
                                "type": "long"
                            },
                            "verified": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            }
        }
        }
        
        settings =  {"settings": {
            #  "index.mapping.total_fields.limit": 2000
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

print(es)
index="idx_past_tweets_updated"
if es.indices.exists(index):
    print('index already exists', index)
else:
    create_index(es, index=index)
#es.indices.create(index='idx_past_tweets_updated', ignore=400, body=mapping)
#elasticsearch.helpers.reindex(client=elasticSource, source_index="idx_past_user_tweets", target_index="idx_past_tweets", target_client=elasticDestination)
