'use strict';

const RandomDate = () => new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
const RandomString = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)

module.exports.promotions = (count = 10000) => {
  return Array(count).fill(0).map(() => {
    const types = ['Basic', 'Common', 'Epic']
    const randomDate = RandomDate()

    return {
      fields: {
        "Promotion name": RandomString(),
        "Type": types[Math.floor(Math.random() * types.length)],
        "Start Date": randomDate,
        "End Date": new Date(+(randomDate) + Math.floor(Math.random() * 10000000000)),
        "User Group Name": RandomString()
      },
      actions: [
        { label: 'Edit', trigger: 'EDIT' },
        { label: 'Delete', trigger: 'DELETE' },
        { label: 'Duplicate', trigger: 'DUPLICATE' }
      ]
    }
  });
}
