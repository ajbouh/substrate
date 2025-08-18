export const attributes = {
    type: 'jsdoc-example'
}

export default {
    description: "simple destructuring",
    params: [{
        name: "calculateTotalPrice",
        description: "Calculates the final price of an item by adding a tax rate.",
        params: {
            "inputs": {
                "type": "object",
                "required": true,
                "properties": {                        
                    "basePrice": { "type": "number", "description": "The price before tax.", "required": true},
                    "taxRate": { "type": "number", "description": "The tax rate as a decimal (e.g., 0.05 for 5%).", "required": true},
                },
            },
        },
        returns: {
            "type": "object",
            "properties": {
                "totalPrice": {"type": "number", "description": "The final price including tax." },
            },
        },
    }],
    returns: {
        jsdoc: `/**
 * @function
 *
 * Calculates the final price of an item by adding a tax rate.
 *
 * @arg {object} inputs
 * @arg {number} inputs.basePrice - The price before tax.
 * @arg {number} inputs.taxRate - The tax rate as a decimal (e.g., 0.05 for 5%).
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
