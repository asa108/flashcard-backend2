'use strict';
const {sanitizeEntity} = require('strapi-utils')

module.exports = {
    // create flashcard with user
    async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.flashcards.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.flashcards.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.flashcards });
    },
    
    // update flashcard with user
    async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [flashcards] = await strapi.services.flashcards.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!flashcards) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.flashcards.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.flashcards.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.flashcards });
    },

    // delete a flashcard
      async delete(ctx) {
    const { id } = ctx.params;

    const [flashcards] = await strapi.services.flashcards.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });

    if (!flashcards) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.flashcards.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.flashcards });
  },
    // Get logged in user
    async me(ctx) {
        const user = ctx.state.user

        if (!user) {
            return ctx.badRequest(null, [
                {message:[{id:'No userizartion header was found'}]}
            ])
        }

        const data = await strapi.services.flashcards.find({ user: user.id })
        
        if (!data) {
            return ctx.notFound()
        }

        return sanitizeEntity(data,{model:strapi.models.flashcards})
    }
};
