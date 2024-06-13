const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    return tf.loadGraphModel('https://storage.googleapis.com/model_ml_pramudya/model.json');
}

module.exports = loadModel;