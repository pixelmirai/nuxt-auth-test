export function useUtils(){
    function setImageSize(imageUrl, size) {
        const questionMarkIndex = imageUrl.indexOf('?');
        if (questionMarkIndex === -1) {
            // If no query string, just append the new parameter
            return `${imageUrl}?w=${size}`;
        } else {
            // Replace or append the 'w' parameter
            const baseUrl = imageUrl.slice(0, questionMarkIndex);
            const queryParams = new URLSearchParams(imageUrl.slice(questionMarkIndex + 1));
            queryParams.set('w', size); // Sets 'w' parameter, replacing existing or adding new
            return `${baseUrl}?${queryParams}`;
        }
    }

    function setImageSizeV2(imageUrl, size) {
        // Check if the URL already has query parameters
        const hasQuery = imageUrl.includes('?');

        if (hasQuery) {
            // Remove existing width (w) parameter if it exists
            const urlWithoutW = imageUrl.replace(/(\?|&)w=\d*(&|$)/, '$1').replace(/&$/, '');
            // Append the new width parameter
            return `${urlWithoutW}&w=${size}`;
        } else {
            // No query parameters, just append
            return `${imageUrl}?w=${size}`;
        }
    }



    function getVisibleHeight(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
        return visibleHeight;
    }

    function getVisibleHeightRatio(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate the total height of the element
        const elementHeight = rect.height;

        // Calculate the visible height of the element
        const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));

        // Calculate the visible fraction
        const visibleHeightFraction = visibleHeight / elementHeight;

        // Ensure the fraction is between 0 and 1
        return Math.max(0, Math.min(1, visibleHeightFraction));
    }


    function indexOfLargest(arr) {
        if (arr.length === 0) return -1; // Return -1 if the array is empty

        let largestIndex = 0;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > arr[largestIndex]) {
                largestIndex = i;
            }
        }
        return largestIndex;
    }


    return{
        setImageSize,
        setImageSizeV2,
        getVisibleHeight,
        getVisibleHeightRatio,
        indexOfLargest,
    }
}