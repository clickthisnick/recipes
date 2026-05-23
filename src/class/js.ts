const appState = {
    recipes: {},
    selectedRecipeGroupNames: [],
    ingredients: {},
    perishableItems: {},
    timerClicks: {},
    mode: '',
    shownRecipeId: '',
};

document.addEventListener(
    'click',
    () => {
        unlockAudio();
    },
    { once: true }
);

/* -----------------------------
 * DOM helpers
 * ----------------------------- */

function getById(id) {
    return document.getElementById(id);
}

function showElement(id, display = 'inline') {
    getById(id)?.style.setProperty('display', display);
}

function hideElement(id) {
    getById(id)?.style.setProperty('display', 'none');
}

function showElementsByClassName(className, display = 'inline') {
    document.querySelectorAll(`.${className}`).forEach((element) => {
        element.style.display = display;
    });
}

function hideElementsByClassName(className) {
    document.querySelectorAll(`.${className}`).forEach((element) => {
        element.style.display = 'none';
    });
}

function removeClassFromAll(className) {
    document.querySelectorAll(`.${className}`).forEach((element) => {
        element.classList.remove(className);
    });
}

function clearElement(id) {
    const element = getById(id);

    if (element) {
        element.innerHTML = '';
    }
}

function appendText(parent, text) {
    parent.appendChild(document.createTextNode(text));
}

function appendBreak(parent) {
    parent.appendChild(document.createElement('br'));
}

/* -----------------------------
 * Audio
 * ----------------------------- */

function getAudioElement() {
    const audio = getById('beep');

    if (!audio) {
        console.log('❌ No audio element found');
        return null;
    }

    return audio;
}

function unlockAudio() {
    const audio = getAudioElement();

    if (!audio) return;

    console.log('👆 User interaction detected, attempting unlock...');

    audio
        .play()
        .then(() => {
            console.log('✅ Audio unlocked successfully');

            audio.pause();
            audio.currentTime = 0;
        })
        .catch((err) => {
            console.log('❌ Unlock failed:', err.name, err.message);
        });
}

function playSound(duration = 4) {
    const audio = getAudioElement();

    if (!audio) return;

    audio.src =
        duration === 4
            ? '../src/sounds/pager-beep.mp3'
            : '../src/sounds/1sec.m4a';

    console.log('Full URL:', audio.src);

    audio.load();

    audio
        .play()
        .then(() => {
            console.log('✅ Sound played');
        })
        .catch((err) => {
            console.log('❌ Play failed:', err.name, err.message);
        });
}

/* -----------------------------
 * URL helpers
 * ----------------------------- */

function parseParams(search) {
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
}

const queryString = parseParams(window.location.search);

function updateUrlParam(key, value) {
    const url = new URL(window.location.href);

    url.searchParams.set(key, value);

    history.pushState({}, '', url.toString());
}

function setRecipesParamLast(recipeGroupNames) {
    const url = new URL(window.location.href);
    const recipesValue = recipeGroupNames.join(',');

    url.searchParams.delete('recipes');

    if (recipesValue) {
        url.searchParams.append('recipes', recipesValue);
    }

    history.pushState({}, '', url.toString());
}

/* -----------------------------
 * Recipe state
 * ----------------------------- */


function getSelectedRecipes() {
    return appState.selectedRecipeGroupNames.flatMap((recipeGroupName) => {
        return appState.recipes[recipeGroupName] ?? [];
    });
}

function selectRecipe(recipeGroupName) {
    if (!appState.recipes[recipeGroupName]) {
        console.log(`❌ Recipe group not found: ${recipeGroupName}`);
        return;
    }

    if (!appState.selectedRecipeGroupNames.includes(recipeGroupName)) {
        appState.selectedRecipeGroupNames.push(recipeGroupName);
    }

    setRecipesParamLast(appState.selectedRecipeGroupNames);
    renderSelectedRecipes();
}

function deselectRecipe(recipeGroupName) {
    appState.selectedRecipeGroupNames = appState.selectedRecipeGroupNames.filter(
        (selectedRecipeGroupName) => selectedRecipeGroupName !== recipeGroupName
    );

    setRecipesParamLast(appState.selectedRecipeGroupNames);
    renderSelectedRecipes();
}

function getRecipeDisplayName(recipeGroupName) {
    if (!recipeGroupName) return '';

    return recipeGroupName.split('-')[1] ?? recipeGroupName;
}

