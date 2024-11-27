"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { LinkIcon } from "@/components/Icons/LinkIcon";

import { Navigation } from "./_components/Navigation";

// import WebcamStreamCapture from "./_components/WebCapture";

const serverUrl = "ws://3.34.142.44:8080/signaling";
const FittingPage = () => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const canvasRef2 = useRef<HTMLCanvasElement>(null);
  // const videoRef = useRef<HTMLVideoElement | null>(null);
  // const videoSettings = { width: 372, height: 480, frameInterval: 1 };

  // let socket: WebSocket | null = null;
  // let isStreaming = false;
  // let videoStream: MediaStream | null = null;
  // let chunkSize = 8000;

  // const initializeVideoStream = async () => {
  //   const video = document.createElement("video");
  //   video.width = videoSettings.width;
  //   video.height = videoSettings.height;

  //   try {
  //     videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     video.srcObject = videoStream;
  //     video.play();
  //     video.addEventListener("play", () => sendFrame(video));
  //   } catch (error) {
  //     console.error("Error accessing webcam:", error);
  //   }
  // };

  // const sendFrame = (video: HTMLVideoElement) => {
  //   if (!isStreaming) return;

  //   if (canvasRef.current) {
  //     console.log(video);
  //     const context = canvasRef.current.getContext("2d");
  //     context?.drawImage(video, 0, 0, 372, 480);
  //     const frame = canvasRef.current
  //       .toDataURL("image/jpeg", 0.5)
  //       .split(",")[1] as string;

  //     const totalChunks = Math.ceil(frame.length / chunkSize);

  //     for (let i = 0; i < totalChunks; i++) {
  //       const chunk = frame.slice(i * chunkSize, (i + 1) * chunkSize);
  //       const message = JSON.stringify({
  //         chunk,
  //         chunkIndex: i,
  //         totalChunks,
  //       });

  //       if (socket && socket.readyState === WebSocket.OPEN) {
  //         console.log(message);
  //         socket.send(message);
  //       }
  //     }
  //   }

  //   setTimeout(() => sendFrame(video), 1);
  // };

  // const setupWebSocket = () => {
  //   socket = new WebSocket(serverUrl);

  //   socket.onopen = handleSocketOpen;
  //   socket.onmessage = handleSocketMessage;
  //   socket.onerror = handleSocketError;
  //   socket.onclose = handleSocketClose;
  // };

  // const handleSocketOpen = () => {
  //   console.log("WebSocket connection established");
  //   isStreaming = true;
  //   initializeVideoStream();
  // };

  // const handleSocketMessage = (event: MessageEvent) => {
  //   console.log("displayFrame Success");
  //   displayFrame(`data:image/jpeg;base64,${event.data}`);
  // };

  // const handleSocketError = (error: Event) => {
  //   console.error("WebSocket error:", error);
  // };

  // const handleSocketClose = () => {
  //   console.log("WebSocket connection closed");
  //   isStreaming = false;

  //   if (videoStream) {
  //     videoStream.getTracks().forEach((track) => track.stop());
  //     videoStream = null;
  //   }
  // };

  // const displayFrame = (base64Image: string) => {
  //   const image = new Image();
  //   if (canvasRef2.current) {
  //     const context = canvasRef2.current.getContext("2d");
  //     image.onload = () => {
  //       context?.clearRect(0, 0, 372, 480);
  //       context?.drawImage(image, 0, 0, 372, 480);
  //       console.log(image);
  //     };
  //   }
  //   image.onerror = (error) => console.error("Error loading image:", error);
  //   image.src = base64Image;
  // };

  // useEffect(() => {
  //   if (document !== null) {
  //     const enterRoomBtn = document.getElementById("enterRoomBtn1");
  //     if (enterRoomBtn) {
  //       enterRoomBtn.addEventListener("click", setupWebSocket);
  //     }
  //   }
  // }, []);
  const handleShareFittinImage = () => {
    async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "TryOnMe - Virtual Fitting Service",
            text: "피팅 예시 이미지",
            url: window.location.href,
          });
        } catch (error) {
          console.error("공유에 실패했습니다:", error);
        }
      } else {
        alert("현재 브라우저는 공유를 지원하지 않습니다.");
      }
    };
  };
  return (
    <div>
      <Navigation />
      <div className="h-[56px]" />
      <Image alt="" height={480} src="/fitting-example.png" width={372} />
      <div className="flex py-3">
        <button
          className="flex w-full lg:max-w-[412px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-black text-white text-base font-bold leading-normal tracking-[0.015em]"
          onClick={handleShareFittinImage}
        >
          <span className="truncate">Share Link</span>
          <LinkIcon />
        </button>
      </div>
      {/* <button id="enterRoomBtn1">start fitting</button>
      <button
        onClick={() => {
          handleSocketClose();
        }}
      >
        stop virtial fitting
      </button>
      <canvas height="480" ref={canvasRef} width="372"></canvas>
      <canvas height="480" ref={canvasRef2} width="372"></canvas> */}
    </div>
  );
};

export default FittingPage;
