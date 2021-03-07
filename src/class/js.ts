let recipeSteps = {}
let selectedRecipes = []
let selectedRecipeNames = []
let ingredients = {}
let mode = ''

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}

function generateHtml() {
    // Reset root incase we are dynamically doing things
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
};

let queryString = parseParams(window.location.search)

function setSteps(recipeName, steps) {
    if (recipeSteps.hasOwnProperty(recipeName) === false) {
        recipeSteps[recipeName] = []
    }
    recipeSteps[recipeName].push(steps)
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
    selectedRecipes.push(recipeSteps[recipeName])
}

function addIngredient(istep) {
    istep.ingredients.forEach(ingredient => {
        // Unit could be null, dont add ingredient whose unit is null - item('hamburger') is an example of that
        if (ingredient.unit !== null && ingredient.quantity > 0) {
            if (ingredients.hasOwnProperty(ingredient.name) === false) {
                ingredients[ingredient.name] = {}
                ingredients[ingredient.name]['units'] = {}

                if (ingredient.purchaseLinks) {
                    ingredients[ingredient.name]['purchaseLinks'] = ingredient.purchaseLinks
                } else {
                    ingredients[ingredient.name]['purchaseLinks'] = {}
                }
            }

            if (ingredients[ingredient.name]['units'].hasOwnProperty(ingredient.unit.name) === false) {
                ingredients[ingredient.name]['units'][ingredient.unit.name] = 0
            }

            ingredients[ingredient.name]['units'][ingredient.unit.name] += ingredient.quantity
        }
    })

    if (istep.children.length > 0) {
        istep.children.forEach(child => {
            addIngredient(child);
        })
    }
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

    if (istep.children.length > 0) {
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


function doneSelectingRecipes() {
    hideElement('select')
    let shoppingDiv = document.getElementById('shopping')

    if (mode === 'shopping') {
        // Get all ingredients across all recipes
        selectedRecipes.forEach(recipe => {
            recipe.forEach(istep => {
                addIngredient(istep);
            })
        })

        // Show ingredients to the user
        shoppingDiv.innerHTML += '<br>'
        shoppingDiv.innerHTML += selectedRecipeNames
        shoppingDiv.innerHTML += '<br>'

        Object.keys(ingredients).forEach(ingredient => {
            let links = ''

            // When you click a saved url we don't include the purchaseLinks
            if (ingredients[ingredient].hasOwnProperty('purchaseLinks')) {
                Object.keys(ingredients[ingredient]['purchaseLinks']).forEach(store => {
                    const storeLinks = ingredients[ingredient]['purchaseLinks'][store];

                    console.log(storeLinks);
                    storeLinks.forEach(storeLink => {
                        links += `&nbsp;<a href="${storeLink}" target="_blank">${store}</a>`
                    })
                })
            }

            Object.keys(ingredients[ingredient]['units']).forEach(unit => {
                // <!--On click it deletes the ingredient from the array of ingredients-- >
                // <!--TODO once you delete an ingredient it remove all types from the ingredient list-- >
                shoppingDiv.innerHTML += '<div id="shopping-' + ingredient + '" class="panel" style="">' + '<span onclick="this.classList.toggle(' + "'completed'" + "); document.getElementById('shopping-" + ingredient + "').remove(); delete ingredients['" + ingredient + "'" + '];" >' + ingredient + ' ' + ingredients[ingredient]['units'][unit] + ' ' + unit + '</span>' + links + '</div>'
            })
        })
    } else {
        selectedRecipes.forEach(recipe => {
            recipe.forEach(istep => {
                addStep(istep)
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
                playSound("../src/sounds/pager-beep.mp3")
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
