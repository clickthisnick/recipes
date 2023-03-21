import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { MeatItems } from './meat';
import { Stores } from '../../class/stores';

export class OilItems extends MeatItems {
    public static readonly sesameOil: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Sesame Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly avocadoOil: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'avocado Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly chilliOil: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Chilli Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {
            [u.tbsp.name]: {
                calories: 119.34,
                sodium: .3,
            },
            [u.tsp.name]: {
                calories: 39.78,
                sodium: .1,
            }
        },
    })

    public static readonly coconutOil = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Coconut Oil', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
                [Stores.amazon]: {
                    'BetterBody Foods Organic Naturally Refined Coconut Oil with Neutral Flavor and Aroma': [
                        {
                            price: 11.96,
                            quantity: 56,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/BetterBody-Foods-Organic-Naturally-Refined/dp/B00U1RKGOW/ref=sr_1_6',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 15,
                                'Subscribe': 5,
                            }
                        }
                    ]
                },
                [Stores.wegmans]: {
                    'Wegmans Organic Extra Virgin Coconut Oil, Unrefined': [
                        {
                            price: 10.99,
                            quantity: 26,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/36486/wegmans-organic-extra-virgin-coconut-oil-unrefined',
                            organic: true
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    '365 by Whole Foods Market, Organic Expellar Pressed Coconut Oil': [
                        {
                            price: 5.79,
                            quantity: 14,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Coconut/dp/B074H5BV9Y',
                            organic: true
                        }
                    ]
                },
            }, // purchase links
        )
    )

    public static readonly oliveOil = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Olive Oil', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
                [u.tbsp.name]: {
                    calories: 119.34,
                    sodium: .3,
                },
                [u.tsp.name]: {
                    calories: 39.78,
                    sodium: .1,
                }
            }, // nutrition
            unit, // unit
            {
                [Stores.wholeFoods]: {
                    'california': [
                        {
                            price: 12.99,
                            quantity: 33.8,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Unfiltered-Californian/dp/B074HKKC3W',
                            organic: false,
                        }
                    ],
                    'mediterranean': [
                        {
                            price: 19.29,
                            quantity: 101.4,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/Everyday-Value-Olive-Virgin-Mediterranean/dp/B074Y6WZ8X/ref=sr_1_16_0o_wf',
                            organic: false,
                        }
                    ],
                },
                [Stores.amazon]: {
                    'mediterranean': [
                        {
                            price: 14.98,
                            quantity: 68,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/Pompeian-Robust-Extra-Virgin-Olive/dp/B0086OZ7X2/ref=sr_1_2_sspa',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 15,
                                'Subscribe': 5,
                            }
                        }
                    ],
                },
                [Stores.wegmans]: {
                    'mediterranean': [
                        {
                            price: 9.19,
                            quantity: 33.8,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/16900/wegmans-100-mediterranean-blend-olive-oil-pure',
                            organic: false,
                        }
                    ]
                }
            }, // purchase links
        )
    )

    public static readonly vegetableOil: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Vegetable Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })
}
