# node-oracledb-repl
NodeJs REPL for interacting with Oracle Database using "oracledb" npm module

# Setup
1. Clone repo - `$git clone git@github.com:hrmeetsingh/node-oracledb-repl.git`
2. `$cd node-oracledb-repl`
3. `$yarn`
4. Edit "configurations.json" to add oracledb credentials - *Host_ip, Sid, username, password*
5. `$yarn setup:test` or `$yarn setup:dev`
6. `node-oracledb-repl> .query select 'Hello from oracle' from dual` (query withouts bounding quotes)
7. To exit REPL, `node-oracledb-repl>.exit`
