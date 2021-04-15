'use strict';

// TODO: validate requests with Joi

const Promotion = require('../models/promotion.model');
const { promotions } = require('../seed');

module.exports.list = async (req, res) => {
  const { lastId = null, size = 500 } = req.body
  const filter = lastId ? { '_id': { '$gt': lastId } } : {}

  try {
    const data = await Promotion.find(filter).sort([['createdAt']]).limit(size)
    return res.send({ docs: data || [] });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
};

module.exports.reset = async (req, res) => {
  try {
    const list = promotions()

    await Promotion.deleteMany({})
    await Promotion.insertMany(list) //TODO: optimize (binary stream? db generate?)

    return module.exports.list(req, res)
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
}

module.exports.create = async (req, res) => {
  try {
    const items = (req.body || []).map(({ _id, __v, ...body }) => body)
    const data = await Promotion.insertMany(items)
    return res.send({ docs: data || [] });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
};

module.exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Promotion.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    return res.send(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
};

module.exports.delete = async (req, res) => {
  const { ids } = req.body;
  const filter = { _id: { $in: ids } }

  try {
    const data = await Promotion.deleteMany(filter)
    return res.send({ docs: data || [] });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
};
