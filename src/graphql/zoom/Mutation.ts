import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { MutationResolvers, Zoom } from '../generated/graphql'
import createZoom from './sql/createZoom.sql'
// import deleteZoom from './sql/deleteZoom.sql'
import joinZoom from './sql/joinZoom.sql'

// import updateZoom from './sql/updateZoom.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  createZoom: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(createZoom, [
      input.title,
      input.description,
      input.imageUrl.href,
      userId,
    ])

    return graphqlRelationMapping(rows[0], 'zoom')
  },

  // updateZoom: async (_, { input }, { userId }) => {
  //   if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

  //   const { rowCount, rows } = await poolQuery(updateZoom, [
  //     input.title,
  //     input.contents,
  //     input.imageUrl.href,
  //     input.id,
  //     userId,
  //   ])

  //   if (rowCount === 0)
  //     throw new UserInputError(
  //       `id:${input.id} 의 게시글이 존재하지 않거나, 해당 게시글의 작성자가 아닙니다.`
  //     )

  //   return graphqlRelationMapping(rows[0], 'zoom')
  // },

  // deleteZoom: async (_, { id }, { userId }) => {
  //   if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

  //   const { rowCount, rows } = await poolQuery(deleteZoom, [id, userId])

  //   if (rowCount === 0) throw new UserInputError(`id:${id} 의 게시글이 존재하지 않습니다.`)

  //   return graphqlRelationMapping(rows[0], 'zoom')
  // },

  joinZoom: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(joinZoom, [userId, id])

    return { id, isJoined: rows[0].result } as Zoom
  },
}
