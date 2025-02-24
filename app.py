import json
import os
import time

from flask import Flask, render_template
import pymongo  # Import the PyMongo library
from bson import json_util

app = Flask(__name__)
mongo_client = pymongo.MongoClient(os.getenv('MONGO_URI'))  # Connect to the MongoDB server
database = mongo_client['blog']  # Get the database

cached_articles = []  # Cache the articles in memory
last_cached_time = 0  # Last time the cache was updated


@app.route('/')
def index():
    check_cache()

    return render_template('index.html', articles=cached_articles)


# Route article but asks for a parameter id in the URL
@app.route('/article/<identifier>')
def article(identifier):
    check_cache()
    article_document = None

    # Check if the article exists
    for cached_article in cached_articles:

        if cached_article['article_id'] == identifier:
            article_document = cached_article
            break

    if article_document is None:
        return 'Article not found', 404

    return render_template('article.html', article_document=article_document)


# RESTful API to increase like count for a specific article
@app.route('/article/<identifier>/like', methods=['POST'])
def like_article(identifier):
    check_cache()

    response: int = 404
    likes: int = 0

    # Check if the article exists
    for cached_article in cached_articles:

        if cached_article['article_id'] == identifier:
            # Update the heart count
            cached_article['likes'] += 1
            likes = cached_article['likes']

            # Update the article in the database
            database.articles.update_one({'article_id': identifier}, {'$inc': {'likes': 1}})
            response = 200
            break

    return json.dumps({'likes': likes}), response


def update_cache() -> None:
    global last_cached_time, cached_articles

    # Get all the articles from the database
    articles = database.articles.find()

    # Convert the articles to a list and store them in the cache
    cached_articles = [json.loads(json_util.dumps(article_document)) for article_document in articles]
    last_cached_time = time.time()


def check_cache() -> None:
    global last_cached_time

    # Check if the cache is older than 5 minutes
    if time.time() - last_cached_time > 0:  # 5 * 60:
        update_cache()


def parse_json(data):
    return json.loads(json_util.dumps(data))


if __name__ != '__main__':
    application = app
