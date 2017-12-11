'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * A Validation function for local strategy properties
 */
var isNameInLocalProvider = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

var isEmailInLocalProvider = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * Auth Schema
 */
var AuthSchema = new Schema({
  organisationId: Schema.Types.ObjectId,
  name: {
    first: {
      type: String,
      trim: true,
      default: '',
      // validate: [isNameInLocalProvider, 'Please fill in your first name']
    },
    last: {
      type: String,
      trim: true,
      default: '',
      // validate: [isNameInLocalProvider, 'Please fill in your last name']
    }
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    index: {
      unique: true, dropDups: true
    },
    unique: 'This email address is already registered',
    lowercase: true,
    trim: true,
    default: '',
    required: 'Please fill in your email address'
    // validate: validator.isEmail
  },
  username: {
    type: String,
    index: {
      unique: true, dropDups: true
    },
    unique: 'This username is already registered',
    required: 'Please fill in a username',
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  userType: {
    type: String,
    default: 'jira',
  },
  userRole: {
    type: String,
    default: 'User',
    // required: 'Please provide at least one role'
  },
  phone: { type: Number },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: Number },
  profileImageURL: {
    type: String,
    default: 'storage/uploads/users/profile/default.png'
  },
  provider: {
    type: String,
    enum: ['local', 'facebook', 'google', 'linkedin', 'twitter'],
    default: 'local',
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  serviceProvider: {
    jira: {
      host: { type: String, default: '' },
      protocol: { type: String, default: '' },
      oauth: {
        consumer_key: { type: String, default: '' },
        private_key: { type: String, default: '' },
        token: { type: String, default: '' },
        token_secret: { type: String, default: '' }
      }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date
  },
  lastLoginAt: {
    type: Date
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  /* For user active token */
  activateToken: {
    type: String
  },
  activateTokenExpires: {
    type: Date
  },
  /* User active boolean flag */
  activeFlag: {
    type: Boolean,
    default: 0
  },
  deleteFlag: {
    type: Boolean,
    default: 0
  }
});

module.exports = AuthSchema;
