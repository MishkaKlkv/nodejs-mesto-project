import { Joi } from 'celebrate';

const urlRegExp = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#@!$&'()*+,;=]+\.[a-zA-Z]{2,})([a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*)#?$/;

const joiAuthorization = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);

const joiObjectId = Joi.object().keys({
  cardId: Joi.string().alphanum().length(24),
});

export { urlRegExp, joiAuthorization, joiObjectId };
