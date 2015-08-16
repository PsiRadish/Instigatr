'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail:true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len:[5],
        notEmpty: true
      }
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      authenticate: function(email,password,callback){
        this.find({where:{email:email}}).then(function(user){
          if(user){
            bcrypt.compare(password,user.password,function(err,result){
              if(err){
                callback(err);
              }else{
                callback(null, result ? user : false);
              }
            });
          }else{
            callback(null, false);
          }
        }).catch(callback);
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback){
        if(user.password){
          bcrypt.hash(user.password,5,function(err,hash){
            if(err) return callback(err);
            user.password = hash;
            callback(null, user);
          });
        }else{
          callback(null, user);
        }
      }
    }
  });

  return user;
};



  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.post);
      }
    }
  });
  return user;
 };