namespace my.sales;
// @odata.draft.enabled
entity SalesOrderHeader {
  key ID : Integer;
  customer   : String;
  orderDate  : Date;
  totalAmount: Decimal;
  status      : String ; 
  optional: Boolean default false; 
  items : Composition of many SalesOrderItem on items.header = $self;
}


entity SalesOrderItem {
  key ID : Integer;
  product  : String;
  quantity : Integer;
  price    : Decimal;
  header   : Association to SalesOrderHeader;
    // 🔹 Add image field (binary)
  image : LargeBinary @Core.MediaType: 'image/png';
}