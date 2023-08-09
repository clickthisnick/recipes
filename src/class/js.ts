const recipes = {}
const selectedRecipes = []
const selectedRecipeNames = []
const ingredients = {}
let mode = ''
const perishableItems = {}

function playSound() {
    const audio = document.getElementById("beep")
    // overrides the empty sound already played on the object
    // this is so ios will asynchronously play the sounds
    audio.src = "../src/sounds/pager-beep.mp3"
    audio.play()
}

const parseParams = (windowLocationSearch) => {

    // parse query string
    const params = new URLSearchParams(windowLocationSearch);

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
            obj[key] = params.getAll(key);
        } else {
            obj[key] = params.get(key);
        }
    }

    return obj;
}

const queryString = parseParams(window.location.search)

function setRecipe(recipeName, recipe) {
    // Setting the recipe data into the recipe
    if (recipes.hasOwnProperty(recipeName) === false) {
        recipes[recipeName] = []
    }
    recipes[recipeName].push(recipe)
}

function selectMode(id) {
    showElement(id)
    showElement('select')
    mode = id

    // Play the silent beep so ios lets us play it in the background later (after we change src)
    const audio = document.getElementById("beep")
    audio.play()

    hideElement('cookingButton')
    hideElement('shoppingButton')
}

function deselectRecipe(recipeName) {
    let idx = -1

    for (let i = 0; i < selectedRecipeNames.length; i++) {
        if (selectedRecipeNames[i] == recipeName) {
            idx = i
        }
    }

    if (idx >= 0) {
        // TODO this might not be right in javascript
        // its keeping the array as the same length without the objects
        delete selectedRecipeNames[idx]
        delete selectedRecipes[idx]
    }

    renderSelectedRecipes()
}

function renderSelectedRecipes() {
    // Show all the selected recipes
    let selectedRecipesHtml = ""
    for (let i =0; i < selectedRecipeNames.length; i++) {
        selectedRecipesHtml += `<button onclick="deselectRecipe('${selectedRecipeNames[i]}')">${selectedRecipeNames[i]}</button>`
        selectedRecipesHtml += "<br>"
    }

    console.log('hi')
    console.log(selectedRecipeNames)
    console.log(selectedRecipesHtml)

    const selectedDiv = document.getElementById("selectedrecipenames")
    if (selectedDiv) {
        selectedDiv.innerHTML = selectedRecipesHtml
    } 
    showElement('selected')
}

function selectRecipe(recipeName) {
    selectedRecipeNames.push(recipeName)
    selectedRecipes.push(recipes[recipeName])

    renderSelectedRecipes()
}

function addStep(istep) {
    const cookingDiv = document.getElementById('cooking')
    if (!cookingDiv) {
        alert('Cannot find cooking element id')
        return;
    }

    let divStep = ''
    divStep += "<div class='panel' id='panel-"
    divStep += istep.id + "' "

    if (istep.style) {
        divStep += `style="${istep.style}" `
    }

    divStep += 'onclick="this.classList.toggle('
    divStep += "'timer'"

    if (istep.showTimer) {
        // <!--Only double quote should be around the onclick-- >
        divStep += "); loadTimer("
        divStep += istep.time
        divStep += ", "
        divStep += istep.id
        divStep += ");"
    } else {
        cookingDiv.innerHTML += "";
        // <!--Only double quote should be around the onclick-- >
        divStep += "); document.getElementById('panel-"
        divStep += istep.id
        divStep += "').remove();"
    }

    divStep += '"><span id='
    divStep += "'"
    divStep += istep.id
    divStep += "'></span>"
    divStep += istep.text
    divStep += "</div>";

    cookingDiv.innerHTML += divStep

    if (istep.children && istep.children.length > 0) {
        istep.children.forEach(child => {
            addStep(child);
        })
    }
}

function saveShoppingUrl() {
    // <!--Converts ingredients to a url with query parameters-- >
    //    <!--query parameters = ? mode = shopping & asparagus=["tsb",% 201]-- >
    //        <!--ingredients = { asparagus: { tsb: 1 } } -->
    let queryParamter = document.location.href.split('?')[0] + '?mode=shopping' + '&recipes=' + selectedRecipeNames
    Object.keys(ingredients).forEach(ingredient => {
        const unit = Object.keys(ingredients[ingredient]['units'])[0]
        // < !--url encode - example - replace any spaces with % 20 -- >
        queryParamter += '&' + encodeURI(ingredient) + '=["' + unit + '", %20' + ingredients[ingredient]['units'][unit] + ']'
    })

    document.getElementById('shoppingUrl').innerHTML = queryParamter + "<br>"
}

