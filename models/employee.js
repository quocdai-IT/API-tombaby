"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      names: DataTypes.STRING,
      designation: DataTypes.STRING,
      salary: DataTypes.NUMBER
    },
    {}
  );
  Employee.associate = function(models) {
    // associations can be defined here
    Employee.belongsTo(models.Company, {
      foreignKey: "companyId",
      onDelete: "CASCADE"
    });
  };
  return Employee;
};
