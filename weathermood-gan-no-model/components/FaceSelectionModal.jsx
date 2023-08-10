import React from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';

import { getMoodUrl } from 'utilities/mood.js';

export default class FaceSelectionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            showDefaultFace: false,
            faceOriginImgUrl: getMoodUrl(),
            faceImgUrls: {
                Default: getMoodUrl(),
                Sad: getMoodUrl('Sad'),
                Happy: getMoodUrl('Happy'),
                Fear: getMoodUrl('Fearful')
            },
            fileUpload: null,
            faceImageData: []
        };
        this.getFacialExpressions = this.getFacialExpressions.bind(this);
        this.handleFaceFileChange = this.handleFaceFileChange.bind(this);
        this.scaleToFit = this.scaleToFit.bind(this);
        this.cropToFit = this.cropToFit.bind(this);
        this.getCanvasData = this.getCanvasData.bind(this);

        this.faceCanvasRef = React.createRef();
        this.moodCanvasRefs = [
            React.createRef(), React.createRef(), React.createRef()
        ]
    }

    render() {
        return (
            <React.Fragment>
                <canvas ref={this.faceCanvasRef} width={128} height={128} style={{ display: "none", width: "128px", height: "128px" }}></canvas>
                <canvas ref={this.moodCanvasRefs[0]} width={128} height={128} style={{ display: "none", width: "128px", height: "128px" }}></canvas>
                <canvas ref={this.moodCanvasRefs[1]} width={128} height={128} style={{ display: "none", width: "128px", height: "128px" }}></canvas>
                <canvas ref={this.moodCanvasRefs[2]} width={128} height={128} style={{ display: "none", width: "128px", height: "128px" }}></canvas>
                <Modal isOpen={this.props.showModal} toggle={this.props.changeFaceFile}>
                    <ModalHeader toggle={this.props.changeFaceFile}>
                        Upload Image
                    </ModalHeader>
                    <ModalBody className="d-flex flex-column justify-content-center align-items-center">
                        <img style={{ borderRadius: "1rem", objectFit: "cover" }} width={"128"} height={"128"} src={this.state.faceOriginImgUrl}></img>
                        <input style={{ display: "none" }} type="file" id="faceFile" onChange={this.handleFaceFileChange} />
                        <Button color="primary" className={"my-2"} onClick={() => { document.getElementById("faceFile").click() }}>Select File</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.getFacialExpressions}>Upload</Button>
                        <Button color="secondary" onClick={this.props.changeFaceFile}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }

    handleFaceFileChange(event) {
        var img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        console.log(`img.width: ${img.width}`);
        img.onload = () => {
            this.scaleToFit(this.faceCanvasRef.current, img);
        };
        this.setState({
            faceOriginImgUrl: window.URL.createObjectURL(event.target.files[0])
        });
    }


    scaleToFit(canvas, img) {
        var scaleX = canvas.width / img.width;
        var scaleY = canvas.height / img.height;
        img.width = img.width * scaleX;
        img.height = img.height * scaleY;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        return [scaleX, scaleY];
    }

    cropToFit(canvas, img) {
        var scale = img.width > img.height ? canvas.width / img.height : canvas.width / img.width;
        var offsetX = scale * (img.width > img.height ? -(img.width - img.height) / 2 : 0);
        var offsetY = scale * (img.height > img.width ? -(img.height - img.width) / 2 : 0);

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, offsetX, offsetY, parseInt(img.width * scale), parseInt(img.height * scale));
        return [offsetX, offsetY];
    }

    getCanvasData(data) {
        var out = [];
        for (var i = 0; i < 128; i++) {
            for (var j = 0; j < 128; j++) {
                out.push(data[i][j][0]);
                out.push(data[i][j][1]);
                out.push(data[i][j][2]);
                out.push(255);
            }
        }
        return out;
    }

    getFacialExpressions() {
        if (this.state.faceOriginImgUrl == getMoodUrl()) {
            return
        }

        var canvas = this.faceCanvasRef.current
        var ctx = canvas.getContext("2d");
        var pixels = [];

        var imgData = ctx.getImageData(0, 0, 128, 128).data;
        //console.log(`imgData: ${imgData}`);

        pixels.push([]);
        for (var i = 0; i < 128; i++) {
            pixels[0].push([]);
        }
        for (var i = 0; i < 128 * 128; i++) {
            var y = parseInt(i / 128, 10);
            pixels[0][y].push([
                Number.parseFloat((imgData[i * 4]).toFixed(5)), // Red
                Number.parseFloat((imgData[i * 4 + 1]).toFixed(5)), // Green
                Number.parseFloat((imgData[i * 4 + 2]).toFixed(5))  // Blue
            ]);
        }

        //console.log(`pixels: ${pixels}`);

        var data = Object();
        data.signature_name = "starGAN";
        data.inputs = {
            "input_img": pixels
        };

        // When you run python/python3 app.py on your computer, change to the local path.
        // const url = "http://127.0.0.1:5000/model/predict/";
        const url = "http://140.114.88.21:5000/model/predict/";
        console.log(`Making request to: ${url}`);
        this.props.setPredicting(true);
        this.props.changeFaceFile();
        fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then((res) => {
                var result = res['outputs'];
                var newFaceImgUrls = {
                    Default: this.state.faceOriginImgUrl
                }
                for (var key = 0; key < 3; key++) {
                    var data = this.getCanvasData(result[key]);

                    var moodCanvas = this.moodCanvasRefs[key].current;

                    var ctx = moodCanvas.getContext("2d");
                    var resultImgData = ctx.createImageData(128, 128);
                    resultImgData.data.set(Uint8ClampedArray.from(data));

                    ctx.putImageData(resultImgData, 0, 0);

                    var mood = Object.getOwnPropertyNames(this.state.faceImgUrls)[key + 1]
                    newFaceImgUrls[mood] = moodCanvas.toDataURL()
                }
                this.props.changeFaceImgUrls(newFaceImgUrls)
            }).catch(err => {
                this.props.setPredicting(false);
                console.error('Error geting faces', err);
            });;
    }
}