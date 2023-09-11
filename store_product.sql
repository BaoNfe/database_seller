DELIMITER //

CREATE PROCEDURE UpdateProductWarehouse(
    IN productName VARCHAR(255),
    IN productQuantity INT
)
BEGIN
    DECLARE totalVolume INT;
    DECLARE remainingQuantity INT;
    
    -- Calculate the total volume of the product
    SELECT quantity * volume INTO totalVolume
    FROM products
    WHERE name = productName;
    
    -- Initialize remaining quantity
    SET remainingQuantity = productQuantity;
    
    -- Loop through available warehouses with space
    WHILE remainingQuantity > 0 DO
        -- Find the warehouse with the largest available space
        SELECT name, availableAreaVolume
        FROM warehouses
        WHERE availableAreaVolume >= totalVolume
        ORDER BY availableAreaVolume DESC
        LIMIT 1
        INTO @selectedWarehouseName, @selectedAvailableAreaVolume;
        
        -- If a suitable warehouse is found
        IF @selectedWarehouseName IS NOT NULL THEN
            -- Update the product's warehouse field
            UPDATE products
            SET warehouse = @selectedWarehouseName
            WHERE name = productName
            LIMIT remainingQuantity;
            
            -- Update the available area volume of the selected warehouse
            UPDATE warehouses
            SET availableAreaVolume = availableAreaVolume - totalVolume
            WHERE name = @selectedWarehouseName;
            
            -- Update the remaining quantity
            SET remainingQuantity = remainingQuantity - totalVolume;
        END IF;
    END WHILE;
    
END //

DELIMITER ;
