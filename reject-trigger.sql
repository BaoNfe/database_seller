-- Step 2: Create a trigger to call the stored procedure when an order is updated to "Accept"
DELIMITER $$
CREATE TRIGGER after_order_reject
AFTER UPDATE ON `orders` FOR EACH ROW
BEGIN
  IF NEW.status = 'reject' AND OLD.status != 'reject' THEN
    CALL removeOrderItemsByOrderId(NEW.id);
  END IF;
END;
$$
DELIMITER ;
