// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Environment is an enumeration of the environments where the bunnies may live.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import naturalSelection from '../../naturalSelection.js';

export default class Environment extends EnumerationValue {

  static EQUATOR = new Environment();
  static ARCTIC = new Environment();

  static enumeration = new Enumeration( Environment );
}

naturalSelection.register( 'Environment', Environment );