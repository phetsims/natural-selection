// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * GraphChoice is an enumeration of the graph choices that are available.
 * The user selects one of these choices via GraphChoiceRadioButtonGroup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import naturalSelection from '../../naturalSelection.js';

export default class GraphChoice extends EnumerationValue {

  static POPULATION = new GraphChoice();
  static PROPORTIONS = new GraphChoice();
  static PEDIGREE = new GraphChoice();
  static NONE = new GraphChoice();

  static enumeration = new Enumeration( GraphChoice );
}

naturalSelection.register( 'GraphChoice', GraphChoice );