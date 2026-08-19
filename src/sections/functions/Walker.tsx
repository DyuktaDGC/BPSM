import { forwardRef } from 'react';
import Vehicles from './vehicles';

const Walker = forwardRef<HTMLDivElement>(function Walker(_props, ref) {
  return (
    <div ref={ref} className="walker idle" data-vehicle="walk" aria-hidden="true">
      <div className="walker__flip">
        <div className="walker__hop">
          <div className="walker__lift">
            <Vehicles />
          </div>
        </div>
      </div>
      <div className="walker__shadow" />
    </div>
  );
});

export default Walker;