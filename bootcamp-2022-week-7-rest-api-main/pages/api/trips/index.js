import prisma from 'lib/prisma'

export default async function handler(req, res) {
  res.status(405).send({
    message: 'Method Not Allowed',
  })
  if (req.method === 'GET') {
    const trips = await prisma.trip.findMany()

    await Promise.all(
      trips.map(async (trip) => {
        trip.expenses = await prisma.expense.findMany({
          where: {
            trip: trip.id,
          },
        })
      })
    )

    res.status(200).json(trips)
    return
  }

  if (req.method === 'POST') {
    console.log(req.body)

    const { user, name, start_date, end_date } = req.body

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Missing required parameter `user`' })
    }

    if (!name) {
      return res
        .status(400)
        .json({ message: 'Missing required parameter `name`' })
    }

    await prisma.trip.create({
      data: {
        user,
        name,
        start_date,
        end_date,
      },
    })

    res.status(200).end()
    return
  }

  res.status(405).json({
    message: 'Method Not Allowed',
  })
}
