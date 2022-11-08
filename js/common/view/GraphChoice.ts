// Copyright 2019-2022, University of Colorado Boulder

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

  public static readonly POPULATION = new GraphChoice();
  public static readonly PROPORTIONS = new GraphChoice();
  public static readonly PEDIGREE = new GraphChoice();
  public static readonly NONE = new GraphChoice();

  public static readonly enumeration = new Enumeration( GraphChoice );
}

naturalSelection.register( 'GraphChoice', GraphChoice );