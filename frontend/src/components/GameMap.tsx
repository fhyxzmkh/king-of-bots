import { useEffect, useRef } from "react";
import { GameMapObject } from "../objects/GameMapObject.js";
import usePkStore from "../store/pkStore.js";

export const GameMap = () => {
  const parentRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { game_map, socket, setGameMapObject } = usePkStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const gameMapObj = new GameMapObject(
      ctx,
      parentRef.current,
      game_map,
      socket,
    );
    setGameMapObject(gameMapObj);
  }, []);

  return (
    <>
      <div
        className="w-full h-full flex justify-center items-center"
        ref={parentRef}
      >
        <canvas ref={canvasRef} tabIndex={0}></canvas>
      </div>
    </>
  );
};
