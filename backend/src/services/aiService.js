const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

class AIService {
    constructor() {
        this.model = null;
        this.labels = null;
    }

    async init() {
        if (this.model) return;

        const modelFolder = path.resolve(__dirname, '../../ai_model');
        const modelJsonPath = path.join(modelFolder, 'model.json');
        const weightsBinPath = path.join(modelFolder, 'weights.bin');
        const metadataPath = path.join(modelFolder, 'metadata.json');

        // Verify files exist
        if (!fs.existsSync(modelJsonPath))
            throw new Error(`model.json missing at ${modelJsonPath}`);
        if (!fs.existsSync(weightsBinPath))
            throw new Error(`weights.bin missing at ${weightsBinPath}`);
        if (!fs.existsSync(metadataPath))
            throw new Error(`metadata.json missing at ${metadataPath}`);

        try {
            // 1. Read model.json
            const modelJson = JSON.parse(fs.readFileSync(modelJsonPath, 'utf8'));

            // 2. Read weights.bin as ArrayBuffer
            const weightsBuffer = fs.readFileSync(weightsBinPath);
            const weightsArrayBuffer = weightsBuffer.buffer.slice(
                weightsBuffer.byteOffset,
                weightsBuffer.byteOffset + weightsBuffer.byteLength
            );

            // 3. Create a custom IOHandler that provides the weights data
            const customHandler = {
                async load() {
                    // Load weights from the single .bin file
                    const weightSpecs = modelJson.weightsManifest[0].weights;
                    const weightData = weightsArrayBuffer;

                    return {
                        modelTopology: modelJson.modelTopology,
                        weightSpecs: weightSpecs,
                        weightData: weightData,
                    };
                },
            };

            // 4. Load the model using the custom handler
            this.model = await tf.loadLayersModel(customHandler);

            // 5. Load labels
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            this.labels = metadata.labels;

            console.log("✅ AI Model & Labels Loaded Successfully (using custom file reader)");
        } catch (error) {
            console.error("❌ Model Load Error:", error);
            throw new Error(`Model loading failed: ${error.message}`);
        }
    }

    decodeImage(buffer) {
        try {
            const rawImageData = jpeg.decode(buffer, { useTps: true });
            const { width, height, data } = rawImageData;
            const buffer32 = new Float32Array(width * height * 3);

            for (let i = 0; i < width * height; i++) {
                buffer32[i * 3] = data[i * 4] / 255.0;
                buffer32[i * 3 + 1] = data[i * 4 + 1] / 255.0;
                buffer32[i * 3 + 2] = data[i * 4 + 2] / 255.0;
            }
            return tf.tensor3d(buffer32, [height, width, 3]);
        } catch (e) {
            throw new Error("Invalid image format. Please use a standard JPEG.");
        }
    }

    async predict(imageBuffer) {
        await this.init();

        return tf.tidy(() => {
            const imageTensor = this.decodeImage(imageBuffer);
            const processedTensor = imageTensor
                .resizeNearestNeighbor([224, 224])
                .expandDims(0);

            const prediction = this.model.predict(processedTensor);
            const scores = prediction.dataSync();
            const maxIndex = scores.indexOf(Math.max(...scores));

            return {
                label: this.labels[maxIndex],
                confidence: parseFloat((scores[maxIndex] * 100).toFixed(2)),
            };
        });
    }
}

module.exports = new AIService();