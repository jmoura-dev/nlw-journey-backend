import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { dayjs } from "../lib/dayjs";

export async function getActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities', {
    schema: {
      params: z.object({ tripId: z.string().uuid() }) ,
    }
  },async (request) => {
    const { tripId } = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: { 
        activities: {
          orderBy: {
            occurs_at: "asc"
          },
        },
      },
    })

    if (!trip) {
      throw new Error('Trip not found.')
    }

    const differenceInDaysBetweenTripStartAndTripEnd = dayjs(trip.ends_at).diff(trip.starts_at, 'days')

    const activities = Array.from({ length: differenceInDaysBetweenTripStartAndTripEnd + 1 }).map((_, index) => {
      const date = dayjs(trip.starts_at).add(index, 'days')

      return {
        date: date.toDate(),
        activities: trip.activities.filter(activity => {
          return dayjs(activity.occurs_at).isSame(date, 'day')
        })
      }
    })

    return { activities }
  })
}