Human Initial:

```
I want an html page that has two tabs.

One will allow me to select multiple predefined foods that link to json nutritions attributes and will show me a table based on the foods I have selected of my nutrition needs versus the fda recommended limits

The other tab will allow me to input a food and the levels of various nutrients and it will return a json representation of the food that I can then add to my application and commit to github

This website will have no database what so ever it is so the user can track their nutrition


Can you create a prompt that AI would be able to clearly build the website for me
```


AI generated:

```
Build a single-page HTML website with no backend or database — everything must be handled on the front end with JavaScript. The site should have two tabs, styled with basic CSS. The site should be functional, responsive, and cleanly organized.
Tab 1: Nutrition Tracker
Title: "Nutrition Tracker"
Allow the user to select multiple foods from a predefined list (like a <select> element with multiple selection).
Each food item should link to a corresponding JSON object containing its nutritional data (e.g., calories, protein, fat, fiber, sugar, sodium, vitamins, etc.).
After selecting one or more foods, display a summary table comparing:
User's total intake (sum of nutrients of all selected foods)
FDA daily recommended limits side by side
The FDA recommended values can be hardcoded (e.g., 2000 kcal, 50g protein, etc.)
Tab 2: Add Custom Food
Title: "Add Custom Food"
Allow the user to input:
Food name
Nutrient values (calories, protein, carbs, fat, fiber, sugar, sodium, etc.)
On form submission, display a JSON representation of the food input.
Include a "Copy to Clipboard" button to copy the JSON.
(Optional) Include instructions like: “Copy this JSON and manually add it to your foods list in your app repo.”
Requirements:
Do not use any databases or servers — all data lives in the frontend.
Use vanilla JavaScript, no frameworks like React or Vue.
Prefer to put everything into a single file.
Use modular, clean code, ideally separating structure (HTML), style (CSS), and logic (JavaScript).
Predefined foods and FDA values can be stored in a foods.js or inline JSON structure.
The page should not reload when switching tabs — use JavaScript to handle tab switching.
Include basic accessibility and mobile responsiveness.
Validate input on the custom food form (no negative numbers, required fields, etc.)
```
