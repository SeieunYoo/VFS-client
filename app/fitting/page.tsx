"use client";

import { useEffect, useRef } from "react";

// import WebcamStreamCapture from "./_components/WebCapture";
const serverUrl = "ws://3.34.142.44:8080/signaling";
const FittingPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSettings = { width: 372, height: 480, frameInterval: 30 };

  let socket;
  let isStreaming = false;
  let videoStream = null;
  let chunkSize = 8000;

  const initializeVideoStream = async () => {
    const video = document.createElement("video");
    video.width = videoSettings.width;
    video.height = videoSettings.height;

    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = videoStream;
      video.play();
      video.addEventListener("play", () => sendFrame(video));
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const sendFrame = (video) => {
    if (!isStreaming) return;

    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context?.drawImage(video, 0, 0, 680, 400);
      const frame = canvasRef.current
        ?.toDataURL("image/jpeg", 0.5)
        .split(",")[1] as string;

      const totalChunks = Math.ceil(frame.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const chunk = frame.slice(i * chunkSize, (i + 1) * chunkSize);
        const message = JSON.stringify({
          chunk,
          chunkIndex: i,
          totalChunks,
        });

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(message);
        }
      }
    }

    setTimeout(() => sendFrame(video), 1);
  };

  const setupWebSocket = () => {
    socket = new WebSocket(serverUrl);

    socket.onopen = handleSocketOpen;
    socket.onmessage = handleSocketMessage;
    socket.onerror = handleSocketError;
    socket.onclose = handleSocketClose;
  };

  const handleSocketOpen = () => {
    console.log("WebSocket connection established");
    isStreaming = true;
    initializeVideoStream();
  };

  const handleSocketMessage = (event) => {
    console.log("displayFrame Success");
    displayFrame(`data:image/jpeg;base64,${event.data}`);
  };

  const handleSocketError = (error) => {
    console.error("WebSocket error:", error);
  };

  const handleSocketClose = (event) => {
    console.log("WebSocket connection closed", event);
    isStreaming = false;

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      videoStream = null;
    }
  };

  const displayFrame = (base64Image: string) => {
    const image = new Image();
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      image.onload = () => {
        context?.clearRect(0, 0, 372, 480);
        context?.drawImage(image, 0, 0, 372, 480);
      };
    }
    image.onerror = (error) => console.error("Error loading image:", error);
    image.src = base64Image;
  };

  useEffect(() => {
    if (document !== null) {
      const enterRoomBtn = document.getElementById("enterRoomBtn1");
      if (enterRoomBtn) {
        enterRoomBtn.addEventListener("click", setupWebSocket);
      }
    }
  }, []);
  return (
    <div>
      <button id="enterRoomBtn1">s</button>
      <canvas
        id="localStreamCanvas"
        width="640"
        height="480"
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default FittingPage;
