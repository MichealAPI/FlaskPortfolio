const articlesContainer = document.querySelector('#articles');
const articleRelativeEndpoint = '/article/';

/*const articles = [
    {
        "id": 1,
        "title": "How to create a simple web app using Flask",
        "likes": 4500,
        "url": "INTERNAL"
    },
    {
        "id": 2,
        "title": "How to create a simple web app using Django",
        "likes": 4500,
        "url": "INTERNAL"
    },
    {
        id: 3,
        "title": "How to create a simple web app using FastAPI",
        "likes": 4500,
        "url": "INTERNAL"
    }
]; */

articles.forEach(article => {
    article = article[0];

    articlesContainer.innerHTML += `
                          <div class="article">
                            <div class="wrapper">
                                <div class="article-title">
                                    <p class="open-sans-regular">${article.title}</p>
                                </div>

                                <div class="article-actions">
                                    <div class="heart">
                                        <div class="heart-number">
                                            <p>${formatNumber(article.likes)}</p>
                                        </div>
                                        
                                        <div class="heart-icon">
                                            <i class="bi bi-heart-fill"></i>
                                        </div>
                                    </div>

                                    <div class="redirect-btn">
                                        <a href="${article.url === "INTERNAL" ? articleRelativeEndpoint + article.article_id : article.url}">
                                            <i class="bi bi-box-arrow-up-right"></i>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    `
});

/**
 * Function to format likes number
 * @param {*} number the likes number
 * @returns the formatted number
 */
function formatNumber(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k';
    }
    return number;
}
