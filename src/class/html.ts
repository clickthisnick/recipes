export class HTML {
    public static headerStart = '<h1>';
    public static headerEnd = '</h1>';
    public static mobileViewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
    public static chartSet = '<meta charset="utf-8">';
    public static css = `<style>

    html {
        background-color: #000000;
    }

    div, h1, h2 {
        background-color: #000000;
        border: none;
        color: #FFFFFF;
    }

    button {
        display: inline-block;
        border-radius: 4px;
        background-color: #f4511e;
        border: none;
        color: #FFFFFF;
        text-align: center;
        font-size: 28px;
        padding: 20px;
        width: 400px;
        transition: all 0.5s;
        cursor: pointer;
        margin: 5px;
    }

    #ingredients {
        
    }

    .completed {
        background-color:green;
        color: white;
        display: none;
    }

    .timer {
        background-color:yellow;
        color: black;
    }

    .panel {
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;
        padding: 25px;
        border-width: 1px;
    }
    </style>`;

    public static javascript = `
       <script>
          let recipeSteps = {}
          let selectedRecipes = []
          let selectedRecipeNames = []
          let ingredients = {}
          let mode = ''
          
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

          function generateHtml() {
              // Reset root incase we are dynamically doing things
              let root = document.getElementById('root')
              root.innerHTML = ''

            // recipeSteps.forEach(step => {
            //     root.innerHTML += step.text
            //     root.innerHTML += '<br>'
            // })
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
                        }

                        if (ingredients[ingredient.name].hasOwnProperty(ingredient.unit.name) === false) {
                            ingredients[ingredient.name][ingredient.unit.name] = 0
                        }
    
                        ingredients[ingredient.name][ingredient.unit.name] += ingredient.quantity
                    }
                })

                if (istep.children.length > 0) {
                    istep.children.forEach(child => {
                        addIngredient(child);
                    })
                }  
          }

          function addStep(istep) {
                if (istep.showTimer) {
                    document.getElementById('cooking').innerHTML += '<div class="panel" id="panel-' + istep.id + '" onclick="this.classList.toggle(' + "'timer'" + '); loadTimer(' + istep.duration * 1000 + ', ' + istep.id + '); document.getElementById("panel-' + istep.id + '").remove();"><span id="' + istep.id + '"></span>' + istep.text + '</div>';
                } else {
                    document.getElementById('cooking').innerHTML += '<div id="panel-0" class="panel" style="" onclick="this.classList.toggle(' + "'completed'" + '); document.getElementById("panel-' + istep.id + '").remove();" >' + istep.text + '</div>'
                }

                if (istep.children.length > 0) {
                    istep.children.forEach(child => {
                        addStep(child);
                    })
                }  
          }

          function saveShoppingUrl() {
              <!-- Converts ingredients to a url with query parameters -->
              <!-- query parameters = ?mode=shopping&asparagus=["tsb",%201] -->
              <!-- ingredients = {asparagus: {tsb: 1}} -->
              let queryParamter = document.location.href.split('?')[0] + '?mode=shopping' + '&recipes=' + selectedRecipeNames
              Object.keys(ingredients).forEach(ingredient => {
                  let unit = Object.keys(ingredients[ingredient])[0]
                  <!-- url encode - example - replace any spaces with %20 -->
                  queryParamter += '&' + encodeURI(ingredient) + '=["' + unit + '", %20' + ingredients[ingredient][unit] + ']'
              })

              
              document.getElementById('shoppingUrl').innerHTML = queryParamter + "<br>"
          }


        function doneSelectingRecipes() {
            hideElement('select')

            if (mode === 'shopping') {
                // Get all ingredients across all recipes
                selectedRecipes.forEach(recipe => {
                    recipe.forEach(istep => {
                        addIngredient(istep);
                    })
                })
    
                // Show ingredients to the user
                document.getElementById('shopping').innerHTML += '<br>'
                document.getElementById('shopping').innerHTML += selectedRecipeNames
                document.getElementById('shopping').innerHTML += '<br>'

                Object.keys(ingredients).forEach(ingredient => {
                    Object.keys(ingredients[ingredient]).forEach(unit => {
                        <!-- On click it deletes the ingredient from the array of ingredients -->
                        <!-- TODO once you delete an ingredient it remove all types from the ingredient list -->
                        document.getElementById('shopping').innerHTML += '<div id="shopping-' + ingredient + '" class="panel" style="" onclick="this.classList.toggle(' + "'completed'" + "); document.getElementById('shopping-" + ingredient + "').remove(); delete ingredients['" + ingredient + "'" + '];" >' + ingredient + ' ' + ingredients[ingredient][unit] + ' ' + unit + '</div>'
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
            document.getElementById(id).style.display="inline"
          }

          function hideElement(id) {
            document.getElementById(id).style.display="none"
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

           ingredientDiv.style.display='inline'
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

       function startTimer(duration, timerNum, timerStepIdx, stepIdxToShow, async) {
           let timerPanelId = "panel-" + timerStepIdx
           let timerElement = document.getElementById(timerPanelId);
           if (timerClicks.hasOwnProperty(timerPanelId)) {
            timerClicks[timerPanelId] += 1
           } else {
            timerClicks[timerPanelId] = 0
           }

           if (timerElement.getAttribute('class').includes('timer')) {
               <!-- If you click block 2 times after timer started, then you can skip -->
               if (timerClicks[timerPanelId] >= 2) { 
                   <!-- Only show next element if not an async timer -->
                  if (async == false) { 
                    document.getElementById("panel-" + stepIdxToShow).style.display = 'block';
                  }
                  document.getElementById(timerPanelId).style.display = 'none';
               }

               return
           } else {
            document.getElementById(timerPanelId).classList.toggle('timer')
           }

           if (async) {
              document.getElementById("panel-" + stepIdxToShow).style.display = 'block';
           }

          var timerId = '#' + timerNum;
          var display = document.querySelector(timerId);
          var timer = duration, minutes, seconds;
          var intervalID = window.setInterval(function () {
               minutes = parseInt(timer / 60, 10)
               seconds = parseInt(timer % 60, 10);

               minutes = minutes < 10 ? "0" + minutes : minutes;
               seconds = seconds < 10 ? "0" + seconds : seconds;

               display.textContent = minutes + ":" + seconds + " ";

               if (--timer < 0) {
                   window.clearInterval(intervalID);
                   timerElement.classList.toggle('timer');
                   timerElement.classList.toggle('completed');
                   if (async == false) { 
                      document.getElementById(timerPanelId).style.display = 'none';
                      document.getElementById("panel-" + stepIdxToShow).style.display = 'block';
                   }
               }
           }, 1000);
       }

       function loadTimer(seconds, timerNum, timerStepIdx, stepIdxToShow, async) {
          seconds = seconds / 1000;

          startTimer(seconds, timerNum, timerStepIdx, stepIdxToShow, async);
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

            // console.log(id);

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

       </script>
    `;

    public static addOptions(recipeIds: string[], onlyOneVariation) {
        // Adds each option
        // default will get set when
        let tmpHtml = '';

        recipeIds.forEach((recipeId) => {
            if (onlyOneVariation) {
                // If there is only one option don't display the button
                tmpHtml += `<button style="display: none;" onclick="this.classList.toggle('completed'); showRecipe()">${recipeId}</button>`;
            } else {
                tmpHtml += `<button onclick="this.classList.toggle('completed'); showRecipe()">${recipeId}</button>`;
            }
        });

        return tmpHtml;

    }

    public static generateOptions(recipeIds: string[], onlyOneVariation) {
        return this.addOptions(recipeIds, onlyOneVariation);
    }
         // TODO: Could add a sound but browsers won't allow it like this
         // function beep() {
         // tslint:disable-next-line max-line-length
         //  var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
         //  snd.play();
         // }
}
