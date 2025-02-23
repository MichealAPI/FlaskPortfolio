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
        url: "#",
        title: "Github"
    },
    {
        id: 2,
        url: "#",
        title: "Discord"
    },
    {
        id: 3,
        url: "#",
        title: "Mail"
    },
]


actions.forEach(action => {
    actionsWrapper.innerHTML += `
                    <a href="${action.url}" class="action">
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