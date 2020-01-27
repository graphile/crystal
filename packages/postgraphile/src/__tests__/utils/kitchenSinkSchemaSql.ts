import { readFile } from 'fs';
import * as minify from 'pg-minify';

const kitchenSinkSchemaSql = new Promise<string>((resolve, reject) => {
  readFile('examples/kitchen-sink/schema.sql', (error, data) => {
    if (error) reject(error);
    else resolve(minify(data.toString().replace(/begin;|commit;/g, '')));
  });
});

export default kitchenSinkSchemaSql;
