import Elysia, { t } from 'elysia'
import { getCurrentlyFronting, getAllAlters, updateFronting } from '../fronting'

const updateFrontingSchema = t.Object({
	alterIds: t.Array(t.String()),
	token: t.String(),
})

const AUTH_TOKEN = process.env.SYSTEM_AUTH_TOKEN

export const frontingRoutes = new Elysia()
	.get(
		'/system/fronting',
		() => {
			return getCurrentlyFronting()
		},
		{
			tags: ['system'],
			response: t.Object({
				alters: t.Array(
					t.Object({
						id: t.String(),
						name: t.String(),
						pronouns: t.String(),
						role: t.String(),
						description: t.Union([t.String(), t.Null()]),
						avatar_url: t.Union([t.String(), t.Null()]),
					}),
				),
				timestamp: t.Number(),
			}),
		},
	)

	.get(
		'/system/alters',
		() => {
			return getAllAlters()
		},
		{
			tags: ['system'],
		},
	)

	.post(
		'/system/fronting',
		({ body, set }) => {
			if (body.token !== AUTH_TOKEN) {
				set.status = 401
				return { error: 'unauthorized' }
			}

			return updateFronting(body.alterIds)
		},
		{
			body: updateFrontingSchema,
			tags: ['system'],
		},
	)
