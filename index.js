const PreprocessImage =  require('./image_preprocessing.js');


// Load image
PreprocessImage.loadImage('inputImage.jpg').then((img) => {
    // Removed window frames and taskbar
    var imageSize = PreprocessImage.getSize(img);
    var image = PreprocessImage.cropImage(img, 0, 100, imageSize.width, imageSize.height - 200);
    
    // Convert image to gray
    var grayImage = PreprocessImage.candyEdgeDetection(image);
    var imageData = grayImage['data'];
    
    // Find the position of the workpiece in the image
    imageSize = PreprocessImage.getSize(image);
    var positionX = PreprocessImage.detectX(imageData, imageSize['width'], imageSize['height']); // x-axis
    var positionY = PreprocessImage.detectY(imageData, imageSize['height'], imageSize['width'], 50, 100); // y-axis

    console.log("Position x: ", positionX);
    console.log("position y: ", positionY);

    // Save result image
    PreprocessImage.saveImage(image.crop({
        'x': positionX.start,
        'y': positionY.start,
        'width': positionX.length,
        'height': positionY.length
    }), 'result.jpg', {
        'width': 512,
        'height': 512
    });
});