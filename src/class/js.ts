const recipes = {}
const selectedRecipes = []
const selectedRecipeGroupNames = []
const ingredients = {}
let mode = ''
const perishableItems = {}

function playSound(duration=4) {
    const audio = document.getElementById("beep")

    if (audio) {
        // overrides the empty sound already played on the object
        // this is so ios will asynchronously play the sounds
        if (duration == 4) {
            audio.src = "../src/sounds/pager-beep.mp3"
        } else {
            audio.src = "../src/sounds/1sec.m4a"
        }
        audio.play()
    }
}

/**
 * Parses a URL query string into a plain JavaScript object.
 *
 * - Single query parameters are returned as strings
 * - Repeated query parameters are returned as arrays of strings
 *
 * Examples:
 *   parseParams('?foo=1&bar=2')
 *   → { foo: '1', bar: '2' }
 *
 *   parseParams('?foo=1&foo=2&bar=3')
 *   → { foo: ['1', '2'], bar: '3' }
 *
 * @param {string} search - The URL query string (e.g. window.location.search)
 * @returns {Object<string, string | string[]>} Parsed query parameters
 */
const parseParams = (search) => {
  const params = new URLSearchParams(search);
  const result = {};

  for (const [key, value] of params) {
    if (key in result) {
      result[key] = [].concat(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

const queryString = parseParams(window.location.search)

function setRecipe(recipeGroupName, recipe) {
    // Setting the recipe data into the recipe
    if (recipes.hasOwnProperty(recipeGroupName) === false) {
        recipes[recipeGroupName] = []
    }
    recipes[recipeGroupName].push(recipe)
}

function removeAllClassNames(className) {
  document.querySelectorAll(`.${className}`).forEach(element => {
    element.className = '';
  });
}

function selectMode(id) {
    mode = id
    showElement(id)
    showElement('select')

    // Play the silent beep so ios lets us play it in the background later (after we change src)
    const audio = document.getElementById("beep")
    audio.play()

    hideElement('cookingButton')
    hideElement('shoppingButton')

    const url = new URL(window.location)

    url.searchParams.set("mode", mode)

    history.pushState({}, "", url)

    // This will make all the elements disappear by removing all the html/className
    // This is different than just setting the display to visible or non visible
    if (mode == 'cooking') {
        console.log('hoohohoh')
        hideElementsByClassName('hideFromCookingView')
        removeAllClassNames('hideFromCookingView')
    }
}

function deselectRecipe(recipeGroupName) {
    const idx = selectedRecipeGroupNames.indexOf(recipeGroupName);

    if (idx >= 0) {
        selectedRecipeGroupNames.splice(idx, 1);
        selectedRecipes.splice(idx, 1);
    }

    renderSelectedRecipes();
}

function renderSelectedRecipes() {
    // Show all the selected recipes
    let selectedRecipesHtml = ""
    for (let i =0; i < selectedRecipeGroupNames.length; i++) {
        let recipeGroup = selectedRecipeGroupNames[i]
        if (recipeGroup) {
            recipeGroup = recipeGroup.split("-")[1]
        }

        selectedRecipesHtml += `<button onclick="deselectRecipe('${selectedRecipeGroupNames[i]}')">${recipeGroup}</button>`
        selectedRecipesHtml += "<br>"
    }

    const selectedDiv = document.getElementById("selectedRecipeGroupNames")
    if (selectedDiv) {
        selectedDiv.innerHTML = selectedRecipesHtml
    }
    showElement('selected')
}

function setRecipesParamLast(recipesValue) {
  const url = new URL(window.location.href);

  // normalize to comma-separated string
  const recipesStr = Array.isArray(recipesValue)
    ? recipesValue.join(",")
    : String(recipesValue ?? "");

  // remove then append so it becomes the last param
  url.searchParams.delete("recipes");
  if (recipesStr) url.searchParams.append("recipes", recipesStr);

  history.pushState({}, "", url.toString());
}

function selectRecipe(recipeGroupName) {
    selectedRecipeGroupNames.push(recipeGroupName)
    selectedRecipes.push(recipes[recipeGroupName])

    // Set query param for recipe(s)
    setRecipesParamLast(recipeGroupName);

    renderSelectedRecipes()
}

/**
 * Adds a cooking step as a div panel to the #cooking container.
 *
 * Each step can:
 *   - Have a custom style
 *   - Trigger a timer via `loadTimer(time, id, disappearWhen)` on click
 *   - Toggle a 'timer' class and remove itself if no timer is required
 *   - Recursively add child steps
 *
 * @param {Object} istep - Step object containing the step data
 * @param {number|string} istep.id - Unique identifier for the step
 * @param {string} istep.text - Text content of the step
 * @param {string} [istep.style] - Optional CSS styles for the div
 * @param {boolean} [istep.showTimer] - Whether to show a timer
 * @param {number} [istep.time] - Timer duration (required if showTimer is true)
 * @param {string} [istep.disappearWhen] - Optional parameter for loadTimer
 * @param {Object[]} [istep.children] - Optional array of child steps
 * @returns {void}
 */
function addStep(istep) {
  const cookingDiv = document.getElementById('cooking');
  if (!cookingDiv) {
    alert('Cannot find cooking element with id "cooking"');
    return;
  }

  // Create the panel div
  const divStep = document.createElement('div');
  divStep.className = 'panel';
  divStep.id = `panel-${istep.id}`;

  if (istep.style) {
    divStep.style.cssText = istep.style;
  }

  // Add a span for the step ID
  const span = document.createElement('span');
  span.id = istep.id;
  divStep.appendChild(span);

  // Add the text content
  divStep.appendChild(document.createTextNode(istep.text));

  // Set click behavior
  if (istep.showTimer) {
    divStep.onclick = () => loadTimer(istep.time, istep.id, istep.disappearWhen);
  } else {
    divStep.onclick = () => {
      divStep.classList.toggle('timer');
      divStep.remove();
    };
  }

  // Append the panel to the cooking container
  cookingDiv.appendChild(divStep);

  // Recursively add child steps if any
  if (istep.children && istep.children.length > 0) {
    istep.children.forEach(addStep);
  }
}


/**
 * Generates a shopping URL based on the selected recipes and their ingredients,
 * then displays it in the element with ID "shoppingUrl".
 *
 * The generated URL includes:
 *   - `mode=shopping` as a fixed query parameter
 *   - `recipes` as a comma-separated list of selected recipe group names
 *   - Each ingredient as a query parameter in the format:
 *       ingredient=["unit", quantity]
 *     where both the ingredient and unit are URL-encoded.
 *
 * Example output:
 *   https://example.com?mode=shopping&recipes=Salad,Pasta&asparagus=["tsb", 1]&tomato=["cup", 2]
 *
 * @returns {void}
 */
function saveShoppingUrl() {
  // Base URL without query string
  const baseUrl = document.location.href.split('?')[0];

  // Start query parameters
  const params = new URLSearchParams();
  params.set('mode', 'shopping');
  params.set('recipes', selectedRecipeGroupNames);

  // Add each ingredient
  for (const [ingredient, data] of Object.entries(ingredients)) {
    const unit = Object.keys(data.units)[0];
    const quantity = data.units[unit];

    // Format as ["unit", quantity] and encode as string
    const value = `["${unit}", ${quantity}]`;
    params.set(ingredient, value);
  }

  const shoppingUrl = `${baseUrl}?${params.toString()}`;

  // Display the generated URL
  document.getElementById('shoppingUrl').innerHTML = shoppingUrl + '<br>';
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
  const discounts = {
    amazon: 0.95,
    whole: 0.95
  };

  const rate =
    Object.entries(discounts).find(([key]) =>
      store.startsWith(key)
    )?.[1] ?? 0.98;

  return (pricePerQuantity * rate).toFixed(3);
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

                    if (ingredient.perishableLimit > 0) {
                        perishableItems[ingredient.name] = ingredient.perishableLimit
                    }

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
        shoppingDiv.innerHTML += selectedRecipeGroupNames
        shoppingDiv.innerHTML += '<br> Perishable Items: '
        shoppingDiv.innerHTML += JSON.stringify(perishableItems)
        shoppingDiv.innerHTML += '<br>'
        shoppingDiv.innerHTML += `<button class="wholeFoodsToggle" onclick="hideElementsByClassName('store-filter'); showElementsByClassName('whole-foods-filter')">Whole Foods</button>`
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
                                        linkByPrice[subscribePricePerQuantity] = [`<span class="${store}-filter store-filter" ></br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${discountKey} ${subscribePricePerQuantity} - ${subscribePricePerQuantity}/${commonUnit}</a></span>`]
                                        priceKeys.push(subscribePricePerQuantity)
                                    } else {
                                        linkByPrice[subscribePricePerQuantity].push(`<span class="${store}-filter store-filter" ></br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${discountKey} ${subscribePricePerQuantity} - ${subscribePricePerQuantity}/${commonUnit}</a></span>`)
                                    }
                                })
                            }

                            pricePerQuantity = applyCreditCardDiscounts(store, pricePerQuantity)

                            if (!linkByPrice.hasOwnProperty(pricePerQuantity)) {
                                linkByPrice[pricePerQuantity] = [`<span class="${store}-filter store-filter" > </br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${item.price} - ${pricePerQuantity}/${commonUnit}</a></span>`]
                                priceKeys.push(pricePerQuantity)
                            } else {
                                linkByPrice[pricePerQuantity].push(`<span class="${store}-filter store-filter" > </br> ${store}: &nbsp;<a href="${item.link}" target="_blank">${storeDescription} - ${item.price} - ${pricePerQuantity}/${commonUnit}</a></span>`)
                            }



                        })
                    })

                    links = generateLinks(linkByPrice, priceKeys)
                })
            }

            shoppingDiv.innerHTML += '<div onclick="this.classList.toggle(' + "'completed'" + ');"' + 'id="shopping-' + ingredient.name + '" class="panel" style="">' + '<span' + "document.getElementById('shopping-" + ingredient.name  + "').remove(); delete ingredients['" + ingredient.name  + "'" + '];" >' + ingredient.name  + ' ' + ingredient.quantity + ' ' + ingredient.unit.name + '</span>' + links + '</div>'
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
  document
    .querySelectorAll(`.${className}`)
    .forEach(el => {
      el.style.display = "inline";
    });
}