function renderSelectedRecipes() {
    const selectedDiv = getById('selectedRecipeGroupNames');

    if (!selectedDiv) return;

    selectedDiv.innerHTML = '';

    appState.selectedRecipeGroupNames.forEach((recipeGroupName) => {
        const button = document.createElement('button');

        button.textContent = getRecipeDisplayName(recipeGroupName);

        button.addEventListener('click', () => {
            deselectRecipe(recipeGroupName);
        });

        selectedDiv.appendChild(button);
        appendBreak(selectedDiv);
    });

    showElement('selected');
}

/* -----------------------------
 * Mode
 * ----------------------------- */

function selectMode(id) {
    appState.mode = id;

    showElement(id);
    showElement('select');

    unlockAudio();

    hideElement('cookingButton');
    hideElement('shoppingButton');

    updateUrlParam('mode', appState.mode);

    if (appState.mode === 'cooking') {
        hideElementsByClassName('hideFromCookingView');
        removeClassFromAll('hideFromCookingView');
    }
}

/* -----------------------------
 * Cooking steps
 * ----------------------------- */

function addStep(step) {
    const cookingDiv = getById('cooking');

    if (!cookingDiv) {
        alert('Cannot find cooking element with id "cooking"');
        return;
    }

    const stepPanel = document.createElement('div');

    stepPanel.className = 'panel';
    stepPanel.id = `panel-${step.id}`;

    if (step.style) {
        stepPanel.style.cssText = step.style;
    }

    const stepIdSpan = document.createElement('span');
    stepIdSpan.id = step.id;

    stepPanel.appendChild(stepIdSpan);
    appendText(stepPanel, step.text);

    if (step.showTimer) {
        stepPanel.addEventListener('click', () => {
            loadTimer(step.time, step.id, step.disappearWhen);
        });
    } else {
        stepPanel.addEventListener('click', () => {
            stepPanel.classList.toggle('timer');
            stepPanel.remove();
        });
    }

    cookingDiv.appendChild(stepPanel);

    if (Array.isArray(step.children)) {
        step.children.forEach(addStep);
    }
}

function renderCookingSteps() {
    const cookingDiv = getById('cooking');

    if (!cookingDiv) return;

    cookingDiv.innerHTML = '';

    getSelectedRecipes().forEach((recipe) => {
        recipe.steps.forEach(addStep);
    });
}

/* -----------------------------
 * Shopping state
 * ----------------------------- */

function resetShoppingState() {
    appState.ingredients = {};
    appState.perishableItems = {};
}

function addIngredientToShoppingList(ingredient) {
    if (ingredient.perishableLimit > 0) {
        appState.perishableItems[ingredient.name] = ingredient.perishableLimit;
    }

    const existingIngredient = appState.ingredients[ingredient.name];

    if (!existingIngredient) {
        appState.ingredients[ingredient.name] = { ...ingredient };
        return;
    }

    if (existingIngredient.unit.name === ingredient.unit.name) {
        existingIngredient.quantity += ingredient.quantity;
        return;
    }

    appState.ingredients[`${ingredient.name} ${ingredient.unit.name}`] = {
        ...ingredient,
    };
}

function buildShoppingStateFromSelectedRecipes() {
    resetShoppingState();

    getSelectedRecipes().forEach((recipe) => {
        Object.values(recipe.ingredients).forEach(addIngredientToShoppingList);
    });
}

/* -----------------------------
 * Shopping links
 * ----------------------------- */

function applyCreditCardDiscounts(store, pricePerQuantity) {
    const discounts = {
        amazon: 0.95,
        whole: 0.95,
    };

    const discountRate =
        Object.entries(discounts).find(([storePrefix]) =>
            store.startsWith(storePrefix)
        )?.[1] ?? 0.98;

    return (Number(pricePerQuantity) * discountRate).toFixed(3);
}

function addPriceLink(linkByPrice, priceKeys, price, html) {
    if (!linkByPrice[price]) {
        linkByPrice[price] = [];
        priceKeys.push(price);
    }

    linkByPrice[price].push(html);
}

function generateLinks(linkByPrice, priceKeys) {
    return priceKeys
        .sort((a, b) => Number(a) - Number(b))
        .flatMap((priceKey) => linkByPrice[priceKey])
        .join('');
}

