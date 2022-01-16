import { UserInputError } from 'apollo-server-errors'

import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { buildSelect } from '../../utils/sql'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import checkZoom from './sql/checkZoom.sql'
import reviews from './sql/reviews.sql'

export const Query: QueryResolvers<ApolloContext> = {
  zoomReviews: async (_, { pagination, zoomId }) => {
    let sql = reviews
    const values = [pagination.limit]

    const { rowCount } = await poolQuery(checkZoom, [zoomId])
    if (rowCount === 0) throw new UserInputError(`zoom:${zoomId}는 존재하지 않습니다.`)

    // pagination
    if (pagination.lastId) {
      sql = buildSelect(sql, 'WHERE', 'zoom_review.id < $1')
      values.push(pagination.lastId)
    }

    const { rows } = await poolQuery(sql, values)

    return rows.map((row) => graphqlRelationMapping(row))
  },
}