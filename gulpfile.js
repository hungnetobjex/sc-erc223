var gulp = require('gulp');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var del = require('del');
var gulpCopy = require('gulp-copy');
var gulpSequence = require('gulp-sequence');
var plumber = require('gulp-plumber');
var bytediff = require('gulp-bytediff');

var moment = require('moment-timezone'), assert= require('assert');
var BUILD_PATH = 'compiled/';
var processed_files = [], pragma_processed = false;
var path = require("path");
var fs = require('fs');

var Web3 = require('web3');
// const BigNumber = Web3.BigNumber;

function getUnixTime(x){
    return moment.tz(x, "America/Los_Angeles").valueOf()/1000;
}


var BigNumber = require('bignumber.js');
function expand_file(src, parent_path, reset) {
    if (reset) {
        pragma_processed = false;
        processed_files = [];
    }
    var absolutePath = !parent_path ? path.resolve(src) : path.resolve(parent_path + '/' + src);
    // console.log(absolutePath);

    var current_path = path.dirname(absolutePath);
    // console.log(processed_files.indexOf(absolutePath));

    if (processed_files.indexOf(absolutePath) != -1)
        return;
    console.log("Expanding source code file ", absolutePath);
    // console.log(parent_path+'/'+src);

    var data = fs.readFileSync(absolutePath, 'utf8');

    processed_files.push(absolutePath);
    return process_source(data, current_path);
}

function process_source(src, parent_path) {
    var out = [];
    var line = "";
    var data = src.split("\n");

    for (var i = 0; i < data.length; i++) {

        line = data[i];
        if (line.indexOf("import '") == 0) {
            var _import = line.split("'");

            var source = expand_file(_import[1], parent_path);
            if (source)
                out = out.concat(source.split("\n"));
        } else if (line.indexOf('import "') == 0) {
            var _import = line.split('"');
            var source = expand_file(_import[1], parent_path);
            if (source)
                out = out.concat(source.split("\n"));
        } else if (line.indexOf('pragma ') == 0) {
            if (pragma_processed)
                continue;
            else {
                pragma_processed = true;
                out.push(line);

            }
        } else {
            out.push(line);
        }

    }
    // console.log(1211,out);
    return out.join('\n');

}

function combineSolidity(path, name){
    var combinedsource = expand_file(path, '', true);
    fs.writeFile("./contracts/"+name+".sol", combinedsource, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file "+name+" was processed!");
    });
}
// console.log(expand_file('./contracts/IoTokenTest.sol'));
gulp.task('combine_solidity', ['clean'], function () {

    // combineSolidity('./contracts_dev/IoToken.sol',"IoToken");
    combineSolidity('./contracts_dev/Migrations.sol',"Migrations");
    // combineSolidity('./contracts_dev/ConvertLib.sol',"ConvertLib");
    combineSolidity('./contracts_dev/ERC223/MyToken.sol',"MyToken");


});

gulp.task('clean', [], function () {
    return del([
        'contracts/*.sol'
    ]);

});


gulp.task('generate_constructor', [], function () {
    var Web3EthAbi = require('web3-eth-abi');
    var encoded = Web3EthAbi.encodeParameters(['string','string','uint','uint','bool'], ['IoToken', 'ITC', new BigNumber(5000000000000000000000000000) , 18, 0]);
    console.log(encoded);
    var encoded = Web3EthAbi.encodeParameters(['uint[]'], [[
        getUnixTime("2017-08-07T00:00:00"), 178571428571428,
        getUnixTime("2017-10-11T00:00:00"), 0 ,
        getUnixTime("2017-12-08T00:00:00"), 178571428571428*2,
        getUnixTime("2018-01-11T00:00:00"), 0,
        getUnixTime("2050-01-11T00:00:00"), 0, //terminate the sale

    ]]);
    console.log(encoded);
    var encoded = Web3EthAbi.encodeParameters(['address','address','address','uint','uint','uint','address'],
        [
            "0xd45e62c5ae0fa84a40e6ce06ca9129ec51923e62",
            "0x238ea74d59538cc2b5da55201b2822f3a2012275",
        "0x02899893639f238031C91a8BfD798CE009a12235",
        getUnixTime("2017-08-07T00:00:00"),
        getUnixTime("2050-01-11T00:00:00"),
        100000000000000000000,
        "0x02899893639f238031C91a8BfD798CE009a12235"
    ]);
    console.log(encoded);
    var encoded = Web3EthAbi.encodeParameters(['address'],
        [
            "0x6997f915413c1cbf6192e85d911ea4b87cff3ca1"

    ]);
    console.log(encoded);

//     var abi = require('ethereumjs-abi');
//     console.log(abi);
// // need to have the ABI definition in JSON as per specification
//     // returns the encoded binary (as a Buffer) data to be sent
//     var encoded = abi.rawEncode([ "address" ], [ "0x02899893639f238031C91a8BfD798CE009a12235" ]);
//
// // returns the decoded array of arguments
//     var decoded = abi.rawDecode([ "address" ], encoded);
//     console.log(decoded.toString());
});



// Rerun the task when a file changes
// gulp.task('watch', function() {
//     gulp.watch(paths.compress_scripts, ['compress'])
//         .on('change', function(event) {
//             console.log('Compress:' + new Date().toLocaleString() + ' :: File ' + event.path + ' was ' + event.type + ', running tasks...');
//         });
//
//     gulp.watch(paths.concat_scripts, ['concat'])
//         .on('change', function(event) {
//             console.log('Concat:' + new Date().toLocaleString() + ' :: File ' + event.path + ' was ' + event.type + ', running tasks...');
//         });
//
//     gulp.watch([
//         'resources/assets/sass/**/*.scss',
//         'template/scss/**/*.scss',
//     ], ['sass']);
// });

// The default task (called when you run `gulp` from cli)


gulp.task('combine', gulpSequence('combine_solidity'));
gulp.task('default', gulpSequence('combine_solidity'));
gulp.task('generateabi', gulpSequence('generate_constructor'));