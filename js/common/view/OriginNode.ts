// Copyright 2020-2022, University of Colorado Boulder

/**
 * OriginNode is a debugging node used to show an object's origin. Enable via ?showOrigin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Circle } from '../../../../scenery/js/imports.js';
import naturalSelection from '../../naturalSelection.js';

export default class OriginNode extends Circle {

  public constructor( radius = 2 ) {
    super( radius, { fill: 'red' } );
  }
}

naturalSelection.register( 'OriginNode', OriginNode );