function hideElementsByClassName(className) {
  document
    .querySelectorAll(`.${className}`)
    .forEach(el => {
      el.style.display = "none";
    });
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

function startTimer(duration, stepId, disappearWhen) {
    const timerPanelId = "panel-" + stepId
    const timerElement = document.getElementById(timerPanelId);

    // Toggle the timer if the class doesn't already have it
    // We only do this once
    if (!timerElement.classList.contains('timer')) {
        timerElement.classList.toggle('timer');
    }

    if (!timerElement) {
        throw new Error("timerElement is failed")
    }

    // If clicking an element that's already green
    if (timerElement.classList.contains('timerCompletedButShowing')) {
        timerElement.classList.toggle('timerCompletedButShowing');
        timerElement.classList.toggle('completed');
    }

    if (timerClicks.hasOwnProperty(timerPanelId)) {
        timerClicks[timerPanelId] += 1
    } else {
        timerClicks[timerPanelId] = 1
    }

    if (timerElement && timerElement.getAttribute('class')) {
        const timerClass = timerElement.getAttribute('class');
        if (timerClass && timerClass.includes('timer')) {
            // <!--If you click block 2 times after timer started, then you can skip-- >
            // We use 2 clicks because its easy to accidentally click one
            if (timerClicks[timerPanelId] >= 3) {
                document.getElementById(timerPanelId).style.display = 'none';
            } if (timerClicks[timerPanelId] >= 2) {
                // Do nothing aside from increment the counter on the 2nd click
                return
            }
        }
    }

    const originalTimerHtml = timerElement.innerHTML;
    const intervalID = window.setInterval(function () {
        let minutes = parseInt(duration / 60, 10)
        let seconds = parseInt(duration % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.innerHTML = minutes + ":" + seconds + " " + originalTimerHtml;

        if (--duration < 0) {
            if (disappearWhen == "timerIsUp") {
                timerElement.classList.toggle('timer');
                window.clearInterval(intervalID);
                timerElement.classList.toggle('completed');
                // if (async == false) {
                //     const timerPanelIdElement = document.getElementById(timerPanelId)
                //     if (timerPanelIdElement) {
                //         timerPanelIdElement.style.display = 'none';
                //     }

                //     // const panelStepIdxToShow = document.getElementById("panel-" + stepIdxToShow)
                //     // if (panelStepIdxToShow) {
                //     //     panelStepIdxToShow.style.display = 'block';
                //     // }
                // }

                if (document.getElementById(timerPanelId).style.display != 'none') {
                    // our end timers are always x2 our start timer id
                    document.getElementById(`panel-${stepId * 2}`)?.remove();
                    playSound()
                }
            } else if (disappearWhen == "clicked") {
                const ttimerPanelId = "panel-" + stepId
                const ttimerElement = document.getElementById(ttimerPanelId);

                console.log("panel-" + stepId)
                console.log(ttimerElement.style.display)
                console.log(ttimerElement.style)
                console.log(ttimerElement)

                if (!timerElement.classList.contains('completed')) {
                    if (!timerElement.classList.contains('timerCompletedButShowing')) {
                        timerElement.classList.toggle('timer');
                        timerElement.classList.toggle('timerCompletedButShowing');
                    }

                    playSound(1)
                } else {
                    // our end timers are always x2 our start timer id
                    // document.getElementById(`panel-${stepId * 2}`)?.remove();

                    window.clearInterval(intervalID);
                }
            }
        }
    }, 1000);
}

function loadTimer(seconds, stepId, disappearWhen) {
    startTimer(seconds, stepId, disappearWhen);
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
