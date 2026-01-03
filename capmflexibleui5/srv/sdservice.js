const cds = require('@sap/cds');
const ValidationUtils = require('./util/ValidationUtils');

module.exports = cds.service.impl(async function () {
  const { SalesOrderHeader, SalesOrderItem, SalesOrderView } = this.entities;

  this.before('CancelOrder', async (req) =>{
    const { ID } = req.params[0];
    const order = await SELECT.one.from(SalesOrderHeader).where({ ID });

    if (!order) return req.error(404, `Order ${ID} not found`);
    if (order.status === 'CANCELLED')
      return req.error(400, `Order ${ID} is already cancelled`);
    if (order.status === 'SHIPPED')
      return req.error(400, `Order ${ID} has been shipped and cannot be cancelled`);

    console.log(`✅ Before Event: Order ${ID} validated for cancellation`);
  });
  
  // this.on('CancelOrder', async (req) => {
  //   const { ID } = req.data;
  //   const order = await SELECT.one.from(SalesOrderHeader).where({ ID });
  
  //   if (!order) return req.error(404, `Order ${ID} not found`);
  //   if (order.status === 'CANCELLED') return `Order ${ID} already cancelled`;
  
  //   await UPDATE(SalesOrderHeader).set({ status: 'CANCELLED' }).where({ ID });
  //   return `Order ${ID} was cancelled successfully`;
  // });

  this.on('CancelOrder', async (req) => {
  // const { ID } = req.data;
  const { ID } = req.params[0];
  const order = await SELECT.one.from(SalesOrderHeader).where({ ID });

  if (!order) return req.error(404, `Order ${ID} not found`);
  if (order.status === 'CANCELLED') return `Order ${ID} already cancelled`;

  await UPDATE(SalesOrderHeader).set({ status: 'CANCELLED' }).where({ ID });
  req.info(`Order ${ID} was cancelled successfully`);
  return { ID, status: 'CANCELLED' };
});

  this.before('CREATE', 'SalesOrderItem', async (req) => {
    if (req.data.quantity <= 0) {
      return req.error(400, 'Quantity must be greater than zero');
    }
    if (req.data.price <= 0) {
      return req.error(400, 'Price must be greater than zero');
    }
  });
  
  
  
  
  this.before('UPDATE',SalesOrderHeader , async(req)=>{
    const data = req.data;   // all fields of the incoming record
    const{ID,customer} = req.data; // read particular data , we can mentioned as much as field we want in {}
    // const itemLine = req.data.items[0]; // Reading from association , but here first line item ,to read all put loop
  });


  this.before('CREATE', 'SalesOrderHeader' ,async (req)=>{
    const data = req.data;   // all fields of the incoming record
    const{ID,customer} = req.data; // read particular data , we can mentioned as much as field we want in {}
    // const itemLine = req.data.items[0]; // Reading from association , but here first line item ,to read all put loop
    // const items = await SELECT.from(SalesOrderItem).where({ ID: '1' });

    // One customer can not buy more than 3 Laptop( first we are checking if customer has already laptop purchased)
    // and how many more customer wants to buy again(create request)
    
    // Here we are reading already exist data of customer and checking if he/she already has laptop
    // const existing = await SELECT
    // .from(SalesOrderItem)
    // .columns('sum(quantity) as total')
    // .where({ product: 'Laptop' })
    // .and({
    //   header_ID: {
    //     in: SELECT.from(SalesOrderHeader)
    //              .columns('ID')
    //              .where({ customer })
    //   }
    // });

// Raising error if total qty > 3
    // const alreadyBought = existing[0]?.total || 0;
    // const newTotal = alreadyBought + itemLine.quantity;
    // if (newTotal > 3) {
    //   return req.error(400, `Customer "${customer}" cannot buy more than 3 Laptops (already has ${alreadyBought})`);
    // }


    // const requiredErr = ValidationUtils.checkRequiredFields(data, ['customer', 'orderDate']);
    // if (requiredErr) return req.error(400, requiredErr);

    // // 2. Check duplicate products in items
    // if (data.items?.length) {
    //   const dupErr = ValidationUtils.checkDuplicateProducts(data.items);
    //   if (dupErr) return req.error(400, dupErr);
    // }


    // if (itemLine) {
    //   const  {product}  = itemLine; // Reading product of Item
    //     for (const i of req.data.items){ // loop to read all columns of items
    //         console.log("Product",i.product);
    //         console.log("Quantity",i.quantity);
    //         console.log("Price",i.price);
    //     }

    //   if (data.customer === 'Krishna' && product === 'Laptop') {
    //     return req.error(400, 'TEST customers cannot exceed 10,000');
    //   }
    // }

  
  });

  // this.on('READ','SalesOrderHeader' ,async(req)=>{
  // const itSalesOrder =  cds.run(SELECT.from(SalesOrderHeader).orderBy('orderDate desc'));
 

  // for(i of itSalesOrder){
  //   console.log("Customer",i.customer);
  //   console.log("Order Date",i.orderDate);
  // }
  // });

  this.on('READ', 'SalesOrderHeader', async (req) => {
    const itSalesOrder = await cds.run(
      SELECT.from(SalesOrderHeader).orderBy('orderDate desc')
    );
    // Write a query to get all items of a given SalesOrder (pass header ID).
    const itSales = await cds.run(SELECT.from(SalesOrderHeader).where({ID : 1}));
    // Read only customers who have orders with totalAmount > 10000.
    const lvCustomer = await cds.run(SELECT.from(SalesOrderHeader).columns('customer').where({totalAmount: { '>': 1500 } }));

    if (!itSalesOrder.length) {
      return [];
    }
  
    for (const i of itSalesOrder) {
      console.log("Customer", i.customer);
      console.log("Order Date", i.orderDate);
    }
    for (const i of itSales) {
      console.log("Customer", i.ID);
      console.log("Order Date", i.customer);
    }
  
    return itSalesOrder;
  });
  

  // 🔹 Bound Action implementation
  this.on('RecalculateTotals', 'SalesOrderHeader', async (req) => {
    // Extract composite keys from the request
    const {ID} = req.params[0] || {};

   

    // Use hID as the orderID to fetch related items
    const orderID = ID;

    // 1️⃣ Fetch items for this order using the header_ID association
    // const items = await SELECT.from(SalesOrderItem).where({ header_ID: orderID });
    const items = await SELECT.from(SalesOrderHeader).where({ ID: orderID });

    if (!items.length) {
      return `No items found for order ${orderID}`;
    }

  
    for (const i of items) {
      if (i.quantity < 1) {
        return req.error(400, `❌ Item ${i.ID} has invalid quantity: ${i.quantity}`);
      }
    }
    // 2️⃣ Calculate total
    const total = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);

    // 3️⃣ Update header
    await UPDATE(SalesOrderHeader).set({ totalAmount: total }).where({ ID: ID });

    return `Order ${orderID} total updated to ${total}`;
  });




});