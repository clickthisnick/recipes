import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class AnimalItems {
    private static createFactory =
        (name: string, overrides: Partial<IItemObj> = {}) =>
        (quantity = 0, unit: IUnitObj = Units.none) =>
            Ingredient.makeItem(name, quantity, unit, {
                isMeatProduct: true,
                ...overrides,
            });

    public static readonly gelatin = this.createFactory('Gelatin');

    public static readonly flankSteak = this.createFactory('Flank Steak');

    public static readonly groundBeef = this.createFactory('Ground Beef');

    public static readonly BeefEyeRoundSteak = this.createFactory('Beef Eye Round Steak');

    public static readonly groundBeef8020 = this.createFactory('Ground Beef 80/20', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 4.99,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/Beef-Ground-80-20-Step/dp/B078B25WMD/ref=sr_1_5_0o_wf',
                        organic: false,
                    },
                ],
            },
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 3.49,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/216270/wegmans-ground-beef-80-20-family-pack',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly premadePizza = this.createFactory('Premade Pizza', {
        purchaseLinks: {
            [Stores.wegmans]: {
                cheese: [
                    {
                        price: 13.79,
                        quantity: 33,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/31038/wegmans-fully-cooked-packaged-cheese-pizza-heat-serve',
                        organic: false,
                    },
                ],
                pepperoni: [
                    {
                        price: 16.09,
                        quantity: 35,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/31143/wegmans-fully-cooked-packaged-pepperoni-pizza-heat-serve',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                cheese: [
                    {
                        price: 9.99,
                        quantity: 34.25,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Whole-Foods-Market-Prepared-Cheese/dp/B08DK3X7Y3/ref=sr_1_4_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly londonBroil = this.createFactory('London Broil');

    public static readonly spiralCutHam = this.createFactory('Spiral Cut Ham', {
        nutrition: {
            [u.ounce.name]: {
                calories: 46.666666666666667,
                sodium: 320,
                total_cost: 0.249375,
            },
        },
    });

    public static readonly topSirloin = this.createFactory('Top Sirloin');

    public static readonly babyBackRibs = this.createFactory('Baby Back Ribs');

    public static readonly sausageAidellsCajun = this.createFactory('Aidells Cajun Sausage', {
        nutrition: {
            [u.unit.name]: {
                calories: 160,
                sodium: 690,
            },
        },
    });

    public static readonly chickenDrumsticks = this.createFactory('Chicken Drumsticks', {
        purchaseLinks: {
            [Stores.wegmans]: {
                organic: [
                    {
                        price: 1.19,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/54787/wegmans-chicken-drumsticks-family-pack',
                        organic: false,
                    },
                ],
            },
        },
        perishableLimit: 7,
    });

    public static readonly chickenBreast = this.createFactory('Chicken Breast', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 2.29,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/2584/wegmans-boneless-skinless-chicken-breasts-with-rib-meat-family-pack',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 3.99,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/365-Everyday-Value-Boneless-Skinless/dp/B0787Y555X/ref=sr_1_4_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
        perishableLimit: 7,
    });

    public static readonly chickenThigh = this.createFactory('Chicken Thigh', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 4.99,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/365-Everyday-Value-Boneless-Skinless/dp/B0787WHRNP',
                        organic: false,
                    },
                ],
            },
        },
        perishableLimit: 7,
    });

    public static readonly chickenLiver = this.createFactory('Chicken Liver');

    public static readonly chickenHeart = this.createFactory('Chicken Heart');

    public static readonly chickenStock = this.createFactory('Chicken Stock');

    public static readonly halfAndHalf = this.createFactory('Half and Half');

    public static readonly collagenPeptides = this.createFactory('Collagen Peptides');

    public static readonly pepperedSalami = this.createFactory('Peppered Salami');

    public static readonly salmon = this.createFactory('Salmon');

    public static readonly frozenChickenWings = this.createFactory('Frozen Chicken Wings');

    public static readonly homemadeItalianSausage = this.createFactory('Homemade Italian Sausage');

    public static readonly sausage = this.createFactory('Sausage');

    public static readonly mayonaise = this.createFactory('Mayonaise');

    public static readonly italianSausage = this.createFactory('Italian Sausage', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 4.49,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/12224/wegmans-italian-classics-hot-italian-sausage-family-pack',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 5.99,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/Sausage-Pork-Bulk-Italian-Mild/dp/B0787Z4BLG/ref=sr_1_3_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly mozzarellaCheese = this.createFactory('Mozzarella Cheese', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 6.49,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/365-Everyday-Value-Mozzarella-Shred/dp/B074H5SS4J/ref=sr_1_3_0o_wf',
                        organic: false,
                    },
                ],
            },
            [Stores.wegmans]: {
                organic: [
                    {
                        price: 14.99,
                        quantity: 80,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/5146/wegmans-cheese-mozzarella-part-skim-low-moisture-shredded-family-pack',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly ricottaCheese = this.createFactory('Ricotta Cheese');

    public static readonly plainYogurt = this.createFactory('Plain Yogurt');

    public static readonly parmesanCheese = this.createFactory('Parmesan Cheese', {
        purchaseLinks: {
            [Stores.wegmans]: {
                shredded: [
                    {
                        price: 2.79,
                        quantity: 6,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/17248/wegmans-fancy-shredded-parmesan-cheese',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                shredded: [
                    {
                        price: 3.99,
                        quantity: 5,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Shredded-Parmesan/dp/B074H51Q58',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly cheddarCheese = this.createFactory('Cheddar Cheese', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 16.09,
                        quantity: 80,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/5204/wegmans-cheese-cheddar-mild-shredded-family-pack',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly pepperJackCheese = this.createFactory('Pepper Jack Cheese', {
        cleanSteps: 'Put pepper jack cheese back in refrigerator',
    });

    public static readonly montereyJackCheese = this.createFactory('Monterey Jack Cheese', {
        cleanSteps: 'Put monterey cheese back in refrigerator',
    });

    public static readonly porkRoast = this.createFactory('Pork Roast');

    public static readonly porkChops = this.createFactory('Pork Chops', {
        perishableLimit: 7,
    });

    public static readonly bonelessRibClubSteak = this.createFactory('Boneless Rib Club Steak');

    public static readonly egg = this.createFactory('Egg', {
        cleanSteps: 'Put eggs back in refrigerator',
        perishableLimit: 14,
        purchaseLinks: {
            [Stores.wegmans]: {
                'conventional - 3 dozed': [
                    {
                        price: 5.79,
                        quantity: 36,
                        quantity_unit: u.unit,
                        link: 'https://shop.wegmans.com/product/53608/wegmans-three-dozen-large-eggs-family-pack',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 2.99,
                        quantity: 12,
                        quantity_unit: u.unit,
                        link: 'https://www.amazon.com/365-Everyday-Value-Brown-Non-Gmo/dp/B07PFDYT9T/ref=sr_1_6_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly eggyolk = this.createFactory('Egg Yolk', {
        cleanSteps: 'Put egg yolks back in refrigerator',
    });

    public static readonly eggWhite = this.createFactory('Egg White', {
        cleanSteps: 'Put egg whites back in refrigerator',
    });

    public static readonly ham = this.createFactory('Ham', {
        cleanSteps: 'Put ham back in refrigerator',
    });

    public static readonly honey = this.createFactory('Honey');

    public static readonly butter = this.createFactory('Butter', {
        cleanSteps: 'Put butter back on right of sink',
        purchaseLinks: {
            [Stores.wegmans]: {
                'Wegmans Butter, Unsalted, Sweet Cream': [
                    {
                        price: 3.69,
                        quantity: 1,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/50048/wegmans-butter-unsalted-sweet-cream',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 3.99,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Unsalted-Butter/dp/B074VDJ7KZ/ref=sr_1_2_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly bacon = this.createFactory('Bacon', {
        cleanSteps: 'Put package back in refrigerator',
    });

    public static readonly eggPasta = this.createFactory('Egg Pasta');
}
