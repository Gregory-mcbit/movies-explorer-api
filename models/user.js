const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательное'],
    minlength: [2, 'Поле должно быть не меньше 2 символов'],
    maxlength: [30, 'Поле должно быть не больше 30 символов'],
  },
  password: {
    type: String,
    required: [true, 'Поле обязательное'],
    select: false,
  },
  email: {
    type: String,
    required: [true, 'Поле обязательное'],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Емейл не в корректном формате',
    },
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
