const ImageJS = require('image-js').Image;
const cannyEdgeDetector = require('canny-edge-detector');


/* 
* Define some function
*
*/
module.exports = {
    loadImage: async function (path) {
        return ImageJS.load(path);
    },


    saveImage: function (image, output, resizeOptions = null) {
        if (null != resizeOptions) {
            image = image.resize(resizeOptions)
        }
        return image.save(output);
    },


    cropImage: function(image, x, y, width, height) {
        return image.crop({
            'x': x,
            'y': y,
            'width': width,
            'height': height
        })
    },


    candyEdgeDetection: function (img) {
        const grey = img.grey();
        const edge = cannyEdgeDetector(grey, {
            'lowThreshold': 75,
            'highThreshold': 100
        });
        return edge;
    },


    getSize: function (img) {
        return {
            "width": img.sizes[0],
            "height": img.sizes[1]
        }
    },

    /*
    * Use for detect index end length of x-axis
    * @param arr is an image to detect
    * @param length is width of 2nd array
    * @param size is length of this axis
    * @param padding is distance from the margin
    * @param min is limit the available space
    */
    detectX: function (new_img, length, size, padding = 25, min = 150) {
        var result = { 'start': 0, 'length': 0 }, temp = 0;
        for (var index = 0; index < length - 200; index++) {
            arr = copy(new_img, index, size, length, "vertical");
            countX = count(arr);
            if (countX < 5)
                countX = 0;
            if (result['start'] == 0 && countX != 0) {
                result['start'] = Math.max(0, index - 30);
                continue;
            }
            else if (result['start'] != 0 && countX == 0) {
                temp = temp + 1;
                if (temp == padding) {
                    result['length'] = index - padding - result['start'] + 60;
                    if (result['length'] > min)
                        break;
                    else {
                        result['start'] = 0;
                        result['length'] = 0;
                        temp = 0;
                    }
                }
            }
            else if (result['start'] != 0 && countX > 0) {
                temp = 0;
            }
        }
        if (result['length'] == 0) {
            result['length'] = size - 200 - padding - result['start'] + 60;
        }
        return result
    },



    /*
    * Use for detect index end length of y-axis
    * @param new_img is an image to detect
    * @param length is height of 2nd array
    * @param size is length of this axis
    * @param padding is distance from the margin
    * @param min is limit the available space
    */
    detectY: function (new_img, length, size, padding = 50, min = 210) {
        var result = { 'start': 0, 'length': 0 }, temp = 0;
        for (var index = 200; index < length; index++) {
            arr = copy(new_img, index, size, 1, "horizontal");
            countY = count(arr);
            if (countY < 5)
                countY = 0;
            if (result['start'] == 0 && countY != 0) {
                result['start'] = Math.max(0, index - 30);
                continue;
            }
            else if (result['start'] != 0 && countY == 0) {
                temp = temp + 1;
                if (temp == padding) {
                    result['length'] = index - padding - result['start'] + 60;
                    if (result['length'] > min)
                        break;
                    else {
                        result['start'] = 0;
                        result['length'] = 0;
                        temp = 0;
                    }
                }
            }
            else if (result['start'] != 0 && countY > 0)
                temp = 0;
        }
        if (result['length'] == 0)
            result['length'] = size - padding - result['start'] + 60;
        return result;
    }
}


/*
* @param image is image data
*/
function count(image) {
    var imageSize = image.length;
    var count = 0;
    for (var index = 0; index < imageSize; index++) {
        if (image[index] > 0) {
            count++;
        }
    }
    return count;
}


/*
* @param image is image data
* @param index is index of column or row want to copy
* @param length is length of column or row
* @param space is space between two element, 1 for horizontal and width for vertical
* @param dimension is horizontal(row) or vertical(column)
*/
function copy(image, index, length, space = 1, dimension = "horizontal") {
    var result = new Array();
    var pointer = limit = 0;
    if (dimension == "horizontal") {
        pointer = index * length;
        limit = pointer + length;
    } else {
        pointer = index;
        limit = image.length;
    }
    while (pointer < limit) {
        result.push(image[pointer]);
        pointer += space;
    }
    return result;
}