module.exports = {
  forbidden: [
    {
      name: 'no-db-in-domain',
      comment: 'Domain layer must not depend on persistence layer',
      from: { path: '^src/domain' },
      to: { path: '^src/persistence' },
    },
  ],
};