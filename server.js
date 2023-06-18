const http = require('http');
const url = require('url');
const { graphql, buildSchema } = require('graphql');
const mysql = require('mysql');
const { time } = require('console');

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ovi',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database...');
});

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    data(bmi: String!, time_period: String!, geo: [String!]): [Data],
    distinctYears: [Int]
    distinctCountries: [String]
  }

  type Data {
    id: Int
    dataflow: String
    last_update: String
    freq: String
    unit: String
    bmi: String
    geo: String
    time_period: String
    obs_value: String
    obs_flag: String
  }
`);

const root = {
  data: ({bmi, time_period, geo}) => {
    console.log('bmi:', bmi);
    console.log('time_period:', time_period);
    console.log('countries:', geo);
    console.log(`Fetching data for bmi: ${bmi}, time period: ${time_period}, and countries: ${geo}`);
    const geoString = geo.map(country => `'${country}'`).join(', ');
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM Data WHERE bmi = "${bmi}" AND time_period = "${time_period}" AND geo IN (${geoString})`, (err, results) => {
        if (err) {
          console.error('Database query failed:', err);
          reject(null);
          return;
        }
        
        console.log('Database query results:', results);
  
        if (results.length === 0) {
          console.error(`No data found for bmi: ${bmi}, time period: ${time_period}, and countries: ${geo}`);
          reject(null);
          return;
        }
  
        resolve(results);
      });
    });
  },  
  distinctYears: () => {
    return new Promise((resolve, reject) => {
      // SQL query to get distinct years
      db.query('SELECT DISTINCT time_period FROM Data ORDER BY time_period ASC', (err, results) => {
        if (err) reject(err);
        else resolve(results.map(item => item.time_period));
      });
    });
  },
  distinctCountries: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT DISTINCT geo FROM Data ORDER BY geo', (err, results) => {
        if (err) reject(err);
        else resolve(results.map(item => item.geo));
      });
    });
  },  
};


// Create an HTTP server
const server = http.createServer((req, res) => {

    console.log('step 1');
  
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Option",
      "Content-Type": "application/json"
    };
    
    if (req.method === 'OPTIONS') {
        
      console.log('step options');
      res.writeHead(204, headers);
      res.end();
      return;
    }
    
    console.log('step 2');
    
    // Parse request body
    if (req.method === 'POST') {
      console.log('step 3');
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      console.log('step 4');
      req.on('end', () => {
        console.log('step 5');
        const parsedBody = JSON.parse(body);
        console.log('step 6');
        console.log(parsedBody);
        console.log(parsedBody.query);
        console.log(root);
        // Execute GraphQL query
        graphql({schema: schema, source: parsedBody.query, rootValue: root}).then((response) => {
          console.log('step 7');
          res.writeHead(200, headers);
          res.end(JSON.stringify(response));
          console.log('step 8');
          console.log('response:', response);
        });
      });
    } else {
      res.writeHead(200, headers);
      res.end(JSON.stringify({message: 'Server is running'}));
    }
  });
  
  server.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000');
  