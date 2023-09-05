import React from "react";

export function Hint({ hintsNumber = "0", onclick }) {
  const style = {
    "--content": `"${hintsNumber}"`,
  };
  return (
    <div className="hint" style={style}>
      <button
        className=" relative grid h-10 w-10 place-content-center rounded-full bg-light-secondary before:absolute before:-right-1 before:-top-3 before:h-5 before:w-5 before:cursor-auto before:rounded-full before:bg-primary before:text-sm before:font-bold before:leading-tight before:text-white dark:bg-dark-secondary"
        onClick={onclick}
      >
        <i
          className="fa-regular fa-lightbulb text-xl text-[#D4AF37] dark:text-[#FFD700] 
      "
        ></i>
      </button>
    </div>
  );
}
