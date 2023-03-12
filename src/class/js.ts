let recipes = {}
let selectedRecipes = []
let selectedRecipeNames = []
let ingredients = {}
let mode = ''
let perishableItems = {}

function playSound() {
    const audio = new Audio();
    audio.autoplay = true;

    // onClick of first interaction on page before I need the sounds
    // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
    audio.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

    // later on when you actually want to play a sound at any point without user interaction
    audio.src = "https://www.clickthisnick.com/recipes/src/sounds/pager-beep.mp3";

    audio.play();
}

function generateHtml() {
    // Reset root in case we are dynamically doing things
    let root = document.getElementById('root')

    if (root) {
        root.innerHTML = ''
    }
}

const parseParams = (querystring) => {

    // parse query string
    const params = new URLSearchParams(querystring);

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

let queryString = parseParams(window.location.search)

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

    hideElement('cookingButton')
    hideElement('shoppingButton')
}

function selectRecipe(recipeName) {
    selectedRecipeNames.push(recipeName)
    selectedRecipes.push(recipes[recipeName])
}

function addStep(istep) {
    let cookingDiv = document.getElementById('cooking')
    if (!cookingDiv) {
        alert('Cannot find cooking element id')
        return;
    }

    if (istep.showTimer) {
        // <!--Only double quote should be around the onclick-- >
        let divStep = ''
        divStep += "<div class='panel' id='panel-"
        divStep += istep.id + "' "
        divStep += 'onclick="this.classList.toggle('
        divStep += "'timer'"
        divStep += "); loadTimer("
        divStep += istep.time
        divStep += ", "
        divStep += istep.id
        divStep += ");"
        divStep += '"><span id='
        divStep += "'"
        divStep += istep.id
        divStep += "'></span>"
        divStep += istep.text
        divStep += "</div>";
        cookingDiv.innerHTML += divStep
    } else {
        cookingDiv.innerHTML += "";
        // <!--Only double quote should be around the onclick-- >

        let divStep = ''
        divStep += "<div class='panel' id='panel-"
        divStep += istep.id + "' "
        divStep += 'onclick="this.classList.toggle('
        divStep += "'timer'"
        divStep += "); document.getElementById('panel-"
        divStep += istep.id
        divStep += "').remove();"
        divStep += '"><span id='
        divStep += "'"
        divStep += istep.id
        divStep += "'></span>"
        divStep += istep.text
        divStep += "</div>";
        cookingDiv.innerHTML += divStep
    }

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
        let unit = Object.keys(ingredients[ingredient]['units'])[0]
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
    let shoppingDiv = document.getElementById('shopping')

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

            let linkByPrice = {} // Key is prices, value is array of items
            let priceKeys = [] // Keys of the linkByPrice

            let ingredient = ingredients[ingredientKey]

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
    var elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        element.style.display = "inline";
    }
}

function hideElement(id) {
    document.getElementById(id).style.display = "none"
}









// This is where my new recipe app ends

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay);
}

function showAllIngredients() {
    let ingredientDiv = document.getElementById('ingredients');

    ingredientDiv.style.display = 'inline'
}

function showAllSteps() {
    let elements = document.getElementsByClassName('panel');

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
    }
}

function setStepVisibility(idxToShow, idxToHide) {
    document.getElementById("panel-" + idxToHide).style.display = 'none';
    document.getElementById("panel-" + idxToShow).style.display = 'block';
}

var timerClicks = {};

function startTimer(duration, stepId, stepIdxToShow, async) {
    let timerPanelId = "panel-" + stepId
    let timerElement = document.getElementById(timerPanelId);
    if (timerClicks.hasOwnProperty(timerPanelId)) {
        timerClicks[timerPanelId] += 1
    } else {
        timerClicks[timerPanelId] = 0
    }

    if (timerElement && timerElement.getAttribute('class')) {
        let timerClass = timerElement.getAttribute('class');
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

    let originalTimerHtml = timerElement.innerHTML;
    let intervalID = window.setInterval(function () {
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
                playSound()
            }
        }
    }, 1000);
}

function loadTimer(seconds, stepId, stepIdxToShow, async) {
    startTimer(seconds, stepId, stepIdxToShow, async);
}

var shownId = '';

function getCheckedOptions() {
   var id = '';
   var htmlCollection = document.getElementById('options').getElementsByTagName('button')

   for (const item of htmlCollection) {
     if (item.classList[0] == 'completed') {
         id += item.innerHTML
     }
   }

   return id
}

// Used to hide/show recipes
function showRecipe() {
    var id = getCheckedOptions()

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
