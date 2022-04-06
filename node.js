const toonify = require('toonify');
// const deepai = require('deepai');

module.exports = function (RED) {
    function FunctionNode(n) {
        RED.nodes.createNode(this, n);
        if (RED.nodes.getNode(n.creds)){
            this.accessKey = RED.nodes.getNode(n.creds).credentials.accessKey;
        } else {
            this.accessKey = "";
        }
        var node = this;
        this.name = n.name;
        for (var key in n) {
            node[key] = n[key] || "";
        }
        const cartoon = new toonify(node.accessKey);
        // deepai.setApiKey(node.accessKey);


        this.on('input', function (msg) {
            for (var i in msg) {
                if (i !== 'req' | i !== 'res' | i !== 'payload' | i !== 'send' | i !== '_msgid') {
                    node[i] = msg[i] || node[i];
                }
            }
            try{
                node.error(node.url);
                node.error(node.destination);

                cartoon.transform({
                    photo: node.url,
                    // To save the image to a specific path
                    destinyFolder: node.destination
                })
                    .then(data => {
                        node.error('Image', data);
                        msg.payload = data;
                        node.send(msg);
                    })
                    .catch(err => {
                        node.error('Error', err);
                        msg.payload = err;
                        node.send(msg);
                    })



            }catch (e){
                node.error(e);
            }
        });
    }


    RED.nodes.registerType("toonify", FunctionNode, {
        credentials: {
            accessKey: {type:"text"}
        }
    });

    function deepaiApiKey(n){
        RED.nodes.createNode(this, n);
        this.accessKey = n.accessKey;
    }

    RED.nodes.registerType("deepaiApiKey", deepaiApiKey,{
        credentials: {
            accessKey: {type:"text"}
        }
    });
};

