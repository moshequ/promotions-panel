'use strict';

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fields = new Schema({}, { _id: false, strict: false });
const actions = new Schema({
  label: { type: String },
  trigger: { type: String, enum: ['EDIT', 'DELETE', 'DUPLICATE'] }
}, { _id: false });

const promotion = new Schema(
  {
    fields,
    actions: [actions]
  }, { timestamps: true }
);

module.exports = mongoose.model("promotions", promotion);
