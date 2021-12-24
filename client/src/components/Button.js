import React from "react";
import "components/Button.scss";
import classNames from "classnames";

export default function Button(props) {
  const buttonClass = classNames({
    'button': true,
    'button--confirm': props.confirm,
    'button--danger': props.danger,
  });

  return (
    <button 
    className={buttonClass}
    id={props.confirm ? "save--button" : "cancel--button"}
    onClick={props.onClick}
    disabled={props.disabled}
    >
      {props.children}
      </button>
  );
}
