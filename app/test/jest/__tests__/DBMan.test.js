/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @class DBMan
 * @description Testen der Klasse **DBMan.js**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/DBMan.test.js 
 */

import {DBMAN} from "src/classes/DBMan"

const filename = "/Users/ste/MyProjects/dbBEST/dbase/mydb.db"

describe('Teste DBMAN', () => {

  it ('Starts with no connections',  () => {
    expect(DBMAN.db).toBeUndefined()
  })

  it ('Can connect to valid db file',  () => {
    expect(DBMAN.db).toBeUndefined()
    const status = DBMAN.connect(filename)
    expect(DBMAN.db).toBeDefined()
    expect(status).toBeTruthy()

    DBMAN.close()
    expect(DBMAN.db).toBeUndefined()

  })

  it ('Can read from valid db file', async () => {
    expect(DBMAN.db).toBeUndefined()
    const status = DBMAN.connect(filename)
    expect(DBMAN.db).toBeDefined()
    expect(status).toBeTruthy()

    //query db
    const sql = `SELECT * FROM patients`
    const rows = await DBMAN.get_all(sql)
    expect(rows.length).toBeGreaterThan(0)

    DBMAN.close()
  })




})

