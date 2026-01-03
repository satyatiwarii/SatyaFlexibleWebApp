using my.sales  as srv from '../db/schema';
//using { UI } from '@sap/cds/common';

service SalesService {
 @odata.draft.enabled
entity SalesOrderHeader as projection on srv.SalesOrderHeader {
    key ID,
    customer,
    orderDate,
    totalAmount,
    status,
    optional,
    items : redirected to SalesOrderItem , // 🔹 keep navigation to items
  }
  actions {
    action RecalculateTotals() returns String;   // 🔹 bound to Header
      action CancelOrder() returns String; 
  };


  // entity SalesOrderItem   as projection on srv.SalesOrderItem;

  entity SalesOrderItem as projection on srv.SalesOrderItem {
    key ID,
    product,
    quantity,
    price,
    image , // expose image field
    header
  };
  
  //  actions {
  //   action CancelOrder(ID: Integer) returns String;  
  // };
  
}