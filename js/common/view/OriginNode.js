// Copyright 2020, University of Colorado Boulder

/**
 * OriginNode is a debugging node used to show an object's origin. Enable via ?showOrigin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Circle from '../../../../scenery/js/nodes/Circle.js';
import naturalSelection from '../../naturalSelection.js';

class OriginNode extends Circle {

  constructor() {
    super( 2, { fill: 'red' } );
  }
}

naturalSelection.register( 'OriginNode', OriginNode );
export default OriginNode;