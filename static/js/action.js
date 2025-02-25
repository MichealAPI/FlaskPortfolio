/**
 *                     <a href="#" class="action">
                        <div class="action-text">
                            <p class="open-sans-regular">
                                Example
                            </p>
                        </div>


                        <div class="action-icon">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </div>
                    </a>   
 */


const actionsWrapper = document.querySelector("#actions")

const actions = [
    {
        id: 1,
        url: "https://github.com/MichealAPI",
        title: "Github"
    },
    {
        id: 2,
        url: "https://discord.com/users/350160924310634516",
        title: "Discord"
    },
    {
        id: 3,
        url: "mailto:michele@mikeslab.it",
        title: "Mail"
    },
]


actions.forEach(action => {
    actionsWrapper.innerHTML += `
                    <a href="${action.url}" class="action" target="_blank">
                        <div class="action-text">
                            <p class="open-sans-regular">
                                ${action.title}
                            </p>
                        </div>

                        <div class="action-icon">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </div>
                    </a>`
})