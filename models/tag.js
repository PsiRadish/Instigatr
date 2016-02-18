'use strict';
module.exports = function(sequelize, DataTypes) 
{
    var tag = sequelize.define('tag', 
    {
        name:
        {
            type: DataTypes.STRING,
            validate: { len: [1, 60] }
        }
    },
    {
        classMethods: 
        {
            associate: function(models) 
            {
                // associations can be defined here
                models.tag.belongsToMany(models.post, {through: "postsTags"});
            }
        },
        setterMethods:
        {
            // prevent leading/trailing whitespace in tag name
            name: function(inputName)
            {
                this.name = inputName.trim();
            }
        }
    });
    return tag;
};
