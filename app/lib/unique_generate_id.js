"use strict";
const nanoId = require("nanoid/async");
const { ITEM_ALPHABET, ITEM_ID_LENGTH } = require("../constants/constants");

const { customAlphabet } = nanoId;
const getId = async (prefix) => {
  const id = await customAlphabet(ITEM_ALPHABET, ITEM_ID_LENGTH);

  if (prefix) {
    return prefix + (await id());
  } else {
    return await id();
  }
};

const getRandomCode = async (length) => {
  const id = await customAlphabet(ITEM_ALPHABET, length);
  return await id();
};

module.exports = {
  getId,
  getRandomCode,
};
