import React from 'react';
import "components/DayListItem.scss"
import classNames from 'classnames';

export default function DayListItem(props) {
  let itemClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  })
  const formatSpots = function (input) {
    if(input === 0) {return 'no spots remaining'};
    if(input === 1) {return '1 spot remaining'};
    if(input > 1) {return `${input} spots remaining`}
  }

  return (
    <li data-testid="day" className={itemClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light" >{formatSpots(props.spots)}</h3>
    </li>
  )
};