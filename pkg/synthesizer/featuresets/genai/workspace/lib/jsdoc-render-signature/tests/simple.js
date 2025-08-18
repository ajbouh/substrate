export const attributes = {
    type: 'jsdoc-example'
}

export default {
    description: "simple virtual",
    params: [{
        name: "calculateTotalPrice",
        virtual: true,
        signature: {
            description: "Calculates the final price of an item by adding a tax rate.",
            inputs: [
                {"name": "basePrice", "type": {"name": "number"}, "description": "The price before tax." },
                {"name": "taxRate", "type": {"name": "number"}, "description": "The tax rate as a decimal (e.g., 0.05 for 5%)." },
            ],
            outputs: [
                {"name": "totalPrice", "type": {"name": "number"}, "description": "The final price including tax." },
            ],
        },
        examples: [
            {basePrice: 1.0, taxRate: 0.1, totalPrice: 1.1},
            {basePrice: 2.0, taxRate: 0.1, totalPrice: 2.2},
        ],
    }],
    returns: {
        jsdoc: `/**
 * @name calculateTotalPrice
 * @function
 *
 * Calculates the final price of an item by adding a tax rate.
 *
 * @example
 * // Returns {"totalPrice":1.1}
 * calculateTotalPrice({"basePrice":1,"taxRate":0.1})
 *
 * @example
 * // Returns {"totalPrice":2.2}
 * calculateTotalPrice({"basePrice":2,"taxRate":0.1})
 *
 * @arg {object} obj
 * @arg {number} obj.basePrice - The price before tax.
 * @arg {number} obj.taxRate - The tax rate as a decimal (e.g., 0.05 for 5%).
 *
 * @returns {calculateTotalPriceReturns}
 */
/**
 * @typedef {object} calculateTotalPriceReturns
 * @prop {number} totalPrice - The final price including tax.
 */
`,
    },
}
