
# Troubleshooting

When troubleshooting, you may see unexpected behaviors or receive an error message. This section provide links or minor instructions for identifying the cause of the problem and how to resolve it. 

This document lists frequent cases of misusing and frequent problems with different enviroments. To report or discuss details, [use the issues](https://github.com/postgraphql/postgraphql/issues).


## Installing by npm

'''Linux and Mac''':

1. The most commom error on `npm install -g postgraphql` is *"EACCES: permission denied"*, and sometimes the natural `sudo npm install` is not the best solution. For all alternatives, see  [this tutorial of "Installing global node modules"](https://github.com/nodeschool/discussions/wiki/Installing-global-node-modules-(Linux-and-Mac)). <br/>Details at [issue #495](https://github.com/postgraphql/postgraphql/issues/495).

2. ..


'''Windows''':

1. ...

## Using the command line `postgraphql`

1. A commom misuse have origim in the interpretation of "what is default", causing  authentication errors. The best way to check is the case, is to express the conectin string with `-c` option. Example: `postgraphql -c postgres://postgres:postgres@localhost:5432/issn`. Compare with the conection of your usual `psql`  command, eg. `PGPASSWORD=postgres psql -U postgres issn`, must be consistent.<br/>Details at [issue #495](https://github.com/postgraphql/postgraphql/issues/495).

2. ...


## Quering with /graphiql

...
 
