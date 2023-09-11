DELIMITER $$

CREATE PROCEDURE updateInventory(IN orderId INT)
BEGIN
  DECLARE totalVolume NUMERIC(10, 2);

  -- Calculate the total volume of products in the accepted order
  SELECT SUM(volume * amount)
  INTO totalVolume
  FROM orderitems
  WHERE orderitems.orderId = orderId;

  -- Update product quantities and warehouse available area volume
  UPDATE products
  JOIN orderitems ON products.name = orderitems.name
  SET
    products.quantity = products.quantity - orderitems.amount,
    products.updatedAt = NOW(); -- Optionally update the product's updated timestamp

  UPDATE warehouses
  SET
    warehouses.availableAreaVolume = warehouses.availableAreaVolume + totalVolume,
    warehouses.updatedAt = NOW(); -- Optionally update the warehouse's updated timestamp
END;

$$

DELIMITER ;