function generateLinks(linkByPrice, priceKeys) {
    let links = ''

    // sort the prices key so we can list them by price
    priceKeys.sort()

    priceKeys.forEach(priceKey => {
        linkByPrice[priceKey].forEach(value => {
            links += value
        });
    })

    return links
}

function applyCreditCardDiscounts(store, pricePerQuantity) {
    // Include any discounts on the price per quantity
    if (store.startsWith("amazon")) {
        return (pricePerQuantity * .95).toFixed(3)
    } else if (store.startsWith("whole")) {
        return (pricePerQuantity * .95).toFixed(3)
    } else {
        return (pricePerQuantity * .98).toFixed(3)
    }
}
function doneSelectingRecipes() {
    hideElement('select')
    hideElement('selected')
    showElement('shoppingListButton')
    const shoppingDiv = document.getElementById('shopping')

    if (mode === 'shopping') {
        // Get all ingredients across all recipes
        // selectedRecipes is an array of array of recipes
        selectedRecipes.forEach(singleRecipeArray => {
            singleRecipeArray.forEach(singleRecipe => {
                Object.keys(singleRecipe.ingredients).forEach(ingredientKey => {
                    const ingredient = singleRecipe.ingredients[ingredientKey];

                    perishableItems[ingredient.name] = ingredient.perishableLimit

                    // If there are no previous ingredients, add the ingredient
                    if (!ingredients.hasOwnProperty(ingredient.name)) {
                        ingredients[ingredient.name] = ingredient
                    } else {
                        // If the previously known ingredient has the same unit as the ingredient we are adding
                        // Just update the quantity
                        if (ingredients[ingredient.name].unit.name == ingredient.unit.name) {
                            ingredients[ingredient.name].quantity += ingredient.quantity
                        } else {
                            // Otherwise just add the ingredient as the unit
                            ingredients[`${ingredient.name} ${ingredient.unit.name}`] = ingredient
                        }
                    }
                })
            })
        })

        // Show ingredients to the user
        shoppingDiv.innerHTML += '<br>'
        shoppingDiv.innerHTML += selectedRecipeNames
        shoppingDiv.innerHTML += '<br> Perishable Items: '
        shoppingDiv.innerHTML += JSON.stringify(perishableItems)
        shoppingDiv.innerHTML += '<br>'

        Object.keys(ingredients).forEach(ingredientKey => {
            let commonUnit;
            let links = ''

            const linkByPrice = {} // Key is prices, value is array of items
            const priceKeys = [] // Keys of the linkByPrice

            const ingredient = ingredients[ingredientKey]

            // When you click a saved url we don't include the purchaseLinks
            if (ingredient.hasOwnProperty('purchaseLinks')) {
                const stores = Object.keys(ingredient['purchaseLinks']).sort()

                stores.forEach(store => {
                    const storeLinks = ingredient['purchaseLinks'][store];
                    const storeDescriptions = Object.keys(storeLinks);

                    storeDescriptions.forEach(storeDescription => {
                        const items = storeLinks[storeDescription]
                        items.forEach(item => {

                            // Make the first unit found the common unit so when we price compare, all units are the same
                            if (commonUnit === undefined) {
                                commonUnit = item.quantity_unit.name
                            }

                            let pricePerQuantity = item.priceConversionTable[commonUnit]

                            if (item.discount) {
                                Object.keys(item.discount).forEach(discountKey => {
                                    const discountValue = item.discount[discountKey];
                                    const priceMultiple = ((100 - discountValue) * .01).toFixed(2)

                                    let subscribePricePerQuantity = (pricePerQuantity*priceMultiple).toFixed(3)

                                    subscribePricePerQuantity = applyCreditCardDiscounts(store, subscribePricePerQuantity)

                                    if (!linkByPrice.hasOwnProperty(subscribePricePerQuantity)) {
                                        linkByPrice[subscribePricePerQuantity] = [`</br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${discountKey} ${subscribePricePerQuantity} - ${subscribePricePerQuantity}/${commonUnit}</a>`]
                                        priceKeys.push(subscribePricePerQuantity)
                                    } else {
                                        linkByPrice[subscribePricePerQuantity].push(`</br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${discountKey} ${subscribePricePerQuantity} - ${subscribePricePerQuantity}/${commonUnit}</a>`)
                                    }
                                })
                            }

                            pricePerQuantity = applyCreditCardDiscounts(store, pricePerQuantity)

                            if (!linkByPrice.hasOwnProperty(pricePerQuantity)) {
                                linkByPrice[pricePerQuantity] = [`</br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${item.price} - ${pricePerQuantity}/${commonUnit}</a>`]
                                priceKeys.push(pricePerQuantity)
                            } else {
                                linkByPrice[pricePerQuantity].push(`</br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${item.price} - ${pricePerQuantity}/${commonUnit}</a>`)
                            }



                        })
                    })

                    links = generateLinks(linkByPrice, priceKeys)
                })
            }

            shoppingDiv.innerHTML += '<div id="shopping-' + ingredient.name + '" class="panel" style="">' + '<span onclick="this.classList.toggle(' + "'completed'" + "); document.getElementById('shopping-" + ingredient.name  + "').remove(); delete ingredients['" + ingredient.name  + "'" + '];" >' + ingredient.name  + ' ' + ingredient.quantity + ' ' + ingredient.unit.name + '</span>' + links + '</div>'
        })
    } else {
        selectedRecipes.forEach(recipes => {
            recipes.forEach(recipe => {
                recipe.steps.forEach(istep => {
                    addStep(istep)
                })
            })
        })
    }
}

