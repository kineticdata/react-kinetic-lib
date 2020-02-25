import React, { useState } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import { ObjectType } from './ObjectType';

const badgeStyle = {
  color: '#6699cc',
  textDecoration: 'underline',
};

const popperStyle = {
  backgroundColor: '#fff',
  borderRadius: '3px',
  boxShadow: '0 0 3px 0 rgba(0,0,0,0.3)',
  color: 'black',
  padding: '.75rem',
};

export const TypePopover = props => {
  const [open, setOpen] = useState(false);
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <span
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            ref={ref}
            style={badgeStyle}
          >
            {props.name}
            {open && (
              <Popper placement="bottom-start">
                {({ ref, style, placement }) => (
                  <div
                    ref={ref}
                    style={{ ...popperStyle, ...style }}
                    data-placement={placement}
                  >
                    <ObjectType typeSpec={props.typeSpec} />
                  </div>
                )}
              </Popper>
            )}
          </span>
        )}
      </Reference>
    </Manager>
  );
};
