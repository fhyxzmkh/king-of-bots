import { useEffect, useRef } from "react";
import { GameMapObject } from "../objects/GameMapObject";

export const GameMap = () => {
  const parentRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new GameMapObject(ctx, parentRef.current);
  }, []);

  return (
    <>
      <div
        className="w-full h-full flex justify-center items-center"
        ref={parentRef}
      >
        <canvas ref={canvasRef} tabIndex="0"></canvas>
      </div>
    </>
  );
};