function showElement(id) {
    document.getElementById(id).style.display = "inline"
}

function showElementsByClassName(className) {
    const elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.style.display = "inline";
    }
}

function hideElement(id) {
    document.getElementById(id).style.display = "none"
}









// This is where my new recipe app ends




function setStepVisibility(idxToShow, idxToHide) {
    document.getElementById("panel-" + idxToHide).style.display = 'none';
    document.getElementById("panel-" + idxToShow).style.display = 'block';
}

const timerClicks = {};

function startTimer(duration, stepId, stepIdxToShow, async) {
    const timerPanelId = "panel-" + stepId
    const timerElement = document.getElementById(timerPanelId);
    if (timerClicks.hasOwnProperty(timerPanelId)) {
        timerClicks[timerPanelId] += 1
    } else {
        timerClicks[timerPanelId] = 0
    }

    if (timerElement && timerElement.getAttribute('class')) {
        const timerClass = timerElement.getAttribute('class');
        if (timerClass && timerClass.includes('timer')) {
            // <!--If you click block 2 times after timer started, then you can skip-- >
            if (timerClicks[timerPanelId] >= 2) {
                //<!--Only show next element if not an async timer-- >
                // if (async == false) {
                //     document.getElementById("panel-" + stepIdxToShow).style.display = 'block';
                // }
                document.getElementById(timerPanelId).style.display = 'none';
            }
        }
    }

    //     return
    // } else {
    //     document.getElementById(timerPanelId).classList.toggle('timer')
    // }

    // if (async) {
    //     document.getElementById("panel-" + stepIdxToShow).style.display = 'block';
    // }

    const originalTimerHtml = timerElement.innerHTML;
    const intervalID = window.setInterval(function () {
        let minutes = parseInt(duration / 60, 10)
        let seconds = parseInt(duration % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.innerHTML = minutes + ":" + seconds + " " + originalTimerHtml;

        if (--duration < 0) {
            window.clearInterval(intervalID);
            timerElement.classList.toggle('timer');
            timerElement.classList.toggle('completed');
            if (async == false) {
                document.getElementById(timerPanelId).style.display = 'none';
                document.getElementById("panel-" + stepIdxToShow).style.display = 'block';
            }

            if (document.getElementById(timerPanelId).style.display != 'none') {
                // our end timers are always x2 our start timer id
                document.getElementById(`panel-${stepId * 2}`)?.remove();
                playSound()
            }
        }
    }, 1000);
}

function loadTimer(seconds, stepId, stepIdxToShow, async) {
    startTimer(seconds, stepId, stepIdxToShow, async);
}

let shownId = '';

function getCheckedOptions() {
   let id = '';
   const htmlCollection = document.getElementById('options').getElementsByTagName('button')

   for (const item of htmlCollection) {
     if (item.classList[0] == 'completed') {
         id += item.innerHTML
     }
   }

   return id
}

// Used to hide/show recipes
function showRecipe() {
    const id = getCheckedOptions()

    // Show
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = 'block';
    }

    if (document.getElementById(shownId)) {
        // Hide previously shown
        document.getElementById(shownId).style.display = 'none';
    }

    shownId = id;
}
