const oracledb = require("oracledb");
const repl = require("repl");
const pjson = require("./package.json");
const constants = require("./configurations.json");
const chalk = require("chalk");
const Table = require("cli-table");

const getDbConfig = env => {
  const hostIp = constants[process.env.ENVIRONMENT].HOST_IP || "";
  const connectionString = constants[process.env.ENVIRONMENT].SID || "";

  return {
    user: constants[process.env.ENVIRONMENT].USERNAME || "",
    password: constants[process.env.ENVIRONMENT].PASSWORD || "",
    connectString: `(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = ${hostIp})(PORT = 1521)))(CONNECT_DATA = (SID = ${connectionString})))`
  };
};

const config = getDbConfig(process.env);
let conn;

function getTable(tableData) {
  const cleanedData = JSON.parse(
    JSON.stringify(tableData).replace(/null/gi, '"null"')
  );
  const table = new Table({
    head: cleanedData.metaData.map(v => {
      return v.name;
    })
  });
  cleanedData.rows.forEach(rw => {
    table.push(rw);
  });
  return table;
}

oracledb
  .getConnection(config)
  .then(res => {
    conn = res;
    console.log(chalk.green("Got Connection, starting REPL !!"));
    const replServer = repl.start({
      prompt: `${pjson.name}:${process.env.ENVIRONMENT}> `
    });

    replServer.on("exit", () => {
      console.log(
        chalk.red('Received "exit" event from REPL, closing connection !!')
      );
      conn.close();
      process.exit();
    });

    replServer.defineCommand("query", strQuery => {
      console.log(chalk.blueBright("query passed : ", strQuery));
      conn
        .execute(strQuery)
        .then(queryResult => {
          console.log(getTable(queryResult).toString());
          replServer.displayPrompt();
        })
        .catch(error => {
          console.error(error);
        });
    });
  })
  .catch(error => {
    console.error(error);
  });