function getIngredientLinksHtml(ingredient) {
    if (!ingredient.purchaseLinks) {
        return '';
    }

    let commonUnit;
    const linkByPrice = {};
    const priceKeys = [];

    Object.keys(ingredient.purchaseLinks)
        .sort()
        .forEach((store) => {
            const storeLinks = ingredient.purchaseLinks[store];

            Object.keys(storeLinks).forEach((storeDescription) => {
                const items = storeLinks[storeDescription];

                items.forEach((item) => {
                    if (!commonUnit) {
                        commonUnit = item.quantity_unit.name;
                    }

                    const basePricePerQuantity =
                        item.priceConversionTable[commonUnit];

                    if (item.discount) {
                        Object.entries(item.discount).forEach(
                            ([discountName, discountValue]) => {
                                const discountMultiplier =
                                    (100 - discountValue) * 0.01;

                                const discountedPrice = applyCreditCardDiscounts(
                                    store,
                                    Number(basePricePerQuantity) * discountMultiplier
                                );

                                addPriceLink(
                                    linkByPrice,
                                    priceKeys,
                                    discountedPrice,
                                    createStoreLinkHtml({
                                        store,
                                        storeDescription,
                                        label: discountName,
                                        item,
                                        priceText: discountedPrice,
                                        commonUnit,
                                    })
                                );
                            }
                        );
                    }

                    const finalPrice = applyCreditCardDiscounts(
                        store,
                        basePricePerQuantity
                    );

                    addPriceLink(
                        linkByPrice,
                        priceKeys,
                        finalPrice,
                        createStoreLinkHtml({
                            store,
                            storeDescription,
                            label: item.price,
                            item,
                            priceText: finalPrice,
                            commonUnit,
                        })
                    );
                });
            });
        });

    return generateLinks(linkByPrice, priceKeys);
}

function createStoreLinkHtml({
    store,
    storeDescription,
    label,
    item,
    priceText,
    commonUnit,
}) {
    return `
        <span class="${store}-filter store-filter">
            <br>
            ${store}: &nbsp;
            <a href="${item.link}" target="_blank">
                ${storeDescription} - ${label} - ${priceText}/${commonUnit}
            </a>
        </span>
    `;
}

/* -----------------------------
 * Shopping rendering
 * ----------------------------- */

function renderShoppingHeader(shoppingDiv) {
    appendBreak(shoppingDiv);

    appendText(shoppingDiv, appState.selectedRecipeGroupNames.join(', '));
    appendBreak(shoppingDiv);

    appendText(shoppingDiv, 'Perishable Items: ');
    appendText(shoppingDiv, JSON.stringify(appState.perishableItems));
    appendBreak(shoppingDiv);

    const wholeFoodsButton = document.createElement('button');

    wholeFoodsButton.className = 'wholeFoodsToggle';
    wholeFoodsButton.textContent = 'Whole Foods';

    wholeFoodsButton.addEventListener('click', () => {
        hideElementsByClassName('store-filter');
        showElementsByClassName('whole-foods-filter');
    });

    shoppingDiv.appendChild(wholeFoodsButton);
    appendBreak(shoppingDiv);
}

