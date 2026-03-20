// Copyright 2019-2026, University of Colorado Boulder

/**
 * Environment is an enumeration of the environments where the bunnies may live.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class Environment extends EnumerationValue {

  public static readonly EQUATOR = new Environment();
  public static readonly ARCTIC = new Environment();

  public static readonly enumeration = new Enumeration( Environment );
}
