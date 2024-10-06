import axios from 'axios';
import config from "./config";

export const uploadAndPredictImage = async (file, setImage, setError, appendResults, nextId) => {
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(`${config.API_BASE_URL}/predictions/predict`, formData, {
            withCredentials: true,
        });

        const {title, confidence, id, image_src} = response.data;
        const newImage = {
            id: id || `${nextId++}-${Date.now()}`,
            src: image_src,
            title: capitalizeFirstLetter(title),
            confidence: parseFloat(confidence).toFixed(2),
        };

        setImage(newImage);
        appendResults([newImage]);
        console.log('Prediction response received:', response.data);

        try {
            const saveResponse = await axios.post(`${config.API_BASE_URL}/predictions/save`, {
                title: newImage.title,
                confidence: newImage.confidence,
                image_src: newImage.src,
            }, {
                withCredentials: true,
            });

            console.log('Prediction saved:', saveResponse.data);
        } catch (saveError) {
            if (saveError.response && saveError.response.status === 401) {
                console.warn('Prediction not saved: User not authenticated.');
                setError('Result not saved. Please log in to save your predictions.');
            } else {
                console.error('Error saving prediction:', saveError);
                setError('Error saving prediction. Please try again later.');
            }
        }
    } catch (err) {
        if (err.response) {
            const {status, data} = err.response;
            switch (status) {
                case 400:
                    setError('Bad request. Please ensure the file is correct and try again.');
                    break;
                case 401:
                    setError('Unauthorized. Please log in and try again.');
                    break;
                case 403:
                    setError('Forbidden. You do not have permission to perform this action.');
                    break;
                case 500:
                    setError('Server error. Please try again later.');
                    break;
                default:
                    setError(`Unexpected error occurred (status code: ${status}). Please try again.`);
            }

        } else if (err.request) {
            console.error('No response received:', err.request);
            setError('No response from server. Please check your network connection and try again.');
        } else {
            console.error('Error:', err.message);
            setError(`Prediction failed: ${err.message}. Please try again.`);
        }
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
