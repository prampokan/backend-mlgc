const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classes = ['Melanocytic nevus', 'Squamous cell carcinoma', 'Vascular lesion'];

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let explanation, suggestion;
 
        if (label === 'Melanocytic nevus') {
          explanation = "Melanocytic nevus, atau tahi lalat, adalah lesi kulit jinak yang berasal dari sel penghasil pigmen. Mereka biasanya berwarna coklat atau hitam dan bervariasi dalam ukuran dan bentuk. Meski umumnya tidak berbahaya, perubahan dalam tahi lalat bisa mengindikasikan melanoma, jenis kanker kulit yang serius."
          suggestion = "Segera konsultasi ke dokter jika ukuran semakin membesar dengan cepat, mudah luka atau berdarah."
        }
       
        if (label === 'Squamous cell carcinoma') {
          explanation = "Squamous cell carcinoma (SCC) adalah kanker kulit yang berasal dari sel skuamosa, sering muncul sebagai bercak merah atau luka tidak sembuh pada kulit yang terpapar sinar matahari. Faktor risiko utamanya adalah paparan sinar UV. Meski bisa menyebar, pengobatan dini biasanya efektif."
          suggestion = "Segera konsultasi ke dokter untuk meminimalisir penyebaran kanker."
        }
       
        if (label === 'Vascular lesion') {
          explanation = "Vascular lesion adalah kelainan pada pembuluh darah yang muncul di kulit atau jaringan lainnya. Mereka bisa berupa bercak merah, ungu, atau biru, dan dapat bersifat bawaan atau berkembang seiring waktu. Contoh umum termasuk hemangioma, spider veins, dan port-wine stains."
          suggestion = "Segera konsultasi ke dokter untuk konsultasi secara lebih detail terkait tingkat bahaya penyakit."
        }

        return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
    
}

module.exports = predictClassification;