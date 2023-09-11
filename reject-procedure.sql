DELIMITER $$

CREATE PROCEDURE removeOrderItemsByOrderId(IN orderId INT)
BEGIN
  -- Delete all items in orderitems table with the specified orderId
  DELETE FROM orderitems WHERE orderId = orderId;
END;

$$

DELIMITER ;