import json
import os
import time
import uuid
from urllib.request import Request

from flask import Flask, render_template, request
import pymongo  # Import the PyMongo library
from bson import json_util
import article_helper

app = Flask(__name__)
mongo_client = pymongo.MongoClient(os.getenv('MONGO_URI'))  # Connect to the MongoDB server
database = mongo_client['blog']  # Get the database

cached_articles = []  # Cache the articles in memory
last_cached_time = 0  # Last time the cache was updated

debug = False


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

            # Update the article in the database
            database.articles.update_one({'article_id': identifier}, {'$inc': {'likes': 1}})

            # Update the cache
            likes: int = database.articles.find_one({'article_id': identifier})['likes']
            cached_article['likes'] = likes

            response = 200
            break

    return json.dumps({'likes': likes}), response


@app.route('/upsert', methods=['POST'])
@app.route('/upsert/<identifier>', methods=['POST'])
def update_article(identifier: str = None):
    # Check credentials
    if not article_helper.check_credentials(request):
        return 'Unauthorized', 401

    # Get the article content from "content" in the request params
    article_content = request.get_json()['content']
    sanitized_content = article_helper.sanitize_markdown(article_content)

    # Obtain identifier
    if identifier is None:
        # Random UUID
        identifier = uuid.uuid4().hex

    if article_content is None:
        return 'No content provided', 400

    # Upsert the article
    database.articles.update_one({'article_id': identifier}, {'$set': {'content': sanitized_content}}, upsert=True)


def update_cache() -> None:
    global last_cached_time, cached_articles

    # Get all the articles from the database
    articles = database.articles.find()

    # Convert the articles to a list and store them in the cache
    cached_articles = [json.loads(json_util.dumps(article_document)) for article_document in articles]
    last_cached_time = time.time()


def check_cache() -> None:
    global last_cached_time

    if debug:
        # Debug mode, always update the cache
        update_cache()
        return

    # Check if the cache is older than 3 minutes
    if time.time() - last_cached_time > 180:  # 3 * 60:
        update_cache()


def parse_json(data):
    return json.loads(json_util.dumps(data))


if __name__ != '__main__':
    application = app
else:
    debug = True
    app.run(debug=debug)
