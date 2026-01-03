// srv/util/ValidationUtils.js
const cds = require('@sap/cds');

class ValidationUtils {
  /**
   * Ensure required fields are not null/empty.
   */
  static checkRequiredFields(data, requiredFields) {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `Field "${field}" is required.`;
      }
    }
    return null;
  }

  /**
   * Check if customer has exceeded product purchase limit.
   * @param {string} customer 
   * @param {string} product 
   * @param {number} newQuantity 
   * @param {number} maxAllowed 
   */
  static async checkCustomerProductLimit(customer, product, newQuantity, maxAllowed) {
    const { SalesOrderItem, SalesOrderHeader } = cds.entities;

    const result = await cds.run(
      SELECT.one`sum(quantity) as total`
        .from(SalesOrderItem)
        .where({
          product,
          header: { customer }
        })
    );

    const alreadyBought = result?.total || 0;
    if (alreadyBought + newQuantity > maxAllowed) {
      return `Customer "${customer}" cannot buy more than ${maxAllowed} of "${product}" (current total: ${alreadyBought}).`;
    }
    return null;
  }

  /**
   * Prevent duplicate products in same order.
   * @param {Array} items 
   */
  static checkDuplicateProducts(items) {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item.product)) {
        return `Duplicate product "${item.product}" is not allowed in the same order.`;
      }
      seen.add(item.product);
    }
    return null;
  }
}

module.exports = ValidationUtils;
