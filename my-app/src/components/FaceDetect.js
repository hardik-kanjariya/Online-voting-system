
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { ToastContainer, toast } from 'react-toastify';
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam';
import draw from './utilities';
const obj={
  x:0,
  y:0,
  score:0
}

function FaceDetect() {
    const [result,setResult]=useState([])
    let canvasRef=useRef(null)
    const [canvas, setCanvas] = useState(null);
    const [video, setVideo] = useState(null);
    const [title, changeTitle] = useState('text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white')
    useEffect(()=>{
        const video = document.getElementById('video')
        setVideo(document.getElementById("video"));
       Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]).then(startVideo)
      function startVideo() {
        navigator.getUserMedia(
          { video: {} },
          stream => video.srcObject = stream,
          err => console.error(err)
        )
      }
      
      video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video)
        
        canvas.id="canvas"
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          faceapi.draw.drawDetections(canvas, resizedDetections)
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        //   console.log(detections);
          if(detections!=[] && detections.length>0){
            detections.forEach(value=>{

              setResult(value)
              
            })
          }
        }, 100)
      })
    },[])
    obj.x=result.detection?._box?._x
    obj.y=result.detection?._box?._y
    obj.score=result.detection?._score
    console.log(result.detection);
    console.log(obj);
    
  return (
        <div style={{ textAlign: "center" }}>
            <div>
                <h1 className={title}>
                    Please Adjust your face properly in the camera to recognize
                </h1>
            </div>
           
            <Webcam id="video"  width={720} height={560} autoPlay={true} playsInline muted style={{marginTop:"10px"}}/>
               
                {/*<button onClick={detectFace}>detect</button> */}
            </div>
    );
}

export default FaceDetect;
export {obj}
