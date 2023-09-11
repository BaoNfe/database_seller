-- Step 2: Create a trigger to call the stored procedure when an order is updated to "Accept"
DELIMITER $$
CREATE TRIGGER after_order_accept
AFTER UPDATE ON `orders` FOR EACH ROW
BEGIN
  IF NEW.status = 'accept' AND OLD.status != 'accept' THEN
    CALL updateInventory(NEW.id);
  END IF;
END;
$$
DELIMITER ;
