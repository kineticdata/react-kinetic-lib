import React from "react";

export const Form = ({ private: priv, slug }) => (
  <div>
    Viewing form <strong>{slug}</strong> in {priv ? "private" : "public"} mode
  </div>
);
