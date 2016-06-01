/**
 * FlightToolsService
 *
 * @description :: Server-side logic for performing various service related tasks.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    url: '', apiKey: '', clientId: '',

    performRequest: function (hostname, endpoint, method, useJson, data, headers, success) {
        var request = require('request');

        var rq = {
            uri: hostname + endpoint,
            method: method,
            json: useJson,
            headers: headers
        };

        console.log('');
        console.log('');
        console.log('');
        console.log('');
        console.log('>>>>>>>>>>>>> Rest REQUEST');


        if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
            if (useJson){
                data = data;
            }
            else{
                var qs = require('querystring');
                data = qs.stringify(data);
            }
            rq.body = data;
        }
        else{
            rq.qs = data;
        }

        console.log(hostname + endpoint);
        console.time(endpoint + " Req time");
        request(rq, function (error, response, body) {
            console.timeEnd(endpoint + " Req time");
            console.log('');

            console.log('************ ///Headers **************');
            if (!error) {
                console.log('<<<<<<<<<<<<<< RESPONSE <<<<<<<<<');
                console.log("STATUS: " +response.statusCode);

                if (response.statusCode === 200 || response.statusCode === 201
                ) {
                    console.log('************ BODY **************');
                    if (!(typeof(body) === "object")) {
                        console.log(body.substring(0, 1000));
                    }
                }
                else{
                    console.log(response.headers);
                    console.log(data);
                    console.log(body);
                }

                success(error, body, response);

            }
            else{
                console.log('************Errors**************');
                console.dir(response);
                console.log(error);
                success(error,body);
            }

        })

    }

};

