#!/bin/bash

echo '<style>

    html {
        background-color: #000000;
    }

    h1 {
        color: #FFFFFF;
    }

    a {
        color: #D3D3D3;
    }

</style>' > index.html

echo '<h1><a href="https://www.clickthisnick.com/recipes/dist/main.html">Recipes</a></h1>' >> index.html
echo '<html><h1><a href="https://www.clickthisnick.com/recipes/meatTemp.html">Meat Temperature</a></h1>' >> index.html
echo '<h1><a href="https://www.clickthisnick.com/recipes/waterIntake.html">Water Intake</a></h1>' >> index.html
echo '<h1><a href="https://www.clickthisnick.com/recipes/groceryList.html">Grocery List</a></h1>' >> index.html
echo '<h1><a href="https://www.clickthisnick.com/recipes/expirationCalculator.html">Expiration Calculator</a></h1>' >> index.html
echo '<h1><a href="https://www.clickthisnick.com/recipes/cordSlicer.html">Pull Cord Slicer Amount</a></h1>' >> index.html
echo '<h1><a href="https://www.clickthisnick.com/recipes/frozenFood.html">Frozen Food Portions</a></h1>' >> index.html

