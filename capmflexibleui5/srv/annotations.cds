using { SalesService } from './sdservice';

annotate SalesService.SalesOrderHeader with @(
  UI.SelectionFields : [ ID, customer, orderDate ],

  UI.HeaderInfo: {
    TypeName      : 'Sales Order',
    TypeNamePlural: 'Sales Orders',
  },

  UI.Facets: [
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'General Info',
      Target: '@UI.FieldGroup#General'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Items',
      Target: 'items/@UI.LineItem#Items'
    }
  ],

  UI.FieldGroup#General: {
    Data: [
      { Value: customer ,Label: 'Customer Name'},
      { Value: orderDate, Label: 'Order Date' },
      { Value: totalAmount , Label: 'Price' }
    ]
  },

  // List Report (Header level)
  UI.LineItem : [
    { $Type: 'UI.DataField', Value: ID, Label: 'Header ID' },
    { $Type: 'UI.DataField', Value: customer, Label: 'Customer' },
    { $Type: 'UI.DataField', Value: orderDate, Label: 'Order Date' },
    { $Type: 'UI.DataField', Value: totalAmount, Label: 'Total' },
    {
      $Type : 'UI.DataFieldForAction',
      Action: 'SalesService.RecalculateTotals',
      Label : 'Recalculate Total',
      InvocationGrouping : #Isolated
    },
    {
      $Type : 'UI.DataFieldForAction',
      Action: 'SalesService.CancelOrder',   
      Label : 'Cancel Order',
      InvocationGrouping: #Isolated,
      Criticality: #Negative
    }
  ]
);

annotate SalesService.SalesOrderItem with @(
  UI.LineItem#Items: [
    {  Value: ID , Label : 'ID'},
     {  Value: product, Label: 'Product' },
    { Value: quantity, Label: 'Quantity' },
    { Value: price, Label: 'Price' }
  ]
);





// annotate SalesService.SalesOrderHeader with @(
//   UI.SelectionFields : [
//     orderID, customer, orderDate
//   ],
//  UI.HeaderInfo: {
//     TypeName      : 'Sales Order',
//     TypeNamePlural: 'Sales Orders',
//     Title         : { Value: customer },
//     Description   : { Value: orderDate }
//   }
//   ,UI.Facets: [
//     {
//       $Type : 'UI.ReferenceFacet',
//       Label : 'General Info',
//       Target: '@UI.FieldGroup#General'
//     },
//     {
//       $Type : 'UI.ReferenceFacet',
//       Label : 'Items',
//       Target: 'items/@UI.LineItem#Items'  // ✅ navigation path
//     }
//   ], UI.FieldGroup#General: {
//     Data: [
//       { Value: customer },
//       { Value: orderDate },
//       { Value: totalAmount }
//     ]
//   },
//   UI.LineItem : [
//     {
//       $Type : 'UI.DataField',
//       Value : ID,
//       Label : 'Header ID'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : customer,
//       Label : 'Customer'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : orderDate,
//       Label : 'Order Date'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : product,
//       Label : 'Product'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : quantity,
//       Label : 'Quantity'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : price,
//       Label : 'Price'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : totalAmount,
//       Label : 'Total'
//     },
//     {
//       $Type : 'UI.DataFieldForAction',
//       Action: 'SalesService.RecalculateTotals',
//       Label : 'Recalculate Total',
//       InvocationGrouping : #Isolated,
//       Common.SideEffects : {
//         TargetProperties : ['totalAmount']   // 🔹 auto refresh this field
//       }
//     }
//   ]
// );

// annotate SalesService.SalesOrderItem with @(
//   UI.LineItem#Items: [
//     { Value: product, Label: 'Product' },
//     { Value: quantity, Label: 'Quantity' },
//     { Value: price, Label: 'Price' }
//   ]
// );

// annotate SalesService.SalesOrderItem with @(
//   UI.LineItem : [
//     {
//       $Type : 'UI.DataField',
//       Value : ID,
//       Label : 'Item ID'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : product,
//       Label : 'Product'
//     },
//     {
//       $Type : 'UI.DataField',
//       Value : quantity,
//       Label : 'Quantity'
//     }
//   ]
// );

// ✅ Annotate the navigation property "items"