'use strict';
const {sanitizeEntity} = require('strapi-utils')

module.exports = {
    // Get logged in user
    async me(ctx) {
        const user = ctx.state.user

        if (!user) {
            return ctx.badRequest(null, [
                {message:[{id:'No authorizartion header was found'}]}
            ])
        }

        const data = await strapi.services.flashcards.find({ user: user.id })
        
        if (!data) {
            return ctx.notFound()
        }

        return sanitizeEntity(data,{model:strapi.models.flashcards})
    }
};
