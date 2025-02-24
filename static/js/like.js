// Configuration constants
const COOLDOWN_DURATION = 500;
const DEBOUNCE_DURATION = 300;

// State management
const pendingRequests = new Set();
const cooldowns = new Set();
const likeCounters = new Map();

// Cache DOM elements on load
document.querySelectorAll('.like-counter').forEach(counter => {
    const articleId = counter.dataset.articleId;
    likeCounters.set(articleId, counter);
});

document.querySelectorAll('.like-btn').forEach(button => {
    const articleId = button.dataset.articleId;

    // Add optimized click handler
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Debounce multiple clicks
        if (button.disabled) return;
        button.disabled = true;
        setTimeout(() => button.disabled = false, DEBOUNCE_DURATION);

        if (pendingRequests.has(articleId)) {
            console.log(`Request already pending for article ${articleId}`);
            return;
        }

        if (cooldowns.has(articleId)) {
            console.log(`Article ${articleId} is in cooldown`);
            return;
        }

        try {
            pendingRequests.add(articleId);

            const response = await fetch(`/article/${articleId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            updateLikeCounter(articleId, data.likes);
        } catch (error) {
            console.error(`Like failed for article ${articleId}:`, error);
        } finally {
            // Cleanup operations
            pendingRequests.delete(articleId);

            // Start cooldown period
            cooldowns.add(articleId);
            setTimeout(() => cooldowns.delete(articleId), COOLDOWN_DURATION);
        }
    });
});

function updateLikeCounter(articleId, count) {
    const counter = likeCounters.get(articleId);
    if (counter) {
        counter.textContent = count;
        counter.classList.add('updated');
        setTimeout(() => counter.classList.remove('updated'), 200);
    }
}
