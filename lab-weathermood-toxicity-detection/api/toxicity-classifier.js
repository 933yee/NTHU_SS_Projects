import * as toxicity from '@tensorflow-models/toxicity';

// set the minimum prediction confidence
const threshold = 0.3;

/**
 * Predict the mood (Happy/Sad/Fear) of a sentence 
 * @param {String}   text The input sentence from user
 * @param {Function} post The props.onPost from PostForm
 */
export async function predict(text, post) {
    let moodResult = 'happy';
    require('@tensorflow/tfjs');
    toxicity.load(threshold).then(model => {
        const sentences = text;
        model.classify(sentences).then(predictions => {
            if (predictions[0].results[0].match === true) {
                moodResult = "sad";
            } else if (predictions[1].results[0].match === true) {
                moodResult = "sad";
            } else if (predictions[2].results[0].match === true) {
                moodResult = "fear";
            } else if (predictions[3].results[0].match === true) {
                moodResult = "sad";
            } else if (predictions[4].results[0].match === true) {
                moodResult = "fear";
            } else if (predictions[5].results[0].match === true) {
                moodResult = "sad";
            } else if (predictions[6].results[0].match === true) {
                moodResult = "sad";
            }
            post(moodResult, text);
        });
    })

}