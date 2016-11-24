var yargs = require('yargs'),
    tim = require('tinytim').tim,
    readjson = require('readjson');

var argv = yargs.options({
            'file': {
                describe: 'File to use for generating matches'
            }
        })
        .help('h')
        .alias('h', 'help')
        .alias('f', 'file')
        .example('$0 --file <path to file>')
        .wrap(yargs.terminalWidth())
        .argv;

function getFile(path, cb) {
    readjson(path, function(err, data) {
        cb(err, data);
    });
}

function arrShuffle(lhs, rhs) {
    return (Math.ceil(Math.random() * 3) - 2);
}

function shuffleEntries(data) {
    return data.sort(arrShuffle);
}

function canMatch(from, to, allowSameToFrom) {
    if (from === to) {
        return false;
    }

    // it should be in both
    if('id' in from && from.id !== to.id) {
        return false;
    } else if(from.last === to.last) {
        return false;
    }

    // from field ha been set
    if ('from' in to && to.from !== null){
        if(allowSameToFrom) {
            return false;
        } else {
            if(to.from != from) {
                return false;
            }
        }
    }

    return true;
}

function doMatchFor(from, array, allowSameToFrom) {
    var matched = false;
    var to = null;

    for(var i = 0; i < array.length; i++) {
        to = array[i];
        matched = canMatch(from, to, allowSameToFrom);
        if (matched) {
            from['to'] = to;
            to['from'] = from;
            break;
        }
    }
    return matched;
}

function graph(elem) {
    var str = '';
    if (elem.from) {
        str += elem.from.first + ' -> ';
    }
    str += '*' + elem.first + '*';
    if (elem.to) {
        str += ' -> ' + elem.to.first;
    }
    return str;
}

function matchArray(master) {
    var current = null;
    var tmpArr = [];
    var matched = false;
    var allowSameToFrom = false;
    var i = 0;
    var tries = 0;

    do {
        for(i = 0; i < master.length; i++) {
            allowSameToFrom = (tries > 10);
            current = master[i];
            tmpArr = master.slice(0);
            tmpArr.splice(i, 1);
            matched = doMatchFor(current, shuffleEntries(tmpArr), allowSameToFrom);
            if(!matched) {
                break;
            }
        }

        if(!matched) {
            //console.log("Couldn't find a match for everyone. Restarting...");
            for(var i = 0; i < master.length; i++) {
                master[i]['to'] = null;
                master[i]['from'] = null;
            }
            master = shuffleEntries(master);
        }
        tries++;
    } while(!matched);
    return master;
}

function printResults(array) {
    console.log("===============================================");
    console.log("Gifter -> Giftee");
    console.log("-----------------------------------------------");
    for(var i = 0; i < array.length; i++) {
        console.log(tim("{{first}} {{last}} -> {{to.first}} {{to.last}}", array[i]));
    }

    console.log("===============================================");
    console.log("Summary:");
    console.log("-----------------------------------------------");
    for(var i = 0; i < array.length; i++) {
        console.log(tim("{{first}} {{last}}: " +
                        "from: {{from.first}} {{from.last}}, " +
                        "to: {{to.first}} {{to.last}}", array[i]));
    }
    console.log("===============================================");
}

function main() {
    var results = null;
    getFile(argv.file, function(err, data) {
        results = matchArray(data.people);
        printResults(results);
    });
}

main();
