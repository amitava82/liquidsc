import superagent from 'superagent';
const methods = ['get', 'post', 'put', 'patch', 'del'];
const Promise = require('bluebird');

Promise.config({
    // Enable cancellation.
    cancellation: true
});

class _ApiClient {
    constructor(req, config) {
        function formatUrl(path, prefix) {
            if(path.indexOf('http') > -1) return path;

            const _prefix = prefix === false ? '' : '/api';

            const adjustedPath = path[0] !== '/' ? '/' + path : path;
            if (typeof window === 'undefined') {
                // Prepend host and port of the API server to the path.
                return 'http://' + config.get('host') + ':' + config.get('port') + _prefix + adjustedPath;
            }
            // Prepend `/api` to relative URL, to proxy to API server.
            return _prefix + adjustedPath;
        }
        methods.forEach((method) =>
            this[method] = (path, {params, data, files, schema, prefix, headers} = {}) => new Promise((resolve,reject,onCancel) => {

                const url = formatUrl(path, prefix);
                const request = superagent[method](url);

                if(method != 'get' && !data){
                    data = params;
                    params = null;
                }

                if(headers){
                    request.set(headers);
                }

                if (params) {
                    request.query(params);
                }else{
                    params = {};
                    params._ = new Date().getTime();
                    request.query(params);
                }

                if (typeof window === 'undefined' && req && req.get('cookie')) {
                    request.set('cookie', req.get('cookie'));
                }

                if(files) {
                    files.forEach(f => request.attach(f.field, f.value));
                    request.field('model', JSON.stringify(data))
                } else  if (data) {
                    request.send(data);
                }

                request.end((err, {body} = {}) => {
                    if(err){
                        return reject(body || err);
                    }else {
                        return resolve(body);
                    }
                });

                onCancel(() => request.abort());

            }));
    }
}

const ApiClient = _ApiClient;

export default ApiClient;