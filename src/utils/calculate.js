const { httpStatus } = require("./util");

/** 
 * Convert value to number safely. 
*/
function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

/** 
 * Round number to 2 decimal places. 
*/
function roundMoney(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** 
 * Calculate total price for one item. 
 * Formula: * quantity * unit_price * 
 * @param {number|string} quantity 
 * @param {number|string} unitPrice 
 * @returns {number} 
*/ 
function calculateItemTotal(quantity, unitPrice){ 
    const qty = toNumber(quantity); 
    const price = toNumber(unitPrice); 
    return roundMoney(qty * price); 
} 

/** 
 * Calculate subtotal from purchase order items. 
 * Formula: * SUM(quantity * unit_price) * 
 * @param {Array} items 
 * @returns {number} 
*/ 
function calculateSubtotal(items = []){ 
    if (!Array.isArray(items)) { 
        return 0; 
    } 
    const subtotal = items.reduce((total, item) => { 
        const itemTotal = calculateItemTotal(item.quantity, item.unit_price); 
        return total + itemTotal; 
    }, 0); 
    return roundMoney(subtotal); 
} 

/** 
 * Calculate grand total
 * Formula: * subtotal + shipping_cost + tax_amount * 
 * @param {number|string} subtotal 
 * @param {number|string} shippingCost 
 * @param {number|string} taxAmount 
 * @returns {number} 
*/ 
function calculateGrandTotal(subtotal, shippingCost = 0, taxAmount = 0){
    const sub = toNumber(subtotal); const shipping = toNumber(shippingCost); 
    const tax = toNumber(taxAmount); 
    return roundMoney(sub + shipping + tax); 
} 

/** 
 * Calculate all purchase order totals. 
 * This is the main reusable function.
 * @param {Object} data 
 * @param {Array} data.items 
 * @param {number|string} data.shipping_cost 
 * @param {number|string} data.tax_amount 
 * @returns {Object} 
*/ 
function calculatePurchaseOrderTotals({ items = [], shipping_cost = 0, tax_amount = 0 }){ 
    const calculatedItems = items.map(item => {
        const totalPrice = calculateItemTotal(item.quantity, item.unit_price); 
        return { 
            ...item, 
            total_price: totalPrice 
        }; 
    }); 
    
    const subtotal = calculateSubtotal(calculatedItems); 
    const grandTotal = calculateGrandTotal(subtotal, shipping_cost, tax_amount); 
    return { items: calculatedItems, subtotal, tax_amount: roundMoney(toNumber(tax_amount)), shipping_cost: roundMoney(toNumber(shipping_cost)), grand_total: grandTotal }; 
} 

function remainTermin(terminPayment, grandTotal){
    if(terminPayment > grandTotal){
        const error = new Error("The Bill Exceeds The Correct Amount");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    const remainPayment = grandTotal - terminPayment;

    if(remainPayment < 0){
        const error = new Error("The Payment Has Been Settled");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }
    return remainPayment;
}

module.exports = { toNumber, roundMoney, calculateItemTotal, calculateSubtotal, calculateGrandTotal, calculatePurchaseOrderTotals, remainTermin };