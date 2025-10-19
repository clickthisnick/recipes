Human Initial:

```
I want an html page that has two tabs.

One will allow me to select multiple predefined foods that link to json nutritions attributes and will show me a table based on the foods I have selected of my nutrition needs versus the fda recommended limits

The other tab will allow me to input a food and the levels of various nutrients and it will return a json representation of the food that I can then add to my application and commit to github

This website will have no database what so ever it is so the user can track their nutrition


Can you create a prompt that AI would be able to clearly build the website for me
```


AI generated:


# Nutrition Tracker App Prompt

Build a **single-page HTML website** (SPA) with **no backend** or database — all functionality and data must be handled entirely on the **frontend using vanilla JavaScript**. The project should be written as a **single HTML file**, with structure (HTML), styling (CSS), and behavior (JS) kept cleanly organized within that file. No frameworks or libraries are allowed.

The site should be **functional**, **responsive**, and **modularly coded**, with basic accessibility and mobile support.

## Tabs

The interface should consist of **two main tabs**, switchable via buttons with JavaScript (no page reloads):

---

### Tab 1: Nutrition Tracker

**Title:** `Nutrition Tracker`

#### Features:
- Let the user select food items from a predefined list using a single `<select>` dropdown.
- When a food is selected:
  - Add it to a **"selected foods" list**.
  - Support **adding the same food multiple times** — quantities must be tracked.
  - Show a visual **tag-style list** of selected foods with:
    - The food name
    - The current quantity (e.g., "Raspberry Bar (x2)")
    - `+` and `-` buttons to increment or decrement quantity
    - If quantity reaches 0, remove the food from the list.
- A button labeled `Update Nutrition` recalculates and displays a table showing:
  - Total user nutrient intake (based on selected foods and quantities)
  - FDA recommended daily limits (hardcoded)
- The nutrients to track should be modular (e.g., stored in a constant like `['calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium']`) so it's easy to add/remove nutrients.
- Nutrient values must be **multiplied by the quantity** selected for each food.
- The summary table includes:
  - Nutrient name
  - User’s total intake
  - FDA daily limit

---

### Tab 2: Add Custom Food

**Title:** `Add Custom Food`

#### Features:
- A form that allows the user to input:
  - Food name (text)
  - Nutrient values (calories, protein, carbs, fat, fiber, sugar, sodium, etc.) as numbers
- All fields must be validated:
  - Required
  - No negative values
- On submission:
  - Show a pretty-printed JSON representation of the food object in a `<textarea>`
  - Include a button to `Copy to Clipboard`
- Below the form, include a helper message:
  > _"Copy this JSON and manually add it to your foods list in your app repo."_

---

## Technical Requirements

- All logic must be implemented in **vanilla JavaScript** — no frameworks (e.g., React, Vue, etc.).
- All data (predefined foods and FDA values) should be stored as **inline JavaScript objects**.
- The site must not reload when switching tabs.
- Responsive layout for mobile devices (e.g., stacked tabs on small screens).
- CSS styling should be clean and minimal — use Flexbox for layout where needed.
- Use semantic HTML where appropriate.
- The code should be modular and clean:
  - Nutrients list and FDA limits should be stored in constants
  - Avoid repetition where possible (e.g., when generating inputs or rows in tables)

---

## Example Food Data (in JS object format):

```js
const foodData = {
  raspberry_bar: {
    name: "Raspberry Bar",
    calories: 160,
    protein: 9,
    carbs: 4,
    fat: 12,
    fiber: 1,
    sugar: 1,
    sodium: 190
  },
  banana: { ... },
  // etc.
};
