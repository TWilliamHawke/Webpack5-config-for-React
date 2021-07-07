import { useState } from "react";
import React from "react";

export const Input = () => {
  const [name, setName] = useState("");

  const onChange = (e) => {
    setName(e.target.value);
  };

  const send = (e) => {
    e.preventDefault();
    console.log(name);
  };

  return (
    <div>
      <form onSubmit={send}>
        <input value={name} onChange={onChange} />
      </form>
    </div>
  );
};
