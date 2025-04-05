import Elysia from 'elysia'
import { db } from '../analytics'

export const analyticsRoutes = new Elysia().get('analytics', () => {
	const hits = db.query('select * from path_hits order by hits desc').all()
	const uniques = db
		.query(
			'select path, date, count(hashed_ip) as unique_visits from daily_uniques group by path, date order by date desc, unique_visits desc',
		)
		.all()
	return { hits, uniques }
})
