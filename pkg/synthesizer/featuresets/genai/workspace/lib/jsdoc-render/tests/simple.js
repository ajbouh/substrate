export const attributes = {
    type: 'jsdoc-example'
}

export default {
    description: "simple",
    params: [{
        name: "calculateTotalPrice",
        description: "Calculates the final price of an item by adding a tax rate.",
        params: {
            "basePrice": { "type": "number", "description": "The price before tax.", "required": true },
            "taxRate": { "type": "number", "description": "The tax rate as a decimal (e.g., 0.05 for 5%).", "required": true },
        },
        returns: { "type": "number", "description": "The final price including tax." },
    }],
    returns: {
        jsdoc: `/**
 * @function
 *
 * Calculates the final price of an item by adding a tax rate.
 *
 * @arg {number} basePrice - The price before tax.
 * @arg {number} taxRate - The tax rate as a decimal (e.g., 0.05 for 5%).
 *
 * @returns {number} The final price including tax.
 */
`,
    },
}
