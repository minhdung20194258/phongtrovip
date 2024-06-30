export const depositQuery = ({startAt: s, endAt: e}) => {
  if (!s && !e) return [];
  const startAt = new Date(s);
  const endAt = new Date(e);

  return [
    {
      $match: {
        $expr: {
          $and: [
            {
              $or: [
                {
                  $and: [{$lte: ['$startAt', startAt]}, {$gte: ['$endAt', endAt]}],
                },
                {
                  $and: [
                    {$gte: ['$startAt', startAt]},
                    {$lte: ['$startAt', endAt]},
                    {$gte: ['$endAt', endAt]},
                  ],
                },
                {
                  $and: [
                    {$lte: ['$startAt', startAt]},
                    {$lte: ['$endAt', endAt]},
                    {$gte: ['$endAt', startAt]},
                  ],
                },
                {
                  $and: [
                    {$gte: ['$startAt', startAt]},
                    {$lte: ['$startAt', endAt]},
                    {$lte: ['$endAt', endAt]},
                    {$gte: ['$endAt', startAt]},
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ];
};
