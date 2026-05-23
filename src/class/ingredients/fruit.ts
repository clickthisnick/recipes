import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class FruitItems {
    private static createFactory =
        (name: string, overrides: Partial<IItemObj> = {}) =>
        (quantity = 0, unit: IUnitObj = Units.none) =>
            Ingredient.makeItem(name, quantity, unit, {
                ...overrides,
            });

    public static readonly apple = this.createFactory('Apple');

    public static readonly antiOxidantBerryBlend = this.createFactory(
        'Anti-Oxidant Berry Blend',
        {}
    );

    public static readonly frozenBerries = this.createFactory('Frozen Berries', {});

    public static readonly cocoaFlavanols = this.createFactory('Cocoa Flavanols', {});

    public static readonly chiaSeed = this.createFactory('Chia Seed', {});

    public static readonly hempSeed = this.createFactory('Hemp Seed', {});

    public static readonly wheatGrassPowder = this.createFactory('Wheat Grass Powder', {});

    public static readonly creatine = this.createFactory('Creatine', {});

    public static readonly chlorellaPowder = this.createFactory('Chlorella Powder', {});

    public static readonly aminoComplex = this.createFactory('Amino Complex', {});

    public static readonly acaiFrozenMix = this.createFactory('Acai Frozen Mix', {});

    public static readonly blueprintBlueberryWalnut = this.createFactory(
        'Blueprint Blueberry Walnut',
        {}
    );

    public static readonly blueprintCacao = this.createFactory('Blueprint Cacao', {});

    public static readonly banana = this.createFactory('Banana', {});

    public static readonly frozenStrawberry = this.createFactory('Frozen Strawberry', {});

    public static readonly cocoaNibs = this.createFactory('Cocoa Nibs', {});

    public static readonly frozenCauliflower = this.createFactory('Frozen Cauliflower', {});

    public static readonly frozenBroccoli = this.createFactory('Frozen Broccoli', {});

    public static readonly frozenBlueberry = this.createFactory('Frozen Blueberry', {});

    public static readonly cherry = this.createFactory('Cherry', {});

    public static readonly blueprintNuttyPudding = this.createFactory(
        'Blueprint Nutty Pudding',
        {}
    );

    public static readonly peanutButter = this.createFactory('Peanut Butter', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                '365 by Whole Foods Market, Organic Peanut Butter, Creamy': [
                    {
                        price: 4.19,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Organic-Unsweetened/dp/B074H61LYV/ref=sr_1_9_0o_wf',
                        organic: true,
                    },
                ],
                '365 by Whole Foods Market, Peanut Butter, Creamy': [
                    {
                        price: 2.49,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Peanut-Butter/dp/B074H57SPT/ref=sr_1_7_0o_wf',
                        organic: false,
                    },
                ],
                '365 by Whole Foods Market, Peanut Butter, Crunchy': [
                    {
                        price: 4.99,
                        quantity: 36,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Everyday-Value-Peanut-Butter-Crunchy/dp/B074Y2V88X/ref=sr_1_16_0o_wf',
                        organic: false,
                    },
                ],
            },
            [Stores.amazon]: {
                'Happy Belly Creamy Peanut Butter': [
                    {
                        price: 4.69,
                        quantity: 40,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/dp/B07KWGSCW2/ref=sns_myd_detail_page',
                        organic: false,
                        discount: {
                            'Subscribe 5 Products': 5,
                        },
                    },
                ],
            },
            [Stores.amazonFresh]: {
                ' Amazon Brand - Happy Belly Creamy Peanut Butter': [
                    {
                        price: 3.99,
                        quantity: 40,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Amazon-Brand-Creamy-Peanut-Butter/dp/B07KWGSCW2',
                        organic: false,
                        discount: {
                            'Subscribe 5 Products': 5,
                        },
                    },
                ],
            },
        },
    });

    public static readonly cashewButter = this.createFactory('Blueprint Nutty Pudding', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 8.99,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Cashew-Butter/dp/B074H6R4YF/ref=sr_1_5_0o_wf_mod_primary_alm',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly pittedDates = this.createFactory('Pitted Dates', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                '365 by Whole Foods Market, Dried Fruit, Pitted Dates': [
                    {
                        price: 3.99,
                        quantity: 8,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Dates-Pitted/dp/B074VDMNH7/ref=sr_1_5_0o_wf',
                        organic: false,
                    },
                ],
            },
            [Stores.amazon]: {
                'ORGANIC Pitted Dates (Deglet Nour) - Sunny Fruit 40oz Bulk Bag (2.5 lbs)': [
                    {
                        price: 16.59,
                        quantity: 2.5,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/ORGANIC-Pitted-Dates-Deglet-Nour/dp/B0872L82ZK/ref=sr_1_10',
                        organic: true,
                        discount: {
                            'Subscribe 5 Products': 5,
                        },
                    },
                ],
                '5 Pounds Of Dates Pitted (80oz) No Added Sugar, Non GMO, Kosher Certified,Healthy Snack for Kids & Adults':
                    [
                        {
                            price: 24.89,
                            quantity: 5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/5-Pounds-Dates-Pitted-5lb/dp/B0727V394G/ref=sr_1_9',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 10,
                                Subscribe: 5,
                            },
                        },
                    ],
                'Mariani Pitted Dates - 40oz (Pack of 1) – Exceptional Taste and Soft Texture, No Sugar Added, Good Source of Dietary Fiber, Gluten Free, Vegan, Fat Free, Cholesterol Free, NonGMO, Resealable Bag':
                    [
                        {
                            price: 14.08,
                            quantity: 2.5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Mariani-Pitted-Dates-Natural-40-Ounce/dp/B0027YZBJC/ref=sxin_9',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 5,
                            },
                        },
                    ],
            },
        },
    });

    public static readonly orangeJuice = this.createFactory('Orange Juice', {
        nutrition: {
            [u.fluid_ounce.name]: {
                servings: 8,
                serving_size: 7,
                calories: 110,
                sodium: 0,
                sugar: 22,
                protein: 2,
            },
        },
    });

    public static readonly macadamiaNut = this.createFactory('Macadamia Nut', {
        isMeatProduct: true,
        purchaseLinks: {
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 10.79,
                        quantity: 8,
                        quantity_unit: u.ounce,
                        link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly strawberry = this.createFactory('Strawberry', {
        isMeatProduct: true,
        purchaseLinks: {
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 6.69,
                        quantity: 32,
                        quantity_unit: u.ounce,
                        link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-365-whole-foods-market-organic-whole-strawberries-b09gcp3jng',
                        organic: true,
                    },
                    {
                        price: 6.69,
                        quantity: 32,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-WFM-Organic-Whole-Strawberries/dp/B09GCP3JNG',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly collagenPowder = this.createFactory('Collagen Powder', {
        purchaseLinks: {
            [Stores.amazon]: {
                "Anthony's Collagen Peptide Powder, 1 lb, Pure Hydrolyzed, Gluten Free, Keto and Paleo Friendly, Grass Fed":
                    [
                        {
                            price: 17.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/gp/product/B071S8D69C/ref=ppx_yo_dt_b_asin_title_o00_s00',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 5,
                            },
                        },
                    ],
            },
        },
    });
}
