"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const serverUrl = "ws://3.34.142.44:8080/signaling";

// const videoSettings = { width: 320, height: 240, frameInterval: 30 };
// const chunkSize = 8000;

// const WebStream: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const socketRef = useRef<WebSocket | null>(null);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

//   // Initialize video stream
//   const initializeVideoStream = async () => {
//     console.log("client webcam", videoRef.current);
//     if (!videoRef.current) return;
//     console.log("client webcam2", videoRef.current);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       console.log(stream);
//       setVideoStream(stream);
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//       sendFrame(videoRef.current);
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   // Send frame logic
//   const sendFrame = (video: HTMLVideoElement) => {
//     console.log(video);
//     if (
//       !isStreaming ||
//       !canvasRef.current ||
//       !socketRef.current ||
//       !videoRef.current
//     )
//       return;

//     const context = canvasRef.current.getContext("2d");
//     if (!context) return;

//     // Draw video frame onto the canvas
//     context.drawImage(
//       video,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );

//     // Convert canvas to base64 image
//     const frame = videoRef.current.toDataURL("image/jpeg", 0.5).split(",")[1];
//     const totalChunks = Math.ceil(frame.length / chunkSize);

//     for (let i = 0; i < totalChunks; i++) {
//       const chunk = frame.slice(i * chunkSize, (i + 1) * chunkSize);
//       const message = JSON.stringify({
//         chunk,
//         chunkIndex: i,
//         totalChunks,
//       });

//       if (socketRef.current.readyState === WebSocket.OPEN) {
//         socketRef.current.send(message);
//       }
//     }

//     setTimeout(() => sendFrame(video), videoSettings.frameInterval);
//   };

//   // WebSocket setup
//   const setupWebSocket = () => {
//     socketRef.current = new WebSocket(serverUrl);

//     socketRef.current.onopen = () => {
//       console.log("WebSocket connection established");
//       setIsStreaming(true);
//       initializeVideoStream();
//     };

//     socketRef.current.onmessage = (event) => {
//       console.log(event);
//       displayFrame(`data:image/jpeg;base64,${event.data}`);
//     };

//     socketRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     // socketRef.current.onclose = (event) => {
//     //   console.log("WebSocket connection closed:", event);
//     //   setIsStreaming(false);

//     //   // Stop video stream
//     //   if (videoStream) {
//     //     videoStream.getTracks().forEach((track) => track.stop());
//     //     setVideoStream(null);
//     //   }
//     // };
//   };

//   // Display received frame
//   const displayFrame = (base64Image: string) => {
//     if (!canvasRef.current) return;

//     const image = new Image();
//     image.onload = () => {
//       const context = canvasRef.current?.getContext("2d");
//       if (context && canvasRef.current) {
//         context.clearRect(
//           0,
//           0,
//           canvasRef.current.width,
//           canvasRef.current.height
//         );
//         context.drawImage(
//           image,
//           0,
//           0,
//           canvasRef.current.width,
//           canvasRef.current.height
//         );
//       }
//     };
//     image.onerror = (error) => console.error("Error loading image:", error);
//     image.src = base64Image;
//   };

//   useEffect(() => {
//     return () => {
//       // Clean up WebSocket and video stream on unmount
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//       if (videoStream) {
//         videoStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [videoStream]);

//   return (
//     <div>
//       <button id="enterRoomBtn1" onClick={setupWebSocket}>
//         Enter Room
//       </button>
//       <video
//         height={videoSettings.height}
//         ref={videoRef}
//         style={{ display: "none" }}
//         width={videoSettings.width}
//       />
//       <canvas
//         height={videoSettings.height}
//         ref={canvasRef}
//         style={{ border: "1px solid black" }}
//         width={videoSettings.width}
//       />
//     </div>
//   );
// };

// export default WebStream;

