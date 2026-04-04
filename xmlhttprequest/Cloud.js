function request(method, url, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: xhr.response,
                    });
                }
            }
        }

        xhr.onerror = () => reject({
            status: xhr.status,
            statusText: xhr.statusText,
        });

        xhr.send(data);
    });
}

export class Cloud {
    constructor(routes) {
        this.routes = routes;
    }

    get(url) {
        if (this.routes) {
            url = this.routes.get;
        }

        return request("GET", url);
    }

    post(url, data) {
        if (this.routes) {
            data = url;
            url = this.routes.post;
        }

        const payload = new FormData();

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                payload.append(key, data[key]);
            }
        }

        return request("POST", url, payload);
    }
}