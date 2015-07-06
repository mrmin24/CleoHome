CREATE TABLE `CleoHomeDB`.`Items` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Item_Name` VARCHAR(45) NOT NULL,
  `Item_Type` INT NOT NULL,
  `Node_Id` INT NULL,
  `Node_Port` INT NULL,
  `Item_Location` INT NULL,
  `Item_Current_Value` INT NULL,
  `Item_Default_Value` INT NULL,
  `Item_Is_Toggle` TINYINT(1) NULL,
  `Item_Enabled_Value` INT NULL,
  `Item_Current_State` INT NULL,
  `Network_Address` FLOAT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC))