require('dotenv').config();
const db = require('../../src/config/database')

describe('Database connection', () => {

    it('connects successfully', async () => {
        const testQuery = `SELECT 1 + 2 AS solutionTest`
        const [rows] = await db.query(testQuery);
        expect(rows[0].solutionTest).toBe(3);
    })

    it('connection limit', async () => {
        let promises = [];
        const req = `SELECT 1 + 2 AS solutionTest`;
        for (let i = 0; i < 15; i++) {
            promises.push(db.query(req));
        }
        const results = await Promise.all(promises);
        results.forEach(([rows]) => {
            expect(rows[0].solutionTest).toEqual(3)
        })
    })

    it('multiple statements', async () => {
        const req = `SELECT id_city FROM city WHERE id_city = 1; SELECT id_region FROM region WHERE id_region = 1;`;
        expect(await db.query(req)).toBeDefined()
    })

    afterAll(async () => {
        await db.end();
    });
})