function renderShoppingIngredient(shoppingDiv, ingredientKey, ingredient) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = `shopping-${ingredientKey}`;

    panel.addEventListener('click', () => {
        panel.classList.toggle('completed');
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';

    removeButton.addEventListener('click', (event) => {
        event.stopPropagation();

        panel.remove();
        delete appState.ingredients[ingredientKey];
    });

    const text = document.createTextNode(
        ` ${ingredient.name} ${ingredient.quantity} ${ingredient.unit.name}`
    );

    const linksWrapper = document.createElement('span');
    linksWrapper.innerHTML = getIngredientLinksHtml(ingredient);

    panel.appendChild(removeButton);
    panel.appendChild(text);
    panel.appendChild(linksWrapper);

    shoppingDiv.appendChild(panel);
}

function renderShoppingList() {
    const shoppingDiv = getById('shopping');

    if (!shoppingDiv) {
        console.log('❌ No shopping element found');
        return;
    }

    shoppingDiv.innerHTML = '';

    buildShoppingStateFromSelectedRecipes();
    renderShoppingHeader(shoppingDiv);

    Object.entries(appState.ingredients).forEach(([ingredientKey, ingredient]) => {
        renderShoppingIngredient(shoppingDiv, ingredientKey, ingredient);
    });
}

function saveShoppingUrl() {
    const baseUrl = document.location.href.split('?')[0];
    const params = new URLSearchParams();

    params.set('mode', 'shopping');
    params.set('recipes', appState.selectedRecipeGroupNames.join(','));

    Object.entries(appState.ingredients).forEach(([ingredientName, ingredient]) => {
        if (!ingredient.units) return;

        const unit = Object.keys(ingredient.units)[0];
        const quantity = ingredient.units[unit];

        params.set(ingredientName, `["${unit}", ${quantity}]`);
    });

    const shoppingUrl = `${baseUrl}?${params.toString()}`;
    const shoppingUrlDiv = getById('shoppingUrl');

    if (shoppingUrlDiv) {
        shoppingUrlDiv.innerHTML = `${shoppingUrl}<br>`;
    }
}

/* -----------------------------
 * Main flow
 * ----------------------------- */

function doneSelectingRecipes() {
    hideElement('select');
    hideElement('selected');
    showElement('shoppingListButton');

    if (appState.mode === 'shopping') {
        renderShoppingList();
        return;
    }

    renderCookingSteps();
}

/* -----------------------------
 * Timers
 * ----------------------------- */

function setStepVisibility(idToShow, idToHide) {
    hideElement(`panel-${idToHide}`);
    showElement(`panel-${idToShow}`, 'block');
}

function incrementTimerClicks(timerPanelId) {
    appState.timerClicks[timerPanelId] =
        (appState.timerClicks[timerPanelId] ?? 0) + 1;

    return appState.timerClicks[timerPanelId];
}

function startTimer(duration, stepId, disappearWhen) {
    const timerPanelId = `panel-${stepId}`;
    const timerElement = getById(timerPanelId);

    if (!timerElement) {
        throw new Error(`Missing timer element: ${timerPanelId}`);
    }

    timerElement.classList.add('timer');

    if (timerElement.classList.contains('timerCompletedButShowing')) {
        timerElement.classList.remove('timerCompletedButShowing');
        timerElement.classList.add('completed');
    }

    const clickCount = incrementTimerClicks(timerPanelId);

    if (clickCount >= 3) {
        timerElement.style.display = 'none';
    }

    if (clickCount >= 2) {
        return;
    }

    const originalTimerHtml = timerElement.innerHTML;

    const intervalId = window.setInterval(() => {
        renderTimerText(timerElement, duration, originalTimerHtml);

        duration -= 1;

        if (duration < 0) {
            handleTimerFinished({
                intervalId,
                timerElement,
                stepId,
                disappearWhen,
            });
        }
    }, 1000);
}

function renderTimerText(timerElement, duration, originalTimerHtml) {
    const minutes = String(parseInt(duration / 60, 10)).padStart(2, '0');
    const seconds = String(parseInt(duration % 60, 10)).padStart(2, '0');

    timerElement.innerHTML = `${minutes}:${seconds} ${originalTimerHtml}`;
}

function handleTimerFinished({
    intervalId,
    timerElement,
    stepId,
    disappearWhen,
}) {
    if (disappearWhen === 'timerIsUp') {
        timerElement.classList.remove('timer');
        timerElement.classList.add('completed');

        window.clearInterval(intervalId);

        if (timerElement.style.display !== 'none') {
            getById(`panel-${stepId * 2}`)?.remove();
            playSound();
        }

        return;
    }

    if (disappearWhen === 'clicked') {
        if (!timerElement.classList.contains('completed')) {
            timerElement.classList.remove('timer');
            timerElement.classList.add('timerCompletedButShowing');

            playSound(1);
            return;
        }

        window.clearInterval(intervalId);
    }
}

function loadTimer(seconds, stepId, disappearWhen) {
    startTimer(seconds, stepId, disappearWhen);
}

/* -----------------------------
 * Recipe visibility
 * ----------------------------- */

function getCheckedOptions() {
    const options = getById('options');

    if (!options) return '';

    return [...options.getElementsByTagName('button')]
        .filter((button) => button.classList.contains('completed'))
        .map((button) => button.innerHTML)
        .join('');
}

function showRecipe() {
    const id = getCheckedOptions();

    showElement(id, 'block');

    if (appState.shownRecipeId) {
        hideElement(appState.shownRecipeId);
    }

    appState.shownRecipeId = id;
}

/* -----------------------------
 * Temporary global exports
 *
 * These make it easier to wire old HTML later.
 * We can remove these once nothing relies on globals.
 * ----------------------------- */

window.appState = appState;
window.queryString = queryString;

window.selectRecipe = selectRecipe;

window.showRecipe = showRecipe;
window.loadTimer = loadTimer;
window.startTimer = startTimer;
window.playSound = playSound;