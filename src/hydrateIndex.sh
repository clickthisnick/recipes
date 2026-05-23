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

echo '<h1><a href="./dist/main.html">Recipes</a></h1>' >> index.html
echo '<h1><a href="./meatTemp.html">Meat Temperature</a></h1>' >> index.html
echo '<h1><a href="./waterIntake.html">Water Intake</a></h1>' >> index.html
echo '<h1><a href="./groceryList.html">Grocery List</a></h1>' >> index.html
echo '<h1><a href="./expirationCalculator.html">Expiration Calculator</a></h1>' >> index.html
echo '<h1><a href="./cordSlicer.html">Pull Cord Slicer Amount</a></h1>' >> index.html
echo '<h1><a href="./frozenFood.html">Frozen Food Portions</a></h1>' >> index.html